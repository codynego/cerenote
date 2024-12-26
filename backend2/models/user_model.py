from database import Base, engine
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from passlib.context import CryptContext
from schemas.user_schema import UserRole
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    categories = relationship("Category", back_populates="owner")
    role = Column(SQLEnum(UserRole))
    
class Token(Base):
    __tablename__ = "tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, index=True)
    user_id = Column(Integer)


User.metadata.create_all(bind=engine)