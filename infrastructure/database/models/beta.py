from sqlalchemy import BIGINT, ForeignKey, Boolean
from sqlalchemy.orm import mapped_column, Mapped

from infrastructure.database.models.base import Base, TimestampMixin, TableNameMixin


class BetaGame(Base, TimestampMixin, TableNameMixin):
    __tablename__ = "beta_game"
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('users.user_id'), primary_key=True, autoincrement=False, unique=True)
    durov_skin: Mapped[bool] = mapped_column(Boolean, default=False)
    transactions: Mapped[int] = mapped_column(BIGINT, default=0)
    games_count: Mapped[int] = mapped_column(BIGINT, default=0)
    pipes_count: Mapped[int] = mapped_column(BIGINT, default=0)
    record: Mapped[int] = mapped_column(BIGINT, default=0)
