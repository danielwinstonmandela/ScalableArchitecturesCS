from .base import Event
from datetime import datetime

class UserRegistered(Event):
    type: str = "UserRegistered"
    user_id: str
    email: str
    timestamp: datetime