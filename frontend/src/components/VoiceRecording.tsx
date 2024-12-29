import { AudioElement } from '@/pages/AudioElement';
import { useState, useRef, useEffect } from 'react';
import { SoundWave } from './SoundWave';

const VoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // const [transcription, setTranscription] = useState<string | null>(null);
  const [audioStream, setAudioStream] = useState<Blob | null>(null);
  const [output, setOutput] = useState(null);
  // const [downloading, setDownloading] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [finished, setFinished] = useState(false);


  const isAudioAvailable = audioStream;

  function handleAudioReset() {
    setAudioStream(null);
  }

  interface HandleOnStopSubmissionProps {
    audioBlob: Blob;
  }

  interface ResponseData {
    status: string;
    data: any;
  }

  async function handleOnStopSubmission(audioBlob: HandleOnStopSubmissionProps['audioBlob']) {
    if (!audioStream && !audioBlob) {
      console.log("No audio stream available");
      return;
    }
    const formData = new FormData();
    
    if (audioBlob) {
      formData.append('audio_file', audioBlob);
    }
    const response = await fetch('http://localhost:8000/note/audio_upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    const data: ResponseData = await response.json();
    if (data) {
      setOutput(data.data);
      console.log(data);
    }
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

  const handleStartPlayPause = async () => {
    if (!isRecording && !audioURL) {
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
            setAudioStream(audioBlob);
            handleOnStopSubmission(audioBlob)
            audioChunksRef.current = [];
          };
          mediaRecorderRef.current.start();
          setIsRecording(true);
          setIsPaused(false);
          setTimer(0);
        })
        .catch(error => console.error('Error accessing media devices.', error));
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
    <div className="bg-gray-200 flex bg-opacity-40  top-0 left-0 absolute w-full h-full">
      <div className='flex items-center justify-center w-full h-full'>
        <div className='flex  mb-4 bg-blue-950 w-[500px] h-[300px] p-12 pr-12 rounded-2xl flex-col gap-5 relative justify-center'>
          <i className="fa-solid fa-xmark cursor-pointer absolute text-red-700 rounded-full top-[-20px] left-[-30px]"></i>
          
          
          <div className='flex  flex-col'>
            {!isAudioAvailable? 
              <div className=''>
                <div className="text-white text-3xl font-bold text-center">{formatTime(timer)}</div>
                <SoundWave isPaused={isPaused} />
                {
                  isRecording ? <p className='text-white text-base mt-10 text-center'>Listening...</p> : null
                }
              </div> : null}
            {isAudioAvailable ? (
              <AudioElement audioStream={audioStream} />
          //  <Transcribing output={output} handleFormSubmission={handleFormSubmission} handleAudioReset={handleAudioReset} audioStream={audioStream} />
            ) : null}
          </div>
          {
            !isAudioAvailable ? 
            <div className="flex justify-between">
            <button onClick={handleStartPlayPause} className='rounded-full w-16 h-16 text-white bg-green-600 cursor-pointer'>
              {isRecording ? (isPaused ? <i className="fa-solid fa-play text-xl"></i> : <i className="fa-solid fa-pause text-xl"></i>) : <i className="fa-solid fa-play text-xl"></i>}
            </button>
            <button onClick={handleStop} className='bg-red-600 rounded-full w-16 h-16 py-2 px-4 text-white' disabled={!isRecording}>
              Stop
            </button>
          </div> : null
          }
        </div>
        {/* {isAudioAvailable ? (
           <Transcribing output={output} handleFormSubmission={handleFormSubmission} handleAudioReset={handleAudioReset} audioStream={audioStream} />
        ) : (
          <p>none</p>
        )} */}
      </div>
    </div>
  );
};

export default VoiceRecording;
