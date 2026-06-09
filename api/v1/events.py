from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def create_event():
    return {"message": "Event creation endpoint"}

@router.get("/{event_id}")
async def get_event(event_id: int):
    return {"message": f"Get event with ID {event_id}"}

@router.delete("/{event_id}")
async def delete_event(event_id: int):
    return {"message": f"Delete event with ID {event_id}"}