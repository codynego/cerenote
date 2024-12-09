
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import datetime, date


class GetUser(BaseModel):
    email: EmailStr
    username: Optional[str]
    role: int

    class Config:
        orm_mode = True
        use_enum_values = True


class LoginUser(BaseModel):
    email: EmailStr
    password: str

    class Config:
        orm_mode = True
        use_enum_values = True


class PostUser(BaseModel):
    email: EmailStr
    username: Optional[str]
    password: str

    class Config:
        orm_mode = True
        use_enum_values = True