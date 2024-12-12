from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from utils import auth, security
from database import get_db
from models import user_model
from schemas import user_schema, tokens_schema


router = APIRouter()

@router.post("/register", response_model=user_schema.UserInDBBase)
async def register_user(user: user_schema.UserIn, db: Session = Depends(get_db)):
    db_user = db.query(user_model.User).filter(user_model.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    db_user = db.query(user_model.User).filter(user_model.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = user_model.User(username=user.username, email=user.email, hashed_password=security.get_password_hash(user.password), role=user_schema.UserRole.user)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/token", response_model=tokens_schema.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.get_user(db, form_data.username)
    if not user or not security.pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me", response_model=user_schema.UserInDBBase)
async def read_users_me(current_user: user_schema.UserInDBBase = Depends(auth.get_current_user)):
    return current_user