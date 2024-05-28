import datetime
from typing import Optional, List

from sqlalchemy import String, Float, BIGINT, text, ARRAY, Date, JSON, Integer
from sqlalchemy.orm import mapped_column, Mapped

from infrastructure.database.models.base import Base, TimestampMixin, TableNameMixin


class User(Base, TimestampMixin, TableNameMixin):
    __tablename__ = "users"
    user_id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=False, unique=True)
    username: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    full_name: Mapped[str] = mapped_column(String(128))
    language: Mapped[str] = mapped_column(String(10), server_default=text("'ru'"), nullable=True)
    balance: Mapped[float] = mapped_column(Float, nullable=True)
    referred_by: Mapped[int] = mapped_column(BIGINT, nullable=True)
    tasks_done: Mapped[List[int]] = mapped_column(ARRAY(BIGINT), nullable=True)
    achievements_done: Mapped[List[int]] = mapped_column(ARRAY(BIGINT), nullable=True)
    referrals: Mapped[List[int]] = mapped_column(ARRAY(BIGINT), nullable=True)
    timestamp: TimestampMixin = TimestampMixin()
    leave_date: Mapped[datetime.time] = mapped_column(Date, nullable=True)
    last_activity: Mapped[datetime.time] = mapped_column(Date, nullable=True)
    block_date: Mapped[datetime.time] = mapped_column(Date, nullable=True)
    referrals_percent: Mapped[dict[str, str]] = mapped_column(JSON, nullable=True)
    wallet: Mapped[str] = mapped_column(String, nullable=True)
