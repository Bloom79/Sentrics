from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app import crud
from app.models import User, Member
from app.schemas import user as schemas
from app.api import deps
from app.core.config import settings

router = APIRouter()

@router.get("/", response_model=schemas.UserResponse)
async def list_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    type_filter: Optional[str] = Query(None, description="Filter by user type (consumer, producer, prosumer)"),
    user_type: Optional[str] = Query(None, description="Filter by user category (real, simulated)"),
    status: Optional[str] = Query(None, description="Filter by status (active, inactive, pending)"),
    search: Optional[str] = Query(None, description="Search in name, email, or POD ID"),
):
    """
    Retrieve users with optional filtering.
    """
    query = db.query(
        User,
        func.count(Member.id).label('configurations_count')
    ).outerjoin(
        Member,
        User.id == Member.user_id
    ).group_by(User.id)

    # Apply filters
    if type_filter:
        query = query.filter(User.type == type_filter)
    if user_type:
        query = query.filter(User.user_type == user_type)
    if status:
        if status == 'active':
            query = query.filter(User.is_active == True)
        elif status == 'inactive':
            query = query.filter(User.is_active == False)
        elif status == 'pending':
            query = query.filter(User.is_verified == False)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (User.full_name.ilike(search_term)) |
            (User.email.ilike(search_term)) |
            (User.fiscal_code.ilike(search_term))
        )

    # Get total count for pagination
    total = query.count()

    # Apply pagination
    query = query.offset(skip).limit(limit)

    # Execute query
    results = query.all()

    # Convert results to response model
    users = []
    for user, configurations_count in results:
        user_dict = {
            "id": user.id,
            "name": user.full_name,
            "email": user.email,
            "fiscal_code": user.fiscal_code,
            "type": user.type,
            "user_type": user.user_type,
            "status": "active" if user.is_active else "inactive",
            "address": user.address,
            "activation_date": user.created_at,
            "has_asset_management": user.role in ["vendor", "admin"],
            "configurations_count": configurations_count,
            "created_at": user.created_at,
        }
        users.append(schemas.UserList(**user_dict))

    return {
        "items": users,
        "total": total,
        "page": skip // limit,
        "size": limit
    }

@router.post("/", response_model=schemas.UserInDB)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
) -> Any:
    """
    Create new user.
    """
    user = crud.user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists.",
        )
    user = crud.user.create(db=db, obj_in=user_in)
    return user

@router.get("/{user_id}", response_model=schemas.UserDetail)
def get_user(
    user_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get user by ID.
    """
    user = crud.user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    return user

@router.put("/{user_id}", response_model=schemas.UserInDB)
def update_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    user_in: schemas.UserUpdate,
) -> Any:
    """
    Update user.
    """
    user = crud.user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    user = crud.user.update(db=db, db_obj=user, obj_in=user_in)
    return user

@router.get("/{user_id}/community-user", response_model=schemas.CommunityUserCheck)
def check_community_user(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Check if an application user has an associated community user.
    """
    # Only allow users to check their own community user status
    if current_user.id != user_id and current_user.role != "superuser":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    user = crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "exists": user.community_user_id is not None,
        "id": user.community_user_id
    } 