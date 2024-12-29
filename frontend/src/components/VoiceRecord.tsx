import { Transcribing } from '@/pages/Transcribing';
import { useState, useRef, useEffect } from 'react';

const VoiceRecord = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioStream, setAudioStream] = useState<Blob | null>(null);
  const [output, setOutput] = useState(null);
  const accessToken = localStorage.getItem('token')

  const isAudioAvailable = audioStream;

  function handleAudioReset() {
    setAudioStream(null);
  }

  async function handleFormSubmission() {
    if (!audioStream) {
      console.log("No audio stream available");
      return;
    }
  }

  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (isPaused || !isRecording) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const handleStartPlayPause = () => {
    if (!isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          // Initialize WebSocket connection
          const ws = new WebSocket('ws://localhost:8000/ws/audio-stream/');
          ws.onopen = () => {
            console.log('WebSocket connection established.');
            ws.send(JSON.stringify({ type: 'authenticate', accessToken })); // Send token for authentication
          };
          ws.onclose = () => console.log('WebSocket connection closed.');
          ws.onerror = (error) => console.error('WebSocket error:', error);

          wsRef.current = ws;

          // Initialize MediaRecorder
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(event.data); // Stream audio chunk to the backend
            }
          };
          mediaRecorderRef.current.start(100); // Send chunks every 100ms

          setIsRecording(true);
          setIsPaused(false);
          setTimer(0);
        })
        .catch((error) => console.error('Error accessing media devices:', error));
    } else if (isRecording && !isPaused) {
      mediaRecorderRef.current?.pause();
      setIsPaused(true);
    } else if (isRecording && isPaused) {
      mediaRecorderRef.current?.resume();
      setIsPaused(false);
    } else if (audioURL) {
      const audio = new Audio(audioURL);
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  };

  const handleStop = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      setAudioStream(audioBlob);
      audioChunksRef.current = [];
      setIsRecording(false);
      setIsPaused(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Close WebSocket connection
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-gray-200 grid bg-opacity-40 grid-cols-3 top-0 left-0 absolute w-full h-full">
      <div></div>
      <div className="flex items-center col-span-2 gap-10">
        <div className="flex space-x-4 mb-4 bg-blue-950 p-10 pr-12 rounded-2xl flex-col gap-5 relative justify-center">
          <i className="fa-solid fa-xmark cursor-pointer absolute text-red-700 rounded-full top-[-20px] left-[-30px]"></i>
          <div className="text-white text-4xl font-bold text-center">{formatTime(timer)}</div>
          <i
            className={`fa-solid fa-microphone text-4xl mb-4 bg-white rounded-full p-10 text-center ${
              isPaused ? 'text-green-400' : isRecording ? 'blinking' : 'text-blue-950'
            }`}
          ></i>
          <button
            onClick={handleStartPlayPause}
            className="rounded-2xl p-2 text-blue-950 cursor-pointer bg-white"
          >
            {isRecording ? (
              isPaused ? (
                <i className="fa-solid fa-play text-xl"></i>
              ) : (
                <i className="fa-solid fa-pause text-xl"></i>
              )
            ) : (
              <i className="fa-solid fa-play text-xl"></i>
            )}
          </button>
          <button
            onClick={handleStop}
            className="bg-red-600 rounded-xl py-2 px-5 text-white"
            disabled={!isRecording}
          >
            Stop
          </button>
        </div>
        {isAudioAvailable ? (
           <Transcribing output={output} handleFormSubmission={handleFormSubmission} handleAudioReset={handleAudioReset} audioStream={audioStream} />
        ) : (
          <p>none</p>
        )}
      </div>
    </div>
  );
};

export default VoiceRecord;
