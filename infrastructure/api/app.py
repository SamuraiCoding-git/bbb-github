import ast
import logging
from datetime import datetime

import betterlogging as bl
from fastapi import FastAPI
from starlette.responses import JSONResponse

from .config.config import load_config
from ..database.models.leaderboard import Leaderboard
from ..database.models.todos import ToDo
from ..database.models.users import User
from ..database.repo.requests import RequestsRepo
from ..database.setup import create_engine, create_session_pool

app = FastAPI()
config = load_config(".env")
engine = create_engine(config.db)
session_pool = create_session_pool(engine)
log_level = logging.INFO
bl.basic_colorized_config(level=log_level)
log = logging.getLogger(__name__)


@app.get("/api/get_user/{id}")
async def get_user(id: int):
  async with engine.begin() as conn:
    await conn.run_sync(User.metadata.create_all, checkfirst=True)
  async with session_pool() as session:
    try:
      repo = RequestsRepo(session)
    finally:
      await session.close()
    user = await repo.users.select_user(id)
    content = {
      "id": user.id,
      "name": user.name,
      "friends": user.friends,
      "invitation": user.invitation,
      "achievements": user.achievements,
      "currentLeague": user.currentLeague,
      "taskCompleted": user.taskCompleted,
      "userImageProfile": user.userImageProfile,
      "burningDays": user.burningDays,
      "tokenBalance": user.tokenBalance
    }
    return JSONResponse(status_code=200, content=content)


@app.post(
  "/api/add_user/{id}/{name}/{friends}/{invitation}/{achievements}/{currentLeague}/{taskCompleted}/{burningDays}/{tokenBalance}")
async def add_user(id: int, name: str, friends: int, invitation: int, achievements: int, currentLeague: str,
                   taskCompleted: int, burningDays: int, tokenBalance: int):
  async with engine.begin() as conn:
    await conn.run_sync(User.metadata.create_all, checkfirst=True)
  async with session_pool() as session:
    try:
      repo = RequestsRepo(session)
    finally:
      await session.close()
    await repo.users.get_or_create_user(id, name, friends, invitation, achievements, currentLeague, taskCompleted,
                                        f"profile_photo_{id}", burningDays, tokenBalance)
    await repo.leaderboard.get_or_create_leaderboard(id)
    content = {
      "id": id,
      "name": name,
      "friends": friends,
      "invitation": invitation,
      "achievements": achievements,
      "currentLeague": currentLeague,
      "taskCompleted": taskCompleted,
      "userImageProfile": f"profile_photo_{id}",
      "burningDays": burningDays,
      "tokenBalance": tokenBalance
    }
    return JSONResponse(status_code=200, content=content)


@app.get("/api/get_todos/{user_id}")
async def get_todos(user_id: int):
  async with engine.begin() as conn:
    await conn.run_sync(ToDo.metadata.create_all, checkfirst=True)
  async with session_pool() as session:
    try:
      repo = RequestsRepo(session)
    finally:
      await session.close()
    content = []
    todos = await repo.todos.select_todos(user_id)
    for todo in todos:
      content.append({
        "id": todo.id,
        "time": todo.time,
        "duration": todo.duration,
        "status": todo.status,
        "title": todo.title,
        "description": todo.description,
        "badges": todo.badges
      })
    return JSONResponse(status_code=200, content=content)


@app.get("/api/get_todos_calendar/{time}")
async def get_todos_calendar(time):
  async with engine.begin() as conn:
    await conn.run_sync(ToDo.metadata.create_all, checkfirst=True)
  async with session_pool() as session:
    try:
      repo = RequestsRepo(session)
    finally:
      await session.close()
    content = []
    todos = await repo.todos.select_todos_calendar(time)
    for todo in todos:
      content.append({
        "id": todo.id,
        "time": todo.time,
        "duration": todo.duration,
        "status": todo.status,
        "title": todo.title,
        "description": todo.description,
        "badges": todo.badges
      })
    return JSONResponse(status_code=200, content=content)


