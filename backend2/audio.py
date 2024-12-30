from transformers import pipeline
import soundfile as sf
import librosa
import numpy as np
from pydub import AudioSegment
import os

# Initialize the ASR pipeline
asr_pipeline = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-base",
)

def transcribe_audio(file_path):
    # Ensure the file format is supported
    supported_formats = ['.wav', '.mp3', '.flac', '.ogg', '.m4a', '.aac']
    file_ext = os.path.splitext(file_path)[-1].lower()
    
    if file_ext not in supported_formats:
        raise ValueError(f"Unsupported audio format: {file_ext}. Supported formats are: {supported_formats}")
    
    # Convert unsupported formats to WAV using pydub
    if file_ext == '.wav':
        audio = AudioSegment.from_file(file_path)
        file_path = file_path.replace(file_ext, ".wav")
        audio.export(file_path, format="wav")
    
    # Load the audio file
    audio_input, sample_rate = sf.read(file_path)

    # Convert to mono if necessary
    if len(audio_input.shape) > 1:
        audio_input = librosa.to_mono(audio_input.T)

    # Resample the audio to 16 kHz if necessary (required by some models)
    if sample_rate != 16000:
        audio_input = librosa.resample(audio_input, orig_sr=sample_rate, target_sr=16000)
        sample_rate = 16000

    # Convert the audio to float32 for compatibility
    audio_input = np.array(audio_input, dtype=np.float32)

    # Transcribe the audio
    transcription = asr_pipeline(
        audio_input,
        generate_kwargs={"max_new_tokens": 256},
        return_timestamps=True,
    )
    
    print("Audio transcribed successfully.")
    return transcription
