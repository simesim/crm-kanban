from fastapi import APIRouter

router = APIRouter()

@router.get("/columns/ping")
def ping():
    return {"ok": True}
