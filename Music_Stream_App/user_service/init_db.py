# user_service/init_db.py
import asyncio
from user_service.database import engine
from user_service.models import Base

async def init():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created.")

asyncio.run(init())