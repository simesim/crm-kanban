from datetime import datetime
from pydantic import BaseModel, Field


class BoardCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)


class BoardOut(BaseModel):
    id: int
    title: str
    owner_id: int
    created_at: datetime
