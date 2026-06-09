from fastapi import APIRouter
from api.v1.events import router as events_router
from api.v1.attendants import router as attendants_router

router = APIRouter(prefix="/api/v1", tags=["v1"])
router.include_router(events_router, prefix="/events", tags=["events"])
router.include_router(attendants_router, prefix="/events", tags=["attendants"])