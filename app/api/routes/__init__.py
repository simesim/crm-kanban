from fastapi import APIRouter
from app.api.routes import auth, boards, columns, cards, comments

router = APIRouter()
router.include_router(auth.router, tags=["auth"])
router.include_router(boards.router, prefix="/boards", tags=["boards"])
router.include_router(columns.router, tags=["columns"])
router.include_router(cards.router, tags=["cards"])
router.include_router(comments.router, tags=["comments"])
