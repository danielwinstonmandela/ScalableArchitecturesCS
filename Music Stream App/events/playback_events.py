from events.base import Event
from datetime import datetime

class TrackPlayed(Event):
    type: str = "TrackPlayed"
    track_id: str
    user_id: str
    timestamp: datetime