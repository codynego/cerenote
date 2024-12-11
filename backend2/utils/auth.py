from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from . import security
from database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")