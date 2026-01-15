from fastapi import FastAPI
from app.api.routes import router as api_router

app = FastAPI(title="CRM Kanban")

app.include_router(api_router, prefix="/api")


@app.get("/ping")
def ping():
    return {"status": "ok"}