@app.post("/api/update_balance/{user_id}/{balance}")
async def update_balance(user_id: int, balance: int):
  async with engine.begin() as conn:
    await conn.run_sync(User.metadata.create_all, checkfirst=True)
    await conn.run_sync(Leaderboard.metadata.create_all, checkfirst=True)
  async with session_pool() as session:
    try:
      repo = RequestsRepo(session)
    finally:
      await session.close()
    user = await repo.users.update_balance(user_id, balance)
    leaderboard = await repo.users.update_balance(user_id, balance)
    content = {
      "tokenBalance": user[0],
      "weekly": leaderboard[0],
      "monthly": leaderboard[1],
      "all_time": leaderboard[2]
    }
    return JSONResponse(status_code=200, content=content)


@app.post("/api/add_task/{user_id}/{time}/{duration}/{status}/{title}/{description}/{badges}")
async def add_task(user_id: int, time: str, duration: str, status: bool, title: str, description: str, badges: str):
  async with engine.begin() as conn:
    await conn.run_sync(ToDo.metadata.create_all, checkfirst=True)
  async with session_pool() as session:
    try:
      repo = RequestsRepo(session)
    finally:
      await session.close()
    todo = await repo.todos.get_or_create_todo(user_id=user_id,
                                               time=time,
                                               duration=ast.literal_eval(duration),
                                               status=status,
                                               title=title,
                                               description=description,
                                               badges=ast.literal_eval(badges))
    content = {
      "id": todo.id,
      "time": todo.time,
      "duration": todo.duration,
      "status": todo.status,
      "title": todo.title,
      "description": todo.description,
      "badges": todo.badges
    }
  return JSONResponse(status_code=200, content=content)


@app.get("/api/get_leaderboard/{period}/{number_of_users}")
async def get_leaderboard(period: str, limit_of_users: int):
  async with engine.begin() as conn:
    await conn.run_sync(Leaderboard.metadata.create_all, checkfirst=True)
  async with session_pool() as session:
    try:
      repo = RequestsRepo(session)
    finally:
      await session.close()
  content = []
  if period == "weekly":
    leaderboard = await repo.leaderboard.select_users(period, limit_of_users)
    print(leaderboard)
    for leader in leaderboard:
      content.append({
        "id": leader.id,
        "weekly": leader.weekly
      })
  elif period == "monthly":
    leaderboard = await repo.leaderboard.select_users(period, limit_of_users)
    for leader in leaderboard:
      content.append({
        "id": leader.id,
        "monthly": leader.monthly
      })
  elif period == "all_time":
    leaderboard = await repo.leaderboard.select_users(period, limit_of_users)
    for leader in leaderboard:
      content.append({
        "id": leader.id,
        "all_time": leader.all_time
      })
  return JSONResponse(status_code=200, content=content)


@app.post("/api/update_badges/{user_id}/{id}/{badges}")
async def update_badges(user_id: int, id: int, badges: str):
  badges = ast.literal_eval(badges)
  async with engine.begin() as conn:
    await conn.run_sync(Leaderboard.metadata.create_all, checkfirst=True)
  async with session_pool() as session:
    try:
      repo = RequestsRepo(session)
    finally:
      await session.close()
  badges = await repo.todos.update_badges(user_id, id, badges)
  content = {
    "badges": badges
  }
  return JSONResponse(status_code=200, content=content)


@app.get("/api/get_ref_link/{id}")
async def get_ref_link(id: int):
  content = {
    f"https://t.me/example_bot_name?start={id}"
  }
  return JSONResponse(status_code=200, content=content)


@app.post("/api/complete_todo/{user_id}/{id}")
async def complete_task(user_id: int, id: int):
  async with engine.begin() as conn:
    await conn.run_sync(Leaderboard.metadata.create_all, checkfirst=True)
  async with session_pool() as session:
    try:
      repo = RequestsRepo(session)
    finally:
      await session.close()
  status = await repo.todos.update_status(user_id, id)
  content = {
    "status": status
  }
  return JSONResponse(status_code=200, content=content)
