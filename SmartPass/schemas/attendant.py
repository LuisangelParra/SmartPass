from pydantic import BaseModel, ConfigDict
import uuid
from datetime import datetime
    
class Attendant(BaseModel):
    model_config__ = ConfigDict(from_attributes=True)
    id: uuid.UUID
    event_id: uuid.UUID
    name: str
    attended: bool
    attended_at: datetime | None