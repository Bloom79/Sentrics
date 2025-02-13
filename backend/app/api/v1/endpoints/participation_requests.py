from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.api import deps
from app.models.participation_request import RequestStatus

router = APIRouter()

@router.post("/", response_model=schemas.ParticipationRequestInDB)
def create_participation_request(
    *,
    db: Session = Depends(deps.get_db),
    request_in: schemas.ParticipationRequestCreate,
    current_user = Depends(deps.get_current_user)
):
    """
    Create new participation request.
    """
    # Check if user already has a pending request for this configuration
    existing_requests = crud.participation_request.get_requests_by_user(db, current_user.id)
    for req in existing_requests:
        if req.configuration_id == request_in.configuration_id and req.status == RequestStatus.PENDING:
            raise HTTPException(
                status_code=400,
                detail="User already has a pending request for this configuration"
            )
    
    return crud.participation_request.create(db, obj_in=request_in)

@router.get("/", response_model=List[schemas.ParticipationRequestWithDetails])
def get_participation_requests(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_superuser)
):
    """
    Retrieve all participation requests.
    """
    return crud.participation_request.get_requests_with_details(db)

@router.get("/pending", response_model=List[schemas.ParticipationRequestWithDetails])
def get_pending_requests(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_superuser)
):
    """
    Retrieve pending participation requests.
    """
    return crud.participation_request.get_pending_requests(db)

@router.put("/{request_id}", response_model=schemas.ParticipationRequestInDB)
def update_request_status(
    *,
    db: Session = Depends(deps.get_db),
    request_id: int,
    request_update: schemas.ParticipationRequestUpdate,
    current_user = Depends(deps.get_current_active_superuser)
):
    """
    Update participation request status.
    """
    request = crud.participation_request.get(db, id=request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Participation request not found")
    
    return crud.participation_request.update_request_status(
        db,
        request_id=request_id,
        status=request_update.status,
        notes=request_update.notes
    )

@router.get("/user/{user_id}", response_model=List[schemas.ParticipationRequestWithDetails])
def get_user_requests(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """
    Retrieve participation requests for a specific user.
    """
    if current_user.id != user_id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return crud.participation_request.get_requests_by_user(db, user_id) 