from sqlalchemy import Boolean, Column, Integer, String, DateTime, JSON
from sqlalchemy.sql import func

from app.db.base_class import Base

class AppUser(Base):
    __tablename__ = "app_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    username = Column(String, index=True, nullable=False)
    full_name = Column(String)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)
    
    # Multi-tenancy fields
    tenant_id = Column(Integer, index=True)
    organization_id = Column(Integer, index=True)
    organization_name = Column(String)
    role = Column(String, nullable=False, server_default='user')
    permissions = Column(JSON, nullable=False, server_default='{}')
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    def has_permission(self, permission: str) -> bool:
        """Check if user has a specific permission."""
        if self.is_superuser:
            return True
        return permission in (self.permissions.get('permissions', []) if self.permissions else []) 