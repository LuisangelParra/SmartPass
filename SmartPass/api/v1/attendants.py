import io
import zipfile
import datetime
from typing import List
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import uuid

from SmartPass.database_models import attendant as AttendantModel
from SmartPass.database_models import event as EventModel
from SmartPass.schemas import attendant as AttendantSchema
from SmartPass.schemas.checkin import CheckInRequest
from SmartPass.database import get_db

from SmartPass.services.core_ia import extract_embedding, decode_base64_frame, extract_frame_embedding_for_checkin

router = APIRouter()

@router.post("/{event_id}/attendants", response_model=AttendantSchema.Attendant)
async def add_attendant(event_id: uuid.UUID, name: str = Form(...), image: UploadFile = File(...), db: Session = Depends(get_db)):
    
    db_event = db.query(AttendantModel.Event).filter(AttendantModel.Event.id == event_id).first()
    
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")
    
    image_bytes = await image.read()
    
    try:
        embedding = extract_embedding(image_bytes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="An unexpected error occurred while processing the image.")
    
    
    db_attendant = AttendantModel.Attendant(
        event_id=event_id,
        name=name,
        embedding_face=embedding
    )
    db.add(db_attendant)
    db.commit()
    db.refresh(db_attendant)
    
    return db_attendant

@router.post("/{event_id}/attendants/bulk")
async def add_attendants_bulk(event_id: uuid.UUID, zip_file: UploadFile = File(...), db: Session = Depends(get_db)):
    
    event = db.query(AttendantModel.Event).filter(AttendantModel.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if not zip_file.content_type or zip_file.content_type != "application/zip":
        raise HTTPException(status_code=400, detail="Invalid file type. Only ZIP files are allowed.")
    
    zip_bytes = await zip_file.read()
    
    success_attendants = []
    errors = []
    allowed_extensions = {".jpg", ".jpeg", ".png"}
    
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as archive:
        for file_info in archive.infolist():
            if file_info.is_dir() or file_info.filename.startswith("__") or "/" in file_info.filename and file_info.filename.split("/")[-1].startswith("."):
                continue
    
            filename = file_info.filename.split("/")[-1]
            
            ext = "." + filename.split(".")[-1].lower() if "." in filename else ""
            if ext not in allowed_extensions:
                continue
            
            raw_name = filename.rsplit(".", 1)[0]
            clean_name = raw_name.replace("_", " ").replace("-", " ").strip()
            
            try:
                with archive.open(file_info) as file:
                    img_bytes = file.read()
                
                embedding = extract_embedding(img_bytes)
                
                new_attendant = AttendantModel.Attendant(
                    event_id=event_id,
                    name=clean_name,
                    embedding_face=embedding
                )
                success_attendants.append(new_attendant)
            except ValueError as e:
                errors.append({
                    "file": filename, 
                    "error": str(e)
                })
                continue
            except Exception:
                errors.append({
                    "file": filename, 
                    "error": "Invalid or corrupted image file."
                })
                continue
                
    if success_attendants:
        db.add_all(success_attendants)
        db.commit()
    
    return {
        "message": f"Processed {len(success_attendants)} attendants with {len(errors)} errors.",
        "errors": errors
    }

@router.get("/{event_id}/attendants", response_model=List[AttendantSchema.Attendant])
async def get_attendants(event_id: uuid.UUID, db: Session = Depends(get_db)):
    
    db_event = db.query(AttendantModel.Event).filter(AttendantModel.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    attendants = db.query(AttendantModel.Attendant).filter(AttendantModel.Attendant.event_id == event_id).all()
    return attendants

@router.post("/{event_id}/check-in", response_model=AttendantSchema.Attendant)
async def check_in_attendant(event_id: uuid.UUID, payload: CheckInRequest, db: Session = Depends(get_db)):
    event = db.query(EventModel.Event).filter(EventModel.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    try:
        frame = decode_base64_frame(payload.image_base64)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    current_embedding = extract_frame_embedding_for_checkin(frame)
    
    if not current_embedding:
        raise HTTPException(status_code=400, detail="No face detected in the current frame")

    closest_match = (
        db.query(
            AttendantModel.Attendant, 
            AttendantModel.Attendant.embedding_face.l2_distance(current_embedding).label("distance")
        )
        .filter(AttendantModel.Attendant.event_id == event_id)
        .filter(AttendantModel.Attendant.attended == False)
        .order_by("distance")
        .first()
    )

    if not closest_match:
        raise HTTPException(status_code=404, detail="No pending attendants found for this event")

    attendant, distance = closest_match

    THRESHOLD = 0.6
    if distance > THRESHOLD:
        raise HTTPException(status_code=401, detail="Face not recognized. Access denied.")

    attendant.attended = True
    attendant.attended_at = datetime.datetime.now(datetime.timezone.utc)
    
    db.commit()
    db.refresh(attendant)

    return attendant

@router.delete("/{event_id}/attendants/{attendant_id}", response_model=AttendantSchema.Attendant)
async def remove_attendant(event_id: uuid.UUID, attendant_id: uuid.UUID, db: Session = Depends(get_db)):
    db_attendant = db.query(AttendantModel.Attendant).filter(AttendantModel.Attendant.id == attendant_id, AttendantModel.Attendant.event_id == event_id).first()
    if not db_attendant:
        raise HTTPException(status_code=404, detail="Attendant not found")
    
    db.delete(db_attendant)
    db.commit()
    return db_attendant