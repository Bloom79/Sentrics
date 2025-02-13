from typing import Any, List, Optional

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from pydantic import EmailStr

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings
from app.schemas import app_user as schemas_app_user

router = APIRouter()

@router.get("/", response_model=List[schemas_app_user.AppUser])
def read_app_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    tenant_id: Optional[int] = Query(None),
    organization_id: Optional[int] = Query(None),
    current_user: models.AppUser = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve app users.
    """
    # Superusers can see all users or filter by tenant/organization
    if crud.app_user.is_superuser(current_user):
        if tenant_id:
            users = crud.app_user.get_multi_by_tenant(db, tenant_id=tenant_id, skip=skip, limit=limit)
        elif organization_id:
            users = crud.app_user.get_multi_by_organization(db, organization_id=organization_id, skip=skip, limit=limit)
        else:
            users = crud.app_user.get_multi(db, skip=skip, limit=limit)
    # Regular users can only see users in their tenant
    else:
        if tenant_id and tenant_id != current_user.tenant_id:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        if organization_id and organization_id != current_user.organization_id:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        users = crud.app_user.get_multi_by_tenant(db, tenant_id=current_user.tenant_id, skip=skip, limit=limit)
    return users

@router.post("/", response_model=schemas_app_user.AppUser)
def create_app_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas_app_user.AppUserCreate,
    current_user: models.AppUser = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new app user.
    """
    # Only superusers can create users in different tenants
    if not crud.app_user.is_superuser(current_user):
        if user_in.tenant_id and user_in.tenant_id != current_user.tenant_id:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        # Force user to be created in the same tenant
        user_in.tenant_id = current_user.tenant_id
        user_in.organization_id = current_user.organization_id
        user_in.organization_name = current_user.organization_name
    
    try:
        user = crud.app_user.create(db, obj_in=user_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return user

@router.put("/me", response_model=schemas_app_user.AppUser)
def update_app_user_me(
    *,
    db: Session = Depends(deps.get_db),
    password: str = Body(None),
    full_name: str = Body(None),
    email: EmailStr = Body(None),
    current_user: models.AppUser = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update own app user.
    """
    current_user_data = jsonable_encoder(current_user)
    user_in = schemas_app_user.AppUserUpdate(**current_user_data)
    if password is not None:
        user_in.password = password
    if full_name is not None:
        user_in.full_name = full_name
    if email is not None:
        user_in.email = email
    try:
        user = crud.app_user.update(db, db_obj=current_user, obj_in=user_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return user

@router.get("/me", response_model=schemas_app_user.AppUser)
def read_app_user_me(
    current_user: models.AppUser = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current app user.
    """
    return current_user

@router.get("/{user_id}", response_model=schemas_app_user.AppUser)
def read_app_user_by_id(
    user_id: int,
    current_user: models.AppUser = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get an app user by id.
    """
    user = crud.app_user.get(db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Users can only see users in their own tenant unless they're superusers
    if not crud.app_user.is_superuser(current_user):
        if user.tenant_id != current_user.tenant_id:
            raise HTTPException(status_code=403, detail="Not enough permissions")
    return user

@router.put("/{user_id}", response_model=schemas_app_user.AppUser)
def update_app_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    user_in: schemas_app_user.AppUserUpdate,
    current_user: models.AppUser = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update an app user.
    """
    user = crud.app_user.get(db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Only superusers can update users in different tenants
    if not crud.app_user.is_superuser(current_user):
        if user.tenant_id != current_user.tenant_id:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        # Prevent changing tenant or organization
        if hasattr(user_in, 'tenant_id'):
            delattr(user_in, 'tenant_id')
        if hasattr(user_in, 'organization_id'):
            delattr(user_in, 'organization_id')
        if hasattr(user_in, 'organization_name'):
            delattr(user_in, 'organization_name')
    
    try:
        user = crud.app_user.update(db, db_obj=user, obj_in=user_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return user 