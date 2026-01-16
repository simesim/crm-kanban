from sqlalchemy.orm import Session
from app.models.board import Board
from app.models.board_member import BoardMember
from app.schemas.board import BoardCreate
from typing import List, Optional

class BoardService:
    @staticmethod
    def list_boards_for_user(db: Session, user_id: int) -> List[Board]:
        """Получить все доски, где пользователь является владельцем или участником"""
        return db.query(Board).filter(
            (Board.owner_id == user_id) |
            (Board.members.any(BoardMember.user_id == user_id))
        ).distinct().all()

    @staticmethod
    def create_board(db: Session, user_id: int, board_data: BoardCreate) -> Board:
        """Создать новую доску"""
        board = Board(
            title=board_data.title,
            description=board_data.description,  # ← сохраняем, даже если не в ответе
            owner_id=user_id
        )
        db.add(board)
        db.commit()
        db.refresh(board)
        return board

    @staticmethod
    def get_board_if_allowed(db: Session, user_id: int, board_id: int) -> Optional[Board]:
        """Получить доску только если пользователь владелец или участник"""
        return db.query(Board).filter(
            Board.id == board_id,
            (Board.owner_id == user_id) |
            (Board.members.any(BoardMember.user_id == user_id))
        ).first()