from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from utils import auth, security
from database import get_db
from models import user_model
from schemas import user_schema


router = APIRouter()

@router.post("/register", response_model=user_schema.UserInDBBase)
async def register_user(user: user_schema.UserIn, db: Session = Depends(get_db)):
    db_user = db.query(user_model.User).filter(user_model.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    db_user = db.query(user_model.User).filter(user_model.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = user_model.User(username=user.username, email=user.email, hashed_password=security.get_password_hash(user.password), role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user