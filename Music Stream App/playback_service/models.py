from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

class Playback(Base):
    __tablename__ = "playbacks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False)
    track_id = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
