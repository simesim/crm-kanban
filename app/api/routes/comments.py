from fastapi import APIRouter

router = APIRouter()

@router.get("/comments/ping")
def ping():
    return {"ok": True}
