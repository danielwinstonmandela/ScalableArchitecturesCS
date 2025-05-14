from .base import Event
from datetime import datetime

class TrackUploaded(Event):
    type: str = "TrackUploaded"
    track_id: str
    user_id: str
    timestamp: datetime