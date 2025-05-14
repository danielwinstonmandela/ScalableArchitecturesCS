from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from .models import RegisterRequest, LoginRequest, LoginResponse, UserOut, UserTable
from .auth import hash_password, verify_password, create_access_token, get_current_user
from .database import get_db

router = APIRouter()

@router.post("/register", response_model=UserOut)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserTable).filter((UserTable.email == req.email) | (UserTable.username == req.username)))
    if result.scalar():
        raise HTTPException(status_code=409, detail="Email or username already exists")
    user = UserTable(username=req.username, email=req.email, password_hash=hash_password(req.password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/login", response_model=LoginResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserTable).filter_by(email=req.email))
    user = result.scalars().first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token, expires = create_access_token({"sub": str(user.id)})
    return LoginResponse(token=token, expires_at=expires)

@router.get("/me", response_model=UserOut)
async def me(current_user: UserTable = Depends(get_current_user)):
    return current_user

@router.post("/logout")
async def logout():
    return {"message": "Logged out (client should delete token)"}