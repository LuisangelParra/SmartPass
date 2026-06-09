from .base import Base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime
import uuid

class Event(Base):
    __tablename__ = "events"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_name = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False)