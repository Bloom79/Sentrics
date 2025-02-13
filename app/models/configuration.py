from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func

from app.db.base_class import Base

class Configuration(Base):
    __tablename__ = "configurations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    type = Column(String, nullable=False)  # residential, commercial, industrial
    version = Column(String, nullable=False)
    status = Column(String, default="draft")  # draft, active, inactive
    
    # Energy related fields
    energy_source = Column(String, nullable=False)  # solar, wind, etc.
    capacity = Column(Float)  # in kW
    
    # Location fields
    address = Column(String, nullable=False)
    location = Column(JSON, nullable=False)
    region = Column(String, nullable=False)
    primary_substation_id = Column(String, nullable=False)
    
    # Configuration settings
    legal_type = Column(String, nullable=False)
    features = Column(JSON, nullable=False, server_default='{}')
    restrictions = Column(JSON, nullable=False, server_default='{}')
    technical_info = Column(JSON, nullable=False, server_default='{}')
    simulation_settings = Column(JSON, nullable=False, server_default='{}')
    billing_settings = Column(JSON, nullable=False, server_default='{}')
    member_limits = Column(JSON, nullable=False, server_default='{}')
    
    # Metadata
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())