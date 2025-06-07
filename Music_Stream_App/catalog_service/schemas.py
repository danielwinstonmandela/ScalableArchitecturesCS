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
    # do NOT add audio_blob here, since files are sent as multipart/form-data

class SongOut(SongRequest):
    id: UUID
    # do not expose audio_blob in output