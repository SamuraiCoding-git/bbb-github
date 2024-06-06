import datetime
from datetime import date, datetime, timedelta
from typing import Optional, List

from sqlalchemy import select, update, and_
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.sql.functions import func

from infrastructure.database.models import User
from infrastructure.database.repo.base import BaseRepo


class UserRepo(BaseRepo):
    async def get_or_create_user(
            self,
            user_id: int,
            full_name: str,
            language: Optional[str] = None,
            balance: Optional[float] = None,
            referred_by: Optional[int] = None,
            username: Optional[str] = None,
            tasks_done: Optional[List[int]] = None,
            achievements_done: Optional[List[int]] = None,
            referrals: Optional[List[int]] = None,
            end_date: Optional[date] = None,
            last_activity: Optional[date] = None,
            block_date: Optional[date] = None,
            leave_date: Optional[date] = None,
            referrals_percent: dict[str, str] = None,
            wallet: str = None
    ):
        update_values = {
            key: value for key, value in {
                'username': username,
                'full_name': full_name,
                'language': language,
                'balance': balance,
                'referred_by': referred_by,
                'tasks_done': tasks_done,
                'achievements_done': achievements_done,
                'referrals': referrals,
                'end_date': end_date,
                'last_activity': last_activity,
                'block_date': block_date,
                'leave_date': leave_date,
                'referrals_percent': referrals_percent,
                'wallet': wallet
            }.items() if value is not None
        }
        # Build the insert statement
        insert_stmt = (
            insert(User)
            .values(
                user_id=user_id,
                full_name=full_name,
                language=language,
                balance=balance,
                referred_by=referred_by,
                tasks_done=tasks_done,
                achievements_done=achievements_done,
                username=username,
                referrals=referrals,
                last_activity=last_activity,
                leave_date=leave_date,
                referrals_percent=referrals_percent,
            )
            .on_conflict_do_update(
                index_elements=[User.user_id],
                set_=update_values
            )
            .returning(User)
        )

        # Execute the statement and commit the transaction
        result = await self.session.execute(insert_stmt)
        await self.session.commit()

        return result.scalar_one()

    async def count_users(self):
        query = select(func.count(User.user_id))
        result = await self.session.execute(query)
        return result.scalar()

    async def select_user(self, user_id):
            query = select(User).where(User.user_id == user_id)
            return await self.session.scalar(query)

    async def select_users(self):
        query = select(User).where(and_(User.leave_date.is_(None), User.block_date.is_(None)))
        return await self.session.scalars(query)

    async def update_balance(self, user_id: int, amount: float):
        user = await self.select_user(user_id)
        if user:
            if not user.balance:
                balance = 0
            else:
                balance = user.balance
            new_balance = balance + amount
            update_stmt = (update(User).where(User.user_id == user_id).values(balance=new_balance))
            await self.session.execute(update_stmt)
            await self.session.commit()
            await self.session.close()
            return new_balance

    async def update_referrals(self, user_id: int, referral: int):
        user = await self.select_user(user_id)
        if user:
            referrals = user.referrals
            referrals.append(referral)
            update_stmt = (update(User).where(User.user_id == user_id).values(referrals=referrals))
            await self.session.execute(update_stmt)
            await self.session.commit()
            await self.session.close()
            return referrals
        else:
            raise ValueError("User not found")

    async def update_achievements_done(self, user_id: int, achievement: int):
        user = await self.select_user(user_id)
        if user:
            achievements_done = user.achievements_done
            achievements_done.append(achievement)
            update_stmt = (update(User).where(User.user_id == user_id).values(tasks_done=achievements_done))
            await self.session.execute(update_stmt)
            await self.session.commit()
            await self.session.close()
            return achievements_done
        else:
            raise ValueError("User not found")
