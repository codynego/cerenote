from pydantic import BaseModel
from typing import Optional, List
from enum import Enum


class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class CategoryInDB(CategoryBase):
    id: int
    owner_id : int

    class Config:
        orm_mode = True

