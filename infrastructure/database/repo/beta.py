from infrastructure.database.models.beta import BetaGame
from infrastructure.database.repo.base import BaseRepo
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy import select, update


class BetaRepo(BaseRepo):

    # Получение или создание записи в таблице Beta
    async def get_or_create_user_beta(
            self,
            user_id: int,
            durov_skin: bool,
            transactions: int,
            games_count: int,
            pipes_count: int,
            record: int):
        update_values = {
            key: value for key, value in {
                'user_id': user_id,
                'durov_skin': durov_skin,
                'games_count': games_count,
                'pipes_count': pipes_count,
                'record': record,
                'transactions': transactions,
            }.items() if value is not None
        }
        insert_stmt = (
            insert(BetaGame)
            .values(
                user_id=user_id,
                durov_skin=durov_skin,
                games_count=games_count,
                pipes_count=pipes_count,
                record=record,
                transactions=transactions
            )
            .on_conflict_do_update(
                index_elements=[BetaGame.user_id],
                set_=update_values
            )
            .returning(BetaGame)
        )

        result = await self.session.execute(insert_stmt)
        await self.session.commit()

        return result.scalar_one()

    # Получение пользователя по user_id    
    async def select_user(self, user_id):
        query = select(BetaGame).where(BetaGame.user_id == user_id)
        return await self.session.scalar(query)

    # Обновление рекорда
    async def update_record(self, user_id: int, record: int):
        beta_game = await self.select_user(user_id)
        if beta_game:
            if record > beta_game.record:
                update_stmt = (
                    update(BetaGame)
                    .where(BetaGame.user_id == user_id)
                    .values(record=record)
                )
                await self.session.execute(update_stmt)
                await self.session.commit()
                return record
            else:
                return beta_game.record
        else:
            raise ValueError("User not found")

    async def increment_games_count(self, user_id: int):
        betagame = await self.select_user(user_id)
        if betagame:
            betagame.games_count += 1
            await self.session.commit()
            return betagame.games_count
        else:
            raise ValueError("BetaGame not found for user_id")

    async def increment_transactions(self, user_id: int, amount: int):
        betagame = await self.select_user(user_id)
        if betagame:
            betagame.transactions += amount
            await self.session.commit()
            return betagame.transactions
        else:
            raise ValueError("BetaGame not found for user_id")
