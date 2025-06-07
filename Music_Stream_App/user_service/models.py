from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID as SQLUUID
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()

class UserTable(Base):
    __tablename__ = 'users'
    id = Column(SQLUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    token: str
    expires_at: datetime

class UserOut(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    created_at: datetime