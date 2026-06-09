from fastapi import APIRouter

router = APIRouter()

@router.post("/{event_id}/attendants")
async def add_attendant(event_id: int):
    return {"message": f"Add attendant to event with ID {event_id}"}

@router.post("/{event_id}/attendants/bulk")
async def add_attendants_bulk(event_id: int):
    return {"message": f"Add bulk attendants to event with ID {event_id}"}

@router.get("/{event_id}/attendants")
async def get_attendants(event_id: int):
    return {"message": f"Get attendants for event with ID {event_id}"}

@router.post("/{event_id}/check-in")
async def check_in_attendant(event_id: int):
    return {"message": f"Check in attendant for event with ID {event_id}"}

@router.delete("/{event_id}/attendants/{attendant_id}")
async def remove_attendant(event_id: int, attendant_id: int):
    return {"message": f"Remove attendant with ID {attendant_id} from event with ID {event_id}"}