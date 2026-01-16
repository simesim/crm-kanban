# class User(Base):
#     # ... остальные настройки ...
#     owned_boards = relationship('Board', back_populates='owner')
#     board_memberships = relationship('BoardMember', back_populates='user')