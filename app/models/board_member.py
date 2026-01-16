from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime

class BoardMember(Base):
    __tablename__ = 'board_members'

    id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey('boards.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    role = Column(String(50), default='member')  # 'member', 'admin', 'viewer'
    joined_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    board = relationship('Board', back_populates='members')
    user = relationship('User', back_populates='board_memberships')

    # Unique constraint
    __table_args__ = (
        {'sqlite_autoincrement': True}
    )