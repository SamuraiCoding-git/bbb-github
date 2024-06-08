from sqlalchemy import BIGINT, ForeignKey, Boolean
from sqlalchemy.orm import mapped_column, Mapped

from infrastructure.database.models.base import Base, TimestampMixin, TableNameMixin


class BetaGame(Base, TimestampMixin, TableNameMixin):
    __tablename__ = "beta_game"
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('users.user_id'), primary_key=True, autoincrement=False, unique=True)

    # Имеется ли скин дурова
    durov_skin: Mapped[bool] = mapped_column(Boolean, default=False)

    # количество пропущенных транзакций через ton
    transactions: Mapped[int] = mapped_column(BIGINT, default=0)

    # Сколько игр сыграл пользователь за все время бета-версии
    games_count: Mapped[int] = mapped_column(BIGINT, default=0)

    # Сколько человек прошел столбов за все время бета-версии
    pipes_count: Mapped[int] = mapped_column(BIGINT, default=0)

    # Рекордное количество пройденных столбов
    record: Mapped[int] = mapped_column(BIGINT, default=0)
