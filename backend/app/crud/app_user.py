from typing import Any, Dict, Optional, Union, List
from datetime import datetime

from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.app_user import AppUser
from app.schemas.app_user import AppUserCreate, AppUserUpdate

class CRUDAppUser(CRUDBase[AppUser, AppUserCreate, AppUserUpdate]):
    def get_by_email(self, db: Session, *, email: str, tenant_id: Optional[int] = None) -> Optional[AppUser]:
        query = db.query(AppUser).filter(AppUser.email == email)
        if tenant_id is not None:
            query = query.filter(AppUser.tenant_id == tenant_id)
        return query.first()
    
    def get_by_username(self, db: Session, *, username: str, tenant_id: Optional[int] = None) -> Optional[AppUser]:
        query = db.query(AppUser).filter(AppUser.username == username)
        if tenant_id is not None:
            query = query.filter(AppUser.tenant_id == tenant_id)
        return query.first()

    def get_multi_by_tenant(
        self, db: Session, *, tenant_id: int, skip: int = 0, limit: int = 100
    ) -> List[AppUser]:
        return (
            db.query(AppUser)
            .filter(AppUser.tenant_id == tenant_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_multi_by_organization(
        self, db: Session, *, organization_id: int, skip: int = 0, limit: int = 100
    ) -> List[AppUser]:
        return (
            db.query(AppUser)
            .filter(AppUser.organization_id == organization_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create(self, db: Session, *, obj_in: AppUserCreate) -> AppUser:
        # Check if email or username already exists in the same tenant
        if obj_in.tenant_id:
            existing_user = (
                db.query(AppUser)
                .filter(
                    AppUser.tenant_id == obj_in.tenant_id,
                    or_(
                        AppUser.email == obj_in.email,
                        AppUser.username == obj_in.username
                    )
                )
                .first()
            )
            if existing_user:
                raise ValueError("Email or username already exists in this tenant")
        
        db_obj = AppUser(
            email=obj_in.email,
            username=obj_in.username,
            hashed_password=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
            is_superuser=obj_in.is_superuser,
            is_active=obj_in.is_active or True,
            tenant_id=obj_in.tenant_id,
            organization_id=obj_in.organization_id,
            organization_name=obj_in.organization_name,
            role=obj_in.role or "user",
            permissions=obj_in.permissions or {"permissions": []}
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: AppUser, obj_in: Union[AppUserUpdate, Dict[str, Any]]
    ) -> AppUser:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        
        # Handle password update
        if "password" in update_data:
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        
        # Check email/username uniqueness within tenant if being updated
        if (update_data.get("email") or update_data.get("username")) and db_obj.tenant_id:
            existing_user = (
                db.query(AppUser)
                .filter(
                    AppUser.tenant_id == db_obj.tenant_id,
                    AppUser.id != db_obj.id,
                    or_(
                        AppUser.email == update_data.get("email", db_obj.email),
                        AppUser.username == update_data.get("username", db_obj.username)
                    )
                )
                .first()
            )
            if existing_user:
                raise ValueError("Email or username already exists in this tenant")
        
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def authenticate(self, db: Session, *, email: str, password: str, tenant_id: Optional[int] = None) -> Optional[AppUser]:
        user = self.get_by_email(db, email=email, tenant_id=tenant_id)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def update_last_login(self, db: Session, *, user: AppUser) -> AppUser:
        user.last_login = datetime.utcnow()
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def is_active(self, user: AppUser) -> bool:
        return user.is_active

    def is_superuser(self, user: AppUser) -> bool:
        return user.is_superuser

    def has_permission(self, user: AppUser, permission: str) -> bool:
        if user.is_superuser:
            return True
        return permission in (user.permissions.get('permissions', []) if user.permissions else [])

app_user = CRUDAppUser(AppUser) 