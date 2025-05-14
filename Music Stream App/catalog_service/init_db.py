import asyncio
from catalog_service.database import engine
from catalog_service.models import Base

async def init():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tracks table created.")

asyncio.run(init())