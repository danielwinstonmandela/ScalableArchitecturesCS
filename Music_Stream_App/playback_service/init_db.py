import asyncio
from playback_service.database import engine
from playback_service.models import Base

async def init():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Playback table created.")

asyncio.run(init())
