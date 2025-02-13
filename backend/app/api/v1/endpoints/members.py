from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app import crud
from app.models import Member, Configuration
from app.schemas import member as schemas
from app.api import deps
from app.core.config import settings

router = APIRouter()

@router.get("/", response_model=schemas.MemberResponse)
async def list_members(
    db: Session = Depends(deps.get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    type_filter: Optional[str] = Query(None, description="Filter by member type (consumer, producer, prosumer)"),
    user_type: Optional[str] = Query(None, description="Filter by user type (real, simulated)"),
    status: Optional[str] = Query(None, description="Filter by status (active, inactive, pending)"),
    search: Optional[str] = Query(None, description="Search in name, POD ID, or smart meter ID"),
):
    """
    Retrieve members with optional filtering.
    """
    query = db.query(Member)

    # Apply filters
    if type_filter:
        query = query.filter(Member.type == type_filter)
    if user_type:
        query = query.filter(Member.user_type == user_type)
    if status:
        if status == 'active':
            query = query.filter(Member.is_active == True)
        elif status == 'inactive':
            query = query.filter(Member.is_active == False)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Member.name.ilike(search_term)) |
            (Member.pod_id.ilike(search_term)) |
            (Member.smart_meter_id.ilike(search_term))
        )

    # Get total count for pagination
    total = query.count()

    # Apply pagination
    query = query.offset(skip).limit(limit)

    # Execute query
    members = query.all()

    return {
        "items": members,
        "total": total,
        "page": skip // limit,
        "size": limit
    }

@router.post("/", response_model=schemas.MemberInDB)
def create_member(
    *,
    db: Session = Depends(deps.get_db),
    member_in: schemas.MemberCreate,
) -> Any:
    """
    Create new member.
    """
    member = crud.member.create(db=db, obj_in=member_in)
    return member

@router.get("/{member_id}", response_model=schemas.MemberDetail)
def get_member(
    member_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get member by ID.
    """
    member = crud.member.get(db=db, id=member_id)
    if not member:
        raise HTTPException(
            status_code=404,
            detail="Member not found",
        )
    return member

@router.put("/{member_id}", response_model=schemas.MemberInDB)
def update_member(
    *,
    db: Session = Depends(deps.get_db),
    member_id: int,
    member_in: schemas.MemberUpdate,
) -> Any:
    """
    Update member.
    """
    member = crud.member.get(db=db, id=member_id)
    if not member:
        raise HTTPException(
            status_code=404,
            detail="Member not found",
        )
    member = crud.member.update(db=db, db_obj=member, obj_in=member_in)
    return member 