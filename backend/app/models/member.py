from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Enum, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.base_class import Base

class MemberType(str, enum.Enum):
    CONSUMER = "consumer"
    PRODUCER = "producer"
    PROSUMER = "prosumer"

class LoadProfileType(str, enum.Enum):
    RESIDENTIAL = "residential"
    COMMERCIAL = "commercial"
    INDUSTRIAL = "industrial"
    CUSTOM = "custom"

class UserType(str, enum.Enum):
    REAL = "real"
    SIMULATED = "simulated"

class MemberStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"

class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    type = Column(Enum(MemberType), nullable=False)
    user_type = Column(Enum(UserType), nullable=False, default=UserType.REAL)
    status = Column(Enum(MemberStatus), nullable=False, default=MemberStatus.ACTIVE)
    
    # POD (Point of Delivery) Information
    pod_id = Column(String, unique=True, index=True)  # POD ID from utility company
    smart_meter_id = Column(String)  # Optional smart meter ID
    meter_type = Column(String)  # Type of meter (e.g., 2G, 1G)
    
    # Energy Profile
    load_profile_type = Column(Enum(LoadProfileType), nullable=False)
    load_profile_data = Column(JSON)  # Detailed load profile data
    contracted_power = Column(Float)  # in kW
    voltage_level = Column(String)
    
    # Status and Dates
    is_active = Column(Boolean, default=True)
    activation_date = Column(DateTime(timezone=True))
    deactivation_date = Column(DateTime(timezone=True))
    verification_status = Column(String)  # Status of POD verification
    
    # Technical Information
    technical_info = Column(JSON, nullable=True, server_default='{}')  # Technical specifications
    device_info = Column(JSON, nullable=True, server_default='{}')  # Connected devices info
    energy_sharing_preferences = Column(JSON, nullable=True, server_default='{}')  # Sharing preferences
    
    # Billing Information
    fiscal_code = Column(String)  # Fiscal Code / VAT Number
    billing_address = Column(String)
    billing_preferences = Column(JSON, nullable=True, server_default='{}')
    
    # Foreign Keys
    configuration_id = Column(Integer, ForeignKey("cer_configuration.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relationships
    configuration = relationship("Configuration", back_populates="members")
    user = relationship("User", back_populates="member_profiles")
    
    # Energy Statistics
    energy_produced = Column(Float, default=0.0)  # Total energy produced in kWh
    energy_consumed = Column(Float, default=0.0)  # Total energy consumed in kWh
    energy_shared = Column(Float, default=0.0)  # Total energy shared in kWh
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 