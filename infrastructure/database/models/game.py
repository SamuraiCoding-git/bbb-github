from sqlalchemy import BIGINT, ForeignKey, Boolean, Integer
from sqlalchemy.orm import mapped_column, Mapped

from infrastructure.database.models.base import Base, TimestampMixin, TableNameMixin


class Game(Base, TimestampMixin, TableNameMixin):
    __tablename__ = "users"
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('users.user_id'), primary_key=True, autoincrement=False, unique=True)
    durov_skin: Mapped[bool] = mapped_column(Boolean, default=False)
    transactions: Mapped[int] = mapped_column(BIGINT, default=0)

