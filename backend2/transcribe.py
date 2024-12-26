# from transformers import pipeline


# def transcribe_audio(audio_path):
#     # Load the ASR pipeline
#     asr_pipeline = pipeline("automatic-speech-recognition", model="facebook/wav2vec2-base-960h")

#     # Load the audio file
#     audio_file = open(audio_path, "rb")
#     audio_bytes = audio_file.read()
#     audio_file.close()

#     # Transcribe the audio
#     result = asr_pipeline(
#         audio_bytes,
#         generate_kwargs={"max_new_tokens": 256},
#         return_timestamps=True,
#     )
#     return result


# transcibe = transcribe_audio(
#     "C:/Users/DELL/Downloads/voice-commands.wav"
# )


# import assemblyai as aai

# transcriber = aai.Transcriber()
# transcript = transcriber.transcribe("./my-local-audio-file.wav")

# print(transcript.text)