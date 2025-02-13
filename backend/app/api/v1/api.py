from fastapi import APIRouter

from app.api.v1.endpoints import (
    login,
    users,
    utils,
    members,
    participation_requests,
    app_users,
)

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(members.router, prefix="/members", tags=["members"])
api_router.include_router(
    participation_requests.router,
    prefix="/participation-requests",
    tags=["participation-requests"]
)
api_router.include_router(
    app_users.router,
    prefix="/app-users",
    tags=["app-users"]
) 