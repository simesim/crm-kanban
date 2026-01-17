from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import CurrentUser, get_current_user
from app.schemas.board import BoardCreate, BoardOut, BoardMemberAdd

router = APIRouter()
_BOARD_MEMBERS: dict[int, list[int]] = {}
_BOARDS: list[BoardOut] = []
_NEXT_ID = 1


@router.get("", response_model=list[BoardOut])
def list_boards(current_user: CurrentUser = Depends(get_current_user)):
    result = []
    for b in _BOARDS:
        if b.owner_id == current_user.id:
            result.append(b)
            continue
        members = _BOARD_MEMBERS.get(b.id, [])
        if current_user.id in members:
            result.append(b)
    return result



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
    board = next((b for b in _BOARDS if b.id == board_id), None)
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    if board.owner_id == current_user.id:
        return board

    members = _BOARD_MEMBERS.get(board.id, [])
    if current_user.id in members:
        return board

    raise HTTPException(status_code=404, detail="Board not found")


@router.post("/{board_id}/members", status_code=204)
def add_member(
    board_id: int,
    payload: BoardMemberAdd,
    current_user: CurrentUser = Depends(get_current_user),
):
    board = next((b for b in _BOARDS if b.id == board_id), None)
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    if board.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    members = _BOARD_MEMBERS.setdefault(board_id, [])
    if payload.user_id not in members:
        members.append(payload.user_id)

