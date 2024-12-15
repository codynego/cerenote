from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from utils import auth, security
from database import get_db
from typing import List
from models.notes_model import Category
from schemas import notes_schema, user_schema


router = APIRouter()


@router.post("/category/create")
async def category_create(category_name : notes_schema.CategoryCreate, db : Session = Depends(get_db), current_user: user_schema.UserInDBBase = Depends(auth.get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="user not authorized")
    category = Category(**category_name.dict(), owner_id = current_user.id)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.get("/categories", response_model=dict())
async def user_category_get(db : Session = Depends(get_db), current_user: user_schema.UserInDBBase = Depends(auth.get_current_user)):
    return {
        "status_code": 200,
        "data": current_user.categories,
        "detail": "successful"
    }

@router.delete("/category/{category_id}")
async def user_category_delete(category_id: int, db : Session = Depends(get_db), current_user: user_schema.UserInDBBase = Depends(auth.get_current_user)):
    #print(db.query(notes_model.Category).filter(owner_id=1))
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        print(category, type(category_id))
        raise HTTPException(status_code=404, detail="category not found")
    db.delete(category)
    db.commit()
    return {
        "status_code": 200,
        "data": category,
        "detail": "delete successful"
    }