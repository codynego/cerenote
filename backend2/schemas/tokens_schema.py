from pydantic import BaseModel
from typing import Optional
from pydantic import Field


class TokenData(BaseModel):
    username : Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type : str