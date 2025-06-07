from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
import enum

Base = declarative_base()

class PlaybackAction(enum.Enum):
    play = "play"
    pause = "pause"
    stop = "stop"

class PlaybackLog(Base):
    __tablename__ = "playback_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)   # No ForeignKey!
    song_id = Column(UUID(as_uuid=True), nullable=False)   # No ForeignKey!
    action = Column(Enum(PlaybackAction), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)