from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.base_class import Base

class RequestStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class ParticipationRequest(Base):
    __tablename__ = "participation_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    configuration_id = Column(Integer, ForeignKey("cer_configuration.id"), nullable=False)
    status = Column(String, nullable=False, default=RequestStatus.PENDING)
    request_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    processed_date = Column(DateTime(timezone=True))
    notes = Column(String, nullable=True)

    # Relationships
    user = relationship("User", backref="participation_requests")
    configuration = relationship("Configuration", backref="participation_requests")

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 