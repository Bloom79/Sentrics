from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    fiscal_code: str
    type: str  # consumer, producer, prosumer
    user_type: str  # real, simulated
    address: Optional[str] = None
    pod_id: Optional[str] = None
    smart_meter_id: Optional[str] = None
    has_asset_management: bool = False

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserInDB(UserInDBBase):
    hashed_password: str

class User(UserInDBBase):
    pass

class UserList(BaseModel):
    id: int
    name: str
    email: str
    fiscal_code: str
    type: str
    user_type: str
    status: str
    address: Optional[str] = None
    activation_date: datetime
    has_asset_management: bool
    configurations_count: int
    created_at: datetime

class UserDetail(UserInDB):
    total_production: Optional[float] = None
    total_consumption: Optional[float] = None
    self_consumption_rate: Optional[float] = None

class UserResponse(BaseModel):
    items: List[UserList]
    total: int
    page: int
    size: int

class CommunityUserCheck(BaseModel):
    exists: bool
    id: Optional[int] = None 