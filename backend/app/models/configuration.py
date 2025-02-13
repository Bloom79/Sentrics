from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class Configuration(Base):
    __tablename__ = "cer_configuration"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    type = Column(String, nullable=False)  # simulation, active
    legal_type = Column(String, nullable=False)  # cooperative, association
    status = Column(String, default="draft", nullable=False)  # draft, active, inactive
    
    # Location fields
    address = Column(String, nullable=False)
    location = Column(JSON, nullable=False)
    region = Column(String, nullable=False)
    primary_substation_id = Column(String, nullable=False)
    
    # Configuration settings
    technical_info = Column(JSON, nullable=False, server_default='{}')
    gse_compliance = Column(JSON, nullable=False, server_default='{}')
    simulation_settings = Column(JSON, nullable=True)
    billing_settings = Column(JSON, nullable=True)
    member_limits = Column(JSON, nullable=False, server_default='{}')
    
    # Metadata
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships - using string reference to avoid circular imports
    members = relationship("Member", back_populates="configuration", cascade="all, delete-orphan", lazy="selectin")
    
    # Add any relationships here if needed
    # members = relationship("Member", back_populates="configuration") 