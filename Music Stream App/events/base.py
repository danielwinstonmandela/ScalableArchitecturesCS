from pydantic import BaseModel
from datetime import datetime

class Event(BaseModel):
    type: str
    timestamp: datetime