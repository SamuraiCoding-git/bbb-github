from sqlalchemy import BIGINT, ForeignKey, Boolean, Integer
from sqlalchemy.orm import mapped_column, Mapped

from infrastructure.database.models.base import Base, TimestampMixin, TableNameMixin


class Balls(Base, TimestampMixin, TableNameMixin):
    __tablename__ = "balls"
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('users.user_id'), primary_key=True, autoincrement=False, unique=True)
    daily_login: Mapped[bool] = mapped_column(Boolean, default=False)
    daily_login_hundred: Mapped[bool] = mapped_column(Boolean, default=False)
    daily_limit: Mapped[int] = mapped_column(Integer, default=1500)

