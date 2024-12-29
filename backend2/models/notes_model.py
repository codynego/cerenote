from database import Base
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import Enum as SQLEnum
from datetime import datetime
from schemas.user_schema import UserRole



class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey('users.id'))
    owner = relationship("User", back_populates="categories")
    name = Column(String, unique=True, index=True)
    notes = relationship("Note", back_populates="category")

class Audio(Base):
    __tablename__ = "audios"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey('users.id'))
    owner = relationship("User", back_populates="audios")
    audio_path = Column(String, index=True)
    notes = relationship("Note", back_populates="audio")

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey('users.id'))
    owner = relationship("User", back_populates="notes")
    title = Column(String, index=True)
    content = Column(String)
    audio_id = Column(Integer, ForeignKey('audios.id'))
    audio = relationship("Audio", back_populates="notes")
    category_id = Column(Integer, ForeignKey('categories.id'))
    category = relationship("Category", back_populates="notes")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column(Boolean, default=False)
