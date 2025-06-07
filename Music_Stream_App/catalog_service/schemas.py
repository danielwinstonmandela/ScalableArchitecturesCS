from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class SongRequest(BaseModel):
    title: str
    artist: str
    album: Optional[str] = None
    genre: str
    duration: int
    release_year: int

class SongOut(SongRequest):
    id: UUID