from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.base_class import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    VENDOR = "vendor"  # rivenditore
    REFERENT = "referent"  # referente
    USER = "user"  # simple user

class UserType(str, enum.Enum):
    REAL = "real"  # Real user
    SIMULATED = "simulated"  # Simulated user for testing

class MemberType(str, enum.Enum):
    CONSUMER = "consumer"
    PRODUCER = "producer"
    PROSUMER = "prosumer"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    fiscal_code = Column(String, unique=True, index=True)  # Fiscal Code / VAT Number
    
    # User type and role
    type = Column(Enum(MemberType), nullable=False, default=MemberType.CONSUMER)
    user_type = Column(Enum(UserType), nullable=False, default=UserType.REAL)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.USER)
    
    # Status flags
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    
    # Additional info
    company_name = Column(String)  # For business users
    phone_number = Column(String)
    address = Column(String)
    preferences = Column(JSON, nullable=False, server_default='{}')  # User preferences
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    # Relationships
    member_profiles = relationship("Member", back_populates="user", cascade="all, delete-orphan")
    
    # Add relationship to CommunityUser
    community_user_id = Column(Integer, ForeignKey("community_users.id"), nullable=True)
    community_user = relationship("CommunityUser", back_populates="app_user")

class CommunityUser(Base):
    __tablename__ = "community_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    role = Column(String)
    status = Column(String)
    organization_id = Column(Integer, nullable=True)
    
    # Add relationship to User
    app_user = relationship("User", back_populates="community_user", uselist=False) 