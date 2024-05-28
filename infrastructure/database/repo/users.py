import datetime
from datetime import date, datetime, timedelta
from typing import Optional, List

from sqlalchemy import select, update, cast, String, and_
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

    async def count_blocked_bot(self):
        query = select(func.count()).select_from(User).where(User.block_date.isnot(None))
        result = await self.session.execute(query)
        return result.scalar()

    async def count_referred_users(self, user_id):
        query = select(func.count(User.user_id)).where(User.referred_by == user_id)
        result = await self.session.execute(query)
        return result.scalar()

    async def count_place(self, balance):
        query = select(func.count()).where(User.balance > balance)
        result = await self.session.execute(query)
        return result.scalar() + 1

    async def select_user(self, user_id):
        query = select(User).where(User.user_id == user_id)
        return await self.session.scalar(query)

    async def calculate_average_referrals(self) -> float:
        query = select(func.avg(func.cardinality(User.referrals)))
        return await self.session.scalar(query)

    async def select_users(self):
        query = select(User).where(and_(User.leave_date.is_(None), User.block_date.is_(None)))
        return await self.session.scalars(query)

    async def select_users_id(self):
        query = select(User.user_id).where(and_(User.leave_date.is_(None), User.block_date.is_(None)))
        return await self.session.scalars(query)

    async def select_leaderboard(self):
        query = select(User.user_id, User.balance).where(User.balance.isnot(None)).order_by(User.balance.desc()).limit(
            10)
        result = await self.session.execute(query)
        return result.mappings().all()

    async def select_language(self, user_id):
        query = select(User.language).where(User.user_id == user_id)
        return await self.session.scalar(query)

    async def select_users_like(self, user_id):
        query = select(User).where(cast(User.user_id, String).like(f'{user_id}%'))
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

    async def update_weeks(self, user):
        if user and user.weeks:
            new_weeks = user.weeks + 1
            update_stmt = (update(User).where(User.user_id == user.user_id).values(weeks=new_weeks))
            await self.session.execute(update_stmt)
            await self.session.commit()
            await self.session.close()
            return new_weeks

    async def update_days(self, user, days: int):
        if user and user.days:
            update_stmt = (update(User).where(User.user_id == user.user_id).values(days==days))
            await self.session.execute(update_stmt)
            await self.session.commit()
            await self.session.close()

    async def update_ref_percent(self, user_id: int, new_ref_percent: dict):
        update_stmt = (update(User).where(User.user_id == user_id).values(referrals_percent=new_ref_percent))
        await self.session.execute(update_stmt)
        await self.session.commit()
        await self.session.close()

    async def update_end_date(self, user_id: int, end_date: datetime.time):
        user = await self.select_user(user_id)
        if user:
            update_stmt = (update(User).where(User.user_id == user_id).values(end_date=end_date))
            await self.session.execute(update_stmt)
            await self.session.commit()
            await self.session.close()
            return end_date
        else:
            raise ValueError("User not found")

    async def update_wallet(self, user_id: int, wallet: str):
        user = await self.select_user(user_id)
        if user:
            update_stmt = (update(User).where(User.user_id == user_id).values(wallet=wallet))
            await self.session.execute(update_stmt)
            await self.session.commit()
            await self.session.close()
            return wallet
        else:
            raise ValueError("User not found")

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

    async def update_tasks_done(self, user_id: int, task: int):
        user = await self.select_user(user_id)
        if user:
            tasks_done = user.tasks_done
            tasks_done.append(task)
            update_stmt = (update(User).where(User.user_id == user_id).values(tasks_done=tasks_done))
            await self.session.execute(update_stmt)
            await self.session.commit()
            await self.session.close()
            return tasks_done
        else:
            raise ValueError("User not found")

    async def calculate_user_growth(self, start_date, end_date):
        # Assuming `created_at` is the datetime attribute under `TimestampMixin`
        initial_count_query = select(func.count()).select_from(User).where(User.created_at <= start_date)
        initial_count = await self.session.scalar(initial_count_query)
        growth_query = select(func.count()).select_from(User).where(
            and_(User.created_at <= start_date, User.created_at > end_date)
        )
        growth_count = await self.session.scalar(growth_query)
        if initial_count > 0:
            growth_percentage = (growth_count / initial_count) * 100
        else:
            growth_percentage = 0

        return {"growth_number": round(growth_count, 1), "growth_percentage": round(growth_percentage, 1)}

    async def calculate_user_churn(self, start_date, end_date):
        churn_query = select(func.count()).select_from(User).where(
            and_(User.leave_date <= start_date, User.leave_date > end_date)
        )
        churn_count = await self.session.scalar(churn_query)

        initial_count_query = select(func.count()).select_from(User).where(User.created_at <= start_date)
        initial_count = await self.session.scalar(initial_count_query)

        if initial_count > 0:
            churn_percentage = (churn_count / initial_count) * 100
        else:
            churn_percentage = 0

        return {"churn_number": round(churn_count, 1), "churn_percentage": round(churn_percentage, 1)}

    async def count_active_users(self, date, time_span):
        if time_span == 'daily':
            start = datetime(date.year, date.month, date.day)
            end = start + timedelta(days=1)
        elif time_span == 'weekly':
            start = date - timedelta(days=date.weekday())  # Monday as the first day of the week
            end = start + timedelta(days=7)
        elif time_span == 'monthly':
            start = datetime(date.year, date.month, 1)
            end = datetime(date.year, date.month + 1, 1) if date.month < 12 else datetime(date.year + 1, 1, 1)
        else:
            raise ValueError("Invalid time span provided. Choose 'daily', 'weekly', or 'monthly'.")

        active_users_query = select(func.count()).select_from(User).where(
            User.last_activity >= start,
            User.last_activity < end
        )
        active_users_count = await self.session.scalar(active_users_query)
        return active_users_count

    async def count_users_by_tasks_done(self):
        tasks_count_query = (
            select(
                User.user_id,
                func.cardinality(User.tasks_done).label('tasks_done_count')
            )
        )

        total_users_query = select(func.count()).select_from(User)
        total_users = await self.session.scalar(total_users_query)

        results = await self.session.execute(tasks_count_query)
        counts = {'1': 0, '2': 0, '3': 0}

        for row in results:
            if str(row[1]) in counts:
                counts[str(row[1])] += 1

        # Calculate percentages
        percentages = {k: round((v / total_users * 100), 2) if total_users > 0 else 0 for k, v in counts.items()}

        return {
            "absolute": counts,
            "percentages": percentages
        }
