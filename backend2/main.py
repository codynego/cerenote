from fastapi import FastAPI
import uvicorn
from routes import auth_routes, note_routes
from database import Base, engine
from models import user_model
from settings import app

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routes
app.include_router(auth_routes.router)
app.include_router(note_routes.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)