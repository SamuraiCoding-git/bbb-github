from sqlalchemy import select, update, delete
from sqlalchemy.dialects.postgresql import insert
from infrastructure.database.models.balls import Balls
from infrastructure.database.repo.base import BaseRepo


class BallsRepo(BaseRepo):

    # Получение или создание информации в таблицы balls
    async def get_or_create_balls(
            self,
            user_id: int,
            daily_login: bool = False,
            daily_login_hundred: bool = False,
            daily_limit: int = 1500
    ):
        update_values = {
            'daily_login': daily_login,
            'daily_login_hundred': daily_login_hundred,
            'daily_limit': daily_limit
        }
        insert_stmt = (
            insert(Balls)
            .values(
                user_id=user_id,
                daily_login=daily_login,
                daily_login_hundred=daily_login_hundred,
                daily_limit=daily_limit
            )
            .on_conflict_do_update(
                index_elements=[Balls.user_id],
                set_=update_values
            )
            .returning(Balls)
        )

        result = await self.session.execute(insert_stmt)
        await self.session.commit()

        return result.scalar_one()


    # Получение данных из таблицы balls
    async def get_balls_by_user_id(self, user_id: int):
        query = select(Balls).where(Balls.user_id == user_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    # Обновление ежедневного входа
    async def update_daily_login(self, user_id: int, daily_login: bool):
        balls = await self.get_balls_by_user_id(user_id)
        if balls:
            update_stmt = (
                update(Balls)
                .where(Balls.user_id == user_id)
                .values(daily_login=daily_login)
            )
            await self.session.execute(update_stmt)
            await self.session.commit()
            await self.session.close()
            return daily_login
        else:
            raise ValueError("User not found")

    # Обновление получения 100 очков в игре за сегодня
    async def update_daily_login_hundred(self, user_id: int, daily_login_hundred: bool):
        balls = await self.get_balls_by_user_id(user_id)
        if balls:
            update_stmt = (
                update(Balls)
                .where(Balls.user_id == user_id)
                .values(daily_login_hundred=daily_login_hundred)
            )
            await self.session.execute(update_stmt)
            await self.session.commit()
            await self.session.close()
            return daily_login_hundred
        else:
            raise ValueError("User not found")

    # Обновление ежедневного лимита очков
    async def update_daily_limit(self, user_id: int, daily_limit: int):
        balls = await self.get_balls_by_user_id(user_id)
        if balls:
            update_stmt = (
                update(Balls)
                .where(Balls.user_id == user_id)
                .values(daily_limit=daily_limit)
            )
            await self.session.execute(update_stmt)
            await self.session.commit()
            await self.session.close()
            return daily_limit
        else:
            raise ValueError("User not found")

    # Удаляет запись по user_id
    async def delete_balls(self, user_id: int):
        delete_stmt = delete(Balls).where(Balls.user_id == user_id)
        await self.session.execute(delete_stmt)
        await self.session.commit()
        await self.session.close()
