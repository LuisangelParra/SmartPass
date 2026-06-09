from pydantic import BaseModel, ConfigDict
import uuid
from datetime import datetime

class EventCreate(BaseModel):
    event_name: str
    
class Event(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    event_name: str
    created_at: datetime