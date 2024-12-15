from pydantic import BaseModel
from typing import Optional, List
from enum import Enum
from .notes_schema import CategoryBase


class UserRole(str, Enum):
    admin = "admin"
    user = "user"

class UserBase(BaseModel):
    username: str
    email: str
    


class UserIn(UserBase):
    password: str

class UserInDBBase(UserBase):
    id: int

    class Config:
        orm_mode = True

class UserInDB(UserInDBBase):
    role: UserRole = UserRole.user
    hashed_password: str
    categories : List[CategoryBase] = []
    