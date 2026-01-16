from dataclasses import dataclass
from typing import Literal


Role = Literal["MANAGER", "LEAD"]


@dataclass
class CurrentUser:
    id: int
    role: Role


def get_current_user() -> CurrentUser:
    # Заглушка: пока нет настоящей авторизации
    return CurrentUser(id=1, role="LEAD")
