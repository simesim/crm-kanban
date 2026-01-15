from fastapi import APIRouter

router = APIRouter()

@router.get("/cards/ping")
def ping():
    return {"ok": True}
