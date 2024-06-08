import logging
import datetime
from typing import Optional, List, Dict

import betterlogging as bl
from fastapi import FastAPI, HTTPException
from starlette.responses import JSONResponse

import aioredis


from config.config import load_config
from infrastructure.database.models.users import User
from infrastructure.database.models.beta import BetaGame
from infrastructure.database.models.balls import Balls
from infrastructure.database.repo.requests import RequestsRepo
from infrastructure.database.repo.users import UserRepo
from infrastructure.database.repo.beta import BetaRepo
from infrastructure.database.repo.balls import BallsRepo
from infrastructure.database.setup import create_engine, create_session_pool

from pydantic import BaseModel

app = FastAPI()
config = load_config(".env")
engine = create_engine(config.db)
session_pool = create_session_pool(engine)
log_level = logging.INFO
bl.basic_colorized_config(level=log_level)
log = logging.getLogger(__name__)


class UserBase(BaseModel):
    username: Optional[str]
    full_name: str
    language: Optional[str] = 'ru'
    balance: Optional[float]
    referred_by: Optional[int]
    tasks_done: Optional[List[int]] = []
    achievements_done: Optional[List[int]] = []
    referrals: Optional[List[int]] = []
    block_date: Optional[datetime.date]
    referrals_percent: Optional[Dict[str, str]] = {}
    wallet: Optional[str]


class BetaGameBase(BaseModel):
    user_id: int
    durov_skin: Optional[bool] = False
    transactions: Optional[int] = 0
    games_count: Optional[int] = 0
    pipes_count: Optional[int] = 0
    record: Optional[int] = 0


class BallsBase(BaseModel):
    user_id: int
    daily_login: Optional[bool] = False
    daily_login_hundred: Optional[bool] = False
    daily_limit: Optional[int] = 1500


@app.get("/api/users/get_user/{id}")
async def get_user(id: int):
    async with engine.begin() as conn:
        await conn.run_sync(User.metadata.create_all, checkfirst=True)
    async with session_pool() as session:
        try:
            repo = RequestsRepo(session)
        finally:
            await session.close()
        user = await repo.users.select_user(id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user_data = UserBase(
            username=user.username,
            full_name=user.full_name,
            language=user.language,
            balance=user.balance,
            referred_by=user.referred_by,
            tasks_done=user.tasks_done,
            achievements_done=user.achievements_done,
            referrals=user.referrals,
            block_date=user.block_date,
            referrals_percent=user.referrals_percent,
            wallet=user.wallet
        )
        return JSONResponse(status_code=200, content=user_data.dict())


@app.post("/api/users/get_or_create_user")
async def get_or_create_user(user_id: int, full_name: str, user_data: UserBase):
    async with engine.begin() as conn:
        await conn.run_sync(User.metadata.create_all, checkfirst=True)
    async with session_pool() as session:
        repo = UserRepo(session)
        user = await repo.get_or_create_user(
            user_id=user_id,
            full_name=full_name,
            language=user_data.language,
            balance=user_data.balance,
            referred_by=user_data.referred_by,
            username=user_data.username,
            tasks_done=user_data.tasks_done,
            achievements_done=user_data.achievements_done,
            referrals=user_data.referrals,
            block_date=user_data.block_date,
            referrals_percent=user_data.referrals_percent,
            wallet=user_data.wallet
        )
        return JSONResponse(status_code=200, content={"user_id": user.user_id})


@app.get("/api/users/count_users")
async def count_users():
    async with engine.begin() as conn:
        await conn.run_sync(User.metadata.create_all, checkfirst=True)
    async with session_pool() as session:
        repo = UserRepo(session)
        count = await repo.count_users()
        return JSONResponse(status_code=200, content={"count": count})


@app.patch("/api/users/update_balance/{user_id}")
async def update_balance(user_id: int, amount: float):
    async with engine.begin() as conn:
        await conn.run_sync(User.metadata.create_all, checkfirst=True)
    async with session_pool() as session:
        repo = UserRepo(session)
        new_balance = await repo.update_balance(user_id, amount)
        return JSONResponse(status_code=200, content={"new_balance": new_balance})


@app.patch("/api/users/update_referrals/{user_id}")
async def update_referrals(user_id: int, referral: int):
    async with engine.begin() as conn:
        await conn.run_sync(User.metadata.create_all, checkfirst=True)
    async with session_pool() as session:
        repo = UserRepo(session)
        try:
            new_referrals = await repo.update_referrals(user_id, referral)
            return JSONResponse(status_code=200, content={"referrals": new_referrals})
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))


@app.patch("/api/users/update_achievements_done/{user_id}")
async def update_achievements_done(user_id: int, achievement: int):
    async with engine.begin() as conn:
        await conn.run_sync(User.metadata.create_all, checkfirst=True)
    async with session_pool() as session:
        repo = UserRepo(session)
        try:
            new_achievements_done = await repo.update_achievements_done(user_id, achievement)
            return JSONResponse(status_code=200, content={"achievements_done": new_achievements_done})
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))


@app.post("/api/betagame/get_or_create_user_beta")
async def get_or_create_user_beta(beta_data: BetaGameBase):
    async with engine.begin() as conn:
        await conn.run_sync(BetaGame.metadata.create_all, checkfirst=True)
    async with session_pool() as session:
        repo = BetaRepo(session)
        beta_game = await repo.get_or_create_user_beta(
            user_id=beta_data.user_id,
            durov_skin=beta_data.durov_skin,
            transactions=beta_data.transactions,
            games_count=beta_data.games_count,
            pipes_count=beta_data.pipes_count,
            record=beta_data.record
        )
        return JSONResponse(status_code=200, content={"user_id": beta_game.user_id})


