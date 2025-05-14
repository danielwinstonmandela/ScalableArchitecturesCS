from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ARRAY
from sqlalchemy.dialects.postgresql import UUID as SQLUUID
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()

class TrackTable(Base):
    __tablename__ = 'tracks'
    id = Column(SQLUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    artist = Column(String, nullable=False)
    album = Column(String)
    duration = Column(Integer, nullable=False)
    genre = Column(String, nullable=False)
    tags = Column(ARRAY(String))
    created_at = Column(DateTime, default=datetime.utcnow)

class TrackRequest(BaseModel):
    title: str
    artist: str
    album: Optional[str]
    duration: int
    genre: str
    tags: List[str]

class TrackOut(BaseModel):
    id: UUID
    title: str
    artist: str
    album: Optional[str]
    duration: int
    genre: str
    tags: List[str]
    created_at: datetime