import { useRef, useEffect, useState } from 'react';

interface AudioElementProps {
  audioStream: Blob | null; // Handle the case of null audio stream
}

export const AudioElement: React.FC<AudioElementProps> = ({ audioStream }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // Track the audio progress

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


  // Handle seeking (when user interacts with the progress bar)
  // const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (audioRef.current) {
  //     const newTime = (audioRef.current.duration * parseFloat(event.target.value)) / 100;
  //     audioRef.current.currentTime = newTime;
  //   }
  // };

  return (
    <div className="w-full">
      <h1 className="text-center text-4xl mb-5">Your Recording</h1>
      <audio
        ref={audioRef}
        className="w-full bg-transparent"
        controls
        // onTimeUpdate={handleTimeUpdate} // Update progress bar as audio plays
      >
        Your browser does not support the audio element.
      </audio>

      {/* Custom Play/Pause Button
      <div className="flex justify-center mt-4">
        <button
          onClick={togglePlay}
          className="bg-green-600  text-white py-2 px-4 rounded-full w-20 h-20"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div> */}

    </div>
  );
};