@app.get("/api/betagame/select_user/{user_id}")
async def select_user_beta(user_id: int):
    async with engine.begin() as conn:
        await conn.run_sync(BetaGame.metadata.create_all, checkfirst=True)
    async with session_pool() as session:
        repo = BetaRepo(session)
        beta_game = await repo.select_user(user_id)
        if not beta_game:
            raise HTTPException(status_code=404, detail="BetaGame not found for user_id")
        beta_data = BetaGameBase(
            user_id=beta_game.user_id,
            durov_skin=beta_game.durov_skin,
            transactions=beta_game.transactions,
            games_count=beta_game.games_count,
            pipes_count=beta_game.pipes_count,
            record=beta_game.record
        )
        return JSONResponse(status_code=200, content=beta_data.dict())


@app.patch("/api/betagame/update_record/{user_id}")
async def update_record(user_id: int, record: int):
    async with engine.begin() as conn:
        await conn.run_sync(BetaGame.metadata.create_all, checkfirst=True)
    async with session_pool() as session:
        repo = BetaRepo(session)
        try:
            new_record = await repo.update_record(user_id, record)
            return JSONResponse(status_code=200, content={"record": new_record})
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))


@app.patch("/api/betagame/increment_games_count/{user_id}")
async def increment_games_count(user_id: int):
    async with engine.begin() as conn:
        await conn.run_sync(BetaGame.metadata.create_all, checkfirst=True)
    async with session_pool() as session:
        repo = BetaRepo(session)
        try:
            new_games_count = await repo.increment_games_count(user_id)
            return JSONResponse(status_code=200, content={"games_count": new_games_count})
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))


@app.patch("/api/betagame/increment_transactions/{user_id}")
async def increment_transactions(user_id: int, amount: int):
    async with engine.begin() as conn:
        await conn.run_sync(BetaGame.metadata.create_all, checkfirst=True)
    async with session_pool() as session:
        repo = BetaRepo(session)
        try:
            new_transactions = await repo.increment_transactions(user_id, amount)
            return JSONResponse(status_code=200, content={"transactions": new_transactions})
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))


@app.post("/api/balls/get_or_create_balls")
async def get_or_create_balls(balls_data: BallsBase):
    async with engine.begin() as conn:
        await conn.run_sync(Balls.metadata.create_all, checkfirst=True)
    async with session_pool() as session:
        repo = BallsRepo(session)
        balls = await repo.get_or_create_balls(
            user_id=balls_data.user_id,
            daily_login=balls_data.daily_login,
            daily_login_hundred=balls_data.daily_login_hundred,
            daily_limit=balls_data.daily_limit
        )
        return JSONResponse(status_code=200, content={"user_id": balls.user_id})


@app.get("/api/balls/get_balls/{user_id}")
async def get_balls(user_id: int):
    async with engine.begin() as conn:
        await conn.run_sync(Balls.metadata.create_all, checkfirst=True)
    async with session_pool() as session:
        repo = BallsRepo(session)
        balls = await repo.get_balls_by_user_id(user_id)
        if not balls:
            raise HTTPException(status_code=404, detail="Balls not found for user_id")
        balls_data = BallsBase(
            user_id=balls.user_id,
            daily_login=balls.daily_login,
            daily_login_hundred=balls.daily_login_hundred,
            daily_limit=balls.daily_limit
        )
        return JSONResponse(status_code=200, content=balls_data.dict())


@app.patch("/api/balls/update_daily_login/{user_id}")
async def update_daily_login(user_id: int, daily_login: bool):
    async with engine.begin() as conn:
        await conn.run_sync(Balls.metadata.create_all, checkfirst=True)
    async with session_pool() as session:
        repo = BallsRepo(session)
        try:
            new_daily_login = await repo.update_daily_login(user_id, daily_login)
            return JSONResponse(status_code=200, content={"daily_login": new_daily_login})
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))


@app.patch("/api/balls/update_daily_login_hundred/{user_id}")
async def update_daily_login_hundred(user_id: int, daily_login_hundred: bool):
    async with engine.begin() as conn:
        await conn.run_sync(Balls.metadata.create_all, checkfirst=True)
    async with session_pool() as session:
        repo = BallsRepo(session)
        try:
            new_daily_login_hundred = await repo.update_daily_login_hundred(user_id, daily_login_hundred)
            return JSONResponse(status_code=200, content={"daily_login_hundred": new_daily_login_hundred})
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))


@app.patch("/api/balls/update_daily_limit/{user_id}")
async def update_daily_limit(user_id: int, decrement: int):
    async with engine.begin() as conn:
        await conn.run_sync(Balls.metadata.create_all, checkfirst=True)
    async with session_pool() as session:
        repo = BallsRepo(session)
        try:
            previous_limit = await repo.update_daily_limit(user_id, decrement)
            return JSONResponse(status_code=200, content={"previous_limit": previous_limit})
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))


@app.delete("/api/balls/delete_balls/{user_id}")
async def delete_balls(user_id: int):
    async with engine.begin() as conn:
        await conn.run_sync(Balls.metadata.create_all, checkfirst=True)
    async with session_pool() as session:
        repo = BallsRepo(session)
        try:
            await repo.delete_balls(user_id)
            return JSONResponse(status_code=200, content={"message": "Balls record deleted"})
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
