from database import Base, engine
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from passlib.context import CryptContext
from schemas.user_schema import UserRole
from sqlalchemy.orm import relationship
from sqlalchemy import Enum as SQLEnum



class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey('users.id'))
    owner = relationship("User", back_populates="categories")
    name = Column(String, unique=True, index=True)