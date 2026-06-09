from .base import Base
from sqlalchemy import String, DateTime, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pgvector.sqlalchemy import Vector
from typing import List
import uuid
import datetime

from .event import Event

class Attendant(Base):
    __tablename__ = "attendants"
    id: Mapped[uuid.UUID] = mapped_column(default=uuid.uuid4, primary_key=True, index=True)
    event_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("events.id"), ondelete="CASCADE")
    event: Mapped["Event"] = relationship(back_populates="attendants")
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    embedding_face: Mapped[Vector] = mapped_column(Vector(128))
    attended: Mapped[bool] = mapped_column(default=False)
    attended_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), nullable=True)