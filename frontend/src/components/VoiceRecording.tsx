import { useState, useRef, useEffect } from 'react';

const VoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [transcription] = useState("hello world, my name is nego and i want to tell yiy that hvns nb.kvjs njvw nmm.SDmnbckS.n .kbvBS ,mngsm")
  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
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
    if (!isRecording && !audioURL) {
      // Start recording
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = event => {
            audioChunksRef.current.push(event.data);
          };
          mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const url = URL.createObjectURL(audioBlob);
            setAudioURL(url);
            audioChunksRef.current = [];
          };
          mediaRecorderRef.current.start();
          setIsRecording(true);
          setIsPaused(false);
          setTimer(0);
        })
        .catch(error => console.error('Error accessing media devices.', error));
    } else if (isRecording && !isPaused) {
      // Pause recording
      mediaRecorderRef.current?.pause();
      setIsPaused(true);
    } else if (isRecording && isPaused) {
      // Resume recording
      mediaRecorderRef.current?.resume();
      setIsPaused(false);
    } else if (audioURL) {
      // Play or pause audio
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
      setIsRecording(false);
      setIsPaused(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
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
      <div className='flex  items-center col-span-2 gap-10'>
      <div className='flex space-x-4 mb-4 bg-blue-950 p-10 pr-12 rounded-2xl flex-col gap-5 relative justify-center'>
          <i className="fa-solid fa-xmark cursor-pointer absolute  text-red-700 rounded-full  top-[-20px] left-[-30px]"></i>
          <div className="text-white text-4xl font-bold text-center">{formatTime(timer)}</div>
          <i className={`fa-solid fa-microphone text-4xl mb-4 bg-white rounded-full p-10 text-center ${isPaused ? 'text-green-400' : isRecording ? 'blinking' : 'text-blue-950'}`}></i>
          <button onClick={handleStartPlayPause} className='rounded-2xl p-2 text-blue-950 cursor-pointer bg-white'>
            {isRecording ? (isPaused ? <i className="fa-solid fa-play text-xl"></i> : <i className="fa-solid fa-pause text-xl"></i>) : <i className="fa-solid fa-play text-xl"></i>}
          </button>
          <button onClick={handleStop} className='bg-red-600 rounded-xl py-2 px-5 text-white' disabled={!isRecording}>
            Stop
          </button>
        </div>
        <div className="transcription-container">
          <h1 className="transcription-title">Transcribing</h1>
          <div className="transcription-text">{transcription}</div>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecording;