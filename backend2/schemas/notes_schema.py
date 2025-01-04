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

class Audio(BaseModel):
    audio_path: str

class NoteBase(BaseModel):
    title: str
    content: str
    audio: Optional[Audio] = None
    category_id: int

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    id: int
    title: str
    content: str

class NoteInDB(NoteBase):
    id: int
    owner_id : int

    class Config:
        orm_mode = True

