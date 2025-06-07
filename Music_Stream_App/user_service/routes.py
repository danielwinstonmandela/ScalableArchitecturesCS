from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from user_service.models import User  
from user_service.schemas import RegisterRequest, LoginRequest, LoginResponse, UserOut  
from user_service.auth import hash_password, verify_password, create_access_token, get_current_user
from user_service.database import get_db

router = APIRouter()

@router.post("/register", response_model=UserOut)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == req.email))
    if result.scalar():
        raise HTTPException(status_code=409, detail="Email already exists")
    user = User(email=req.email, password_hash=hash_password(req.password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/login", response_model=LoginResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter_by(email=req.email))
    user = result.scalars().first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token, expires = create_access_token({"sub": str(user.id)})
    return LoginResponse(access_token=token, token_type="bearer")

@router.get("/me", response_model=UserOut)
async def me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
async def logout():
    return {"message": "Logged out (client should delete token)"}