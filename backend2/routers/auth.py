from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from utils.auth  import get_user, create_user, create_access_token, create_refresh_token
from schemas.user_schema import GetUser, PostUser, LoginUser
from datetime import date, datetime, timedelta, time
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm


route = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2bearer = OAuth2PasswordBearer(tokenUrl = 'auth/login')

#Register new user using email, username, password
@route.post("/register", response_model=GetUser)
def register_user(payload: PostUser, db: Session = Depends(get_db)):
    
    if not payload.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please add Email",
        )
    user = get_user(db, payload.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"User with email {payload.email} already exists",
        )
    user = create_user(db, payload)
    print(user)

    return user


@route.post("/login")
def login_user(payload: LoginUser, db: Session = Depends(get_db)):
    """
    Login user based on email and password
    """
    if not payload.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please add Phone number",
        )
    
    user = get_user(db, payload.email)
    token =  create_access_token(user.id, timedelta(minutes=30)) 
    refresh = create_refresh_token(user.id,timedelta(minutes = 1008))

    return {'access_token': token, 'token_type': 'bearer','refresh_token':refresh,"user_id":user.id}
