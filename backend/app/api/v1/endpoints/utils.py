from typing import Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app import models
from app.api import deps

router = APIRouter()

class Msg(BaseModel):
    msg: str

@router.get("/test", response_model=Msg)
def test_token(current_user: models.User = Depends(deps.get_current_user)) -> Any:
    """
    Test access token.
    """
    return {"msg": "Test access successful"} 