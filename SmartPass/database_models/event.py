from .base import Base
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, TYPE_CHECKING
import uuid
import datetime

if TYPE_CHECKING:
    from .attendant import Attendant

class Event(Base):
    __tablename__ = "events"
    id: Mapped[uuid.UUID] = mapped_column(default=uuid.uuid4, primary_key=True, index=True)
    event_name: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    attendants: Mapped[List["Attendant"]] = relationship(back_populates="event", cascade="all, delete-orphan")