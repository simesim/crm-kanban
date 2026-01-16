from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import CurrentUser, get_current_user
from app.schemas.board import BoardCreate, BoardOut

router = APIRouter()

_BOARDS: list[BoardOut] = []
_NEXT_ID = 1


@router.get("", response_model=list[BoardOut])
def list_boards(current_user: CurrentUser = Depends(get_current_user)):
    return [b for b in _BOARDS if b.owner_id == current_user.id]


@router.post("", response_model=BoardOut, status_code=201)
def create_board(payload: BoardCreate, current_user: CurrentUser = Depends(get_current_user)):
    global _NEXT_ID

    board = BoardOut(
        id=_NEXT_ID,
        title=payload.title,
        owner_id=current_user.id,
        created_at=datetime.utcnow(),
    )
    _NEXT_ID += 1
    _BOARDS.append(board)
    return board


@router.get("/{board_id}", response_model=BoardOut)
def get_board(board_id: int, current_user: CurrentUser = Depends(get_current_user)):
    for b in _BOARDS:
        if b.id == board_id:
            if b.owner_id != current_user.id:
                raise HTTPException(status_code=404, detail="Board not found")
            return b
    raise HTTPException(status_code=404, detail="Board not found")
