import {useRef, useEffect } from 'react';

interface TranscribingProps {

    output: null;
  
    handleFormSubmission: () => void;
  
    handleAudioReset: () => void;
  
    audioStream: Blob;
  
  }
  

export const Transcribing: React.FC<TranscribingProps> = ({ output, handleFormSubmission, handleAudioReset, audioStream }) => {
    const audioRef = useRef<HTMLAudioElement>(null)
    console.log(output)

    useEffect(() => {
        if (!audioStream) { return }
        if (audioStream) {
            console.log('EHER AUDIO', audioStream)
            if (audioRef.current) {
                audioRef.current.src = URL.createObjectURL(audioStream)
            }
        }
    }, [audioStream])
  
    return (
    <div className="">
      <h1 className="">Transcribing</h1>
      <div className=''>
                <audio ref={audioRef} className='w-full' controls>
                    Your browser does not support the audio element.
                </audio>
        </div>
      <div className="">{"hello"}</div>
      {/* Add buttons or other elements to use the new props */}
      <button onClick={handleFormSubmission}>Transcribe</button>
      <button onClick={handleAudioReset}>Reset Audio</button>
      {/* You can also use the audioStream prop as needed */}
    </div>
  )
}