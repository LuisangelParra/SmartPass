from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
import datetime

from SmartPass.database_models import event as EventModel
from SmartPass.schemas import event as EventSchema
from SmartPass.database import get_db

router = APIRouter()

@router.post("/", response_model=EventSchema.Event)
async def create_event(event: EventSchema.EventCreate, db: Session = Depends(get_db)):
    db_event = EventModel.Event(event_name=event.event_name)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.get("/{event_id}", response_model=EventSchema.Event)
async def get_event(event_id: uuid.UUID, db: Session = Depends(get_db)):
    db_event = db.query(EventModel.Event).filter(EventModel.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

@router.delete("/{event_id}")
async def delete_event(event_id: uuid.UUID, db: Session = Depends(get_db)):
    db_event = db.query(EventModel.Event).filter(EventModel.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(db_event)
    db.commit()
    return db_event