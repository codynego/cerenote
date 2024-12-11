from pydantic import BaseModel
from typing import Optional, List
from enum import Enum


class UserRole(str, Enum):
    admin = "admin"
    user = "user"

class UserBase(BaseModel):
    username: str
    email: str
    role: UserRole = UserRole.user


class UserIn(UserBase):
    password: str

class UserInDBBase(UserBase):
    id: int

    class Config:
        orm_mode = True

class UserInDB(UserInDBBase):
    hashed_password: str
    