from transformers import pipeline
import soundfile as sf
import librosa
import numpy as np

# Initialize the ASR pipeline
asr_pipeline = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-base",
)

def transcribe_audio(file_path):
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
    print("audio transcibed")
    return transcription

# # Example usage
# file_path = "audio_1735507110280.wav"
# transcription = transcribe_audio(file_path)
# print(transcription)


from pydub import AudioSegment
import os

def convert_to_wav(input_file):
    # Load the audio file
    audio = AudioSegment.from_file(input_file)
    
    # Get the base name of the file without extension
    base_name = os.path.splitext(input_file)[0]
    
    # Create the output file name with .wav extension
    output_file = f"{base_name}.wav"
    
    # Export the audio file as .wav
    audio.export(output_file, format="wav")
    print(f"Converted {input_file} to {output_file}")

# Example usage
# convert_to_wav("input_audio.mp3")