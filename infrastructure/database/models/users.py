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

    # Текущий баланс Balls
    balance: Mapped[float] = mapped_column(Float, nullable=True)

    # Чьим рефералом является
    referred_by: Mapped[int] = mapped_column(BIGINT, nullable=True)

    # Список выполненных заданий
    tasks_done: Mapped[List[int]] = mapped_column(ARRAY(BIGINT), nullable=True)

    # Список выполненных ачивок
    achievements_done: Mapped[List[int]] = mapped_column(ARRAY(BIGINT), nullable=True)

    # Рефералы пользователя
    referrals: Mapped[List[int]] = mapped_column(ARRAY(BIGINT), nullable=True)

    # Дата создания записи
    timestamp: TimestampMixin = TimestampMixin()

    # Дата блокировки бота или выхода из канала
    leave_date: Mapped[datetime.time] = mapped_column(Date, nullable=True)

    # Дата любого последнего взаимодействия с ботом 
    last_activity: Mapped[datetime.time] = mapped_column(Date, nullable=True)

    # 
    block_date: Mapped[datetime.time] = mapped_column(Date, nullable=True)

    # Сколько человек получает награды за реферала, а так же уровень реферала
    referrals_percent: Mapped[dict[str, str]] = mapped_column(JSON, nullable=True)

    # Адрес кошелька
    wallet: Mapped[str] = mapped_column(String, nullable=True)
