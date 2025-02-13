from datetime import timedelta
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import crud, schemas
from app.api import deps
from app.core import security
from app.core.config import settings

router = APIRouter()

@router.post("/login/access-token", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
    tenant_id: Optional[int] = Query(None)
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    # Try to authenticate with email
    user = crud.app_user.authenticate(
        db, email=form_data.username, password=form_data.password, tenant_id=tenant_id
    )
    if not user:
        # If email auth fails, try username
        user = crud.app_user.get_by_username(db, username=form_data.username, tenant_id=tenant_id)
        if user and crud.app_user.authenticate(db, email=user.email, password=form_data.password, tenant_id=tenant_id):
            pass
        else:
            raise HTTPException(status_code=400, detail="Incorrect email/username or password")
    
    if not crud.app_user.is_active(user):
        raise HTTPException(status_code=400, detail="Inactive user")
    
    # Update last login timestamp
    crud.app_user.update_last_login(db, user=user)
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    } 