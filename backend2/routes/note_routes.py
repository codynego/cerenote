from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from utils import auth, security
from database import get_db
from typing import List
from models.notes_model import Category, Audio, Note
from schemas import notes_schema, user_schema
import shutil
from fastapi import UploadFile, File
from fastapi.responses import StreamingResponse
import shutil
import os
from audio import transcribe_audio
from pydub import AudioSegment
from utils.auth import verify_token, get_user


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

@router.get("/notes", response_model=dict())
async def user_notes_get(db : Session = Depends(get_db), current_user: user_schema.UserInDBBase = Depends(auth.get_current_user)):
    return {
        "status_code": 200,
        "data": current_user.notes,
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



def convert_to_wav(input_file, output_folder="audio"):
    """
    Converts an audio file to .wav format.

    Args:
        input_file (str): Path to the input audio file.
        output_folder (str): Directory where the converted .wav file will be saved.

    Returns:
        str: Path to the converted .wav file.
    """
    input_file = os.path.abspath(input_file)
    print(f"Absolute path: {os.path.abspath(input_file)}")

    if not os.path.exists(input_file):
        raise FileNotFoundError(f"Input file '{input_file}' does not exist.")

    # Ensure output folder exists
    os.makedirs(output_folder, exist_ok=True)

    # Extract the filename without extension
    filename = os.path.splitext(os.path.basename(input_file))[0]

    # Define the output .wav file path
    output_file = os.path.join(output_folder, f"{filename}.wav")

    # Load the input file and export it as .wav
    try:
        audio = AudioSegment.from_file(input_file)
        audio.export(output_file, format="wav")
        print(f"Conversion successful: {output_file}")
        return output_file
    except Exception as e:
        raise RuntimeError(f"Failed to convert {input_file} to .wav: {e}")

@router.post("/note/audio_upload")
async def note_audio_upload(
    audio_file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: user_schema.UserInDBBase = Depends(auth.get_current_user),
):
    if not current_user:
        raise HTTPException(status_code=401, detail="User not authorized")
    
    audio_dir = "audio/"
    os.makedirs(audio_dir, exist_ok=True)
    audio_path = os.path.join(audio_dir, audio_file.filename)
    print(audio_file.filename)
    
    try:
        with open(audio_path, "wb") as file_object:
            shutil.copyfileobj(audio_file.file, file_object)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")
    finally:
        audio_file.file.close()

    # # Convert the audio file to .wav format
    # wav_audio_path = convert_to_wav(audio_path)

    # Add audio record to the database
    audio = Audio(audio_path=audio_path, owner_id=current_user.id)
    db.add(audio)
    db.commit()
    db.refresh(audio)
    
    return {
        "status_code": 200,
        "data": audio.id,
        "detail": "Audio uploaded and converted to .wav successfully",
    }

@router.get("/note/transcribe")
async def note_audio_transcribe(
    audio_id: int,
    db: Session = Depends(get_db),
    current_user: user_schema.UserInDBBase = Depends(auth.get_current_user),
):
    if not current_user:
        raise HTTPException(status_code=401, detail="User not authorized")
    
    # Fetch the audio record
    audio = db.query(Audio).filter(Audio.id == audio_id).first()
    if not audio:
        raise HTTPException(status_code=404, detail="Audio not found")
    
    # path  = audio.audio_path.split("\\")[-1]
    # print(audio.audio_path)
    
    # Transcribe the audio file
    transcribed_text = transcribe_audio(audio.audio_path)
    title = f"New Note {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    note = Note(title=title, content=transcribed_text['text'], owner_id=current_user.id, audio_id=audio_id, category_id=1)
    db.add(note)
    db.commit()
    db.refresh(note)
    return {
        "status_code": 200,
        "data": note,
        "detail": "Audio transcribed successfully",
    }



@router.get("/audios")
async def get_audios(db: Session = Depends(get_db), current_user: user_schema.UserInDBBase = Depends(auth.get_current_user)):
    audios = db.query(Audio).filter(Audio.owner_id == current_user.id).all()
    return {
        "status_code": 200,
        "data": audios,
        "detail": "Audio files fetched successfully",
    }


    
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException
import json
# from fastapi.responses import HTMLResponse
# from pathlib import Path
# from utils import auth
# from schemas import user_schema
# import logging



@router.websocket("/ws/editor/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str, db: Session = Depends(get_db)):
    try:
        # Verify the token
        payload = verify_token(token)
        await websocket.accept()
        await websocket.send_json({'data': f'Welcome, {payload["sub"]}!'})
        current_user = get_user(db, username=payload['sub'])

        while True:
            # Receive and parse the message
            data = await websocket.receive_text()
            
            try:
                parsed_data = json.loads(data)
                note_id = parsed_data.get('id')
                title = parsed_data.get('title')
                content = parsed_data.get('content')

                # Validate the required fields
                if not content or not isinstance(content, str):
                    await websocket.send_json({"data": "Invalid content field. Must be a non-empty string."})
                    continue

            except (ValueError, TypeError):
                await websocket.send_json({"data": "Invalid data format. Expecting JSON with valid fields."})
                continue

            if note_id is None:
                # Create a new note
                
                db_note = Note(
                    title=title or "Untitled Document", 
                    content=content, 
                    owner_id=current_user.id, 
                    audio_id=None, 
                    category_id=1
                )
                db.add(db_note)

            else:
                # Find the note to update by ID
                db_note = db.query(Note).filter(Note.id == note_id).first()
                if db_note is None:
                    await websocket.send_json({"data": f"Note with ID {note_id} not found."})
                    continue

                # Check if the user is authorized
                if db_note.owner_id != current_user.id:  # Assuming 'sub' is the user ID
                    await websocket.send_json({"data": "You are not authorized to update this note."})
                    continue

                # Update the note's content
                db_note.title = title or db_note.title
                db_note.content = content
                db_note.updated_at = datetime.utcnow()

            # Save and send confirmation
            db.commit()
            db.refresh(db_note)
            r_note = {
                "id": db_note.id,
                "title": db_note.title,
                "content": db_note.content,
            }
            await websocket.send_json({"remark": f"Note '{db_note.title}' updated successfully.", "note": r_note})

    except HTTPException as e:
        await websocket.close(code=1008)
        print(f"Unauthorized: {e.detail}")

    except WebSocketDisconnect:
        print("WebSocket connection closed.")

    finally:
        db.close()
