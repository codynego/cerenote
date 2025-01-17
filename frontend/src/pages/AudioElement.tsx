import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AudioElementProps {
  audioStream: Blob | null; // Handle the case of null audio stream
  output: any;
}

interface Note {
  Content: string;
  // Add other properties if needed
}

export const AudioElement: React.FC<AudioElementProps> = ({ audioStream, output }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // Track the audio progress
  const [note, setNote] = useState<Note | null>({Content: 'hello there'}); // Default value
  const [transcribing, setTranscribing] = useState(false);
  const navigate = useNavigate();

  console.log(output);

  // Handle stream change or playback logic
  useEffect(() => {
    if (!audioStream || !audioRef.current) return;

    // Create object URL for the audio stream
    const audioUrl = URL.createObjectURL(audioStream);
    audioRef.current.src = audioUrl;

    // Cleanup the object URL when component is unmounted or audio stream changes
    return () => {
      URL.revokeObjectURL(audioUrl);
    };
  }, [audioStream]);

  // Update progress as the audio plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!output) return;
      setTranscribing(true);
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

      const res = await fetch(`http://localhost:8000/note/transcribe?audio_id=${output}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      console.log("trans", data.data)
      setNote(data.data); // Update note once data is fetched
      setTranscribing(false);
    };

    fetchData();
  }, [output]);

  const handleNavigate = () => {
    // Pass note as default or fetched state to the editor page
    console.log(audioStream)
    navigate('/editor', { state: { note: note , audio: audioStream} });
  };

  return (
    <div className="w-full">
      <h1 className="text-center text-4xl mb-5">Your Recording</h1>
      <audio
        ref={audioRef}
        className="w-full bg-transparent"
        controls
        onTimeUpdate={handleTimeUpdate} // Update progress bar as audio plays
      >
        Your browser does not support the audio element.
      </audio>
      <div className='flex justify-center mt-4'>
          {
            transcribing ? 
            <div className='loader'></div> :
            <div>
              <button onClick={handleNavigate}>Go to Editor</button>
            </div>
          }
      </div>
    </div>
  );
};

