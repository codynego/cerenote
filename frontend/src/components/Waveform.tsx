import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformProps {
  audioURL: string;
}

const Waveform = forwardRef<WaveSurfer | null, WaveformProps>(({ audioURL }, ref) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);

  useImperativeHandle(ref, () => waveSurferRef.current as WaveSurfer);

  useEffect(() => {
    if (waveformRef.current) {
      waveSurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ddd',
        progressColor: '#4a90e2',
        height: 100,
        width: 100,
      });

      waveSurferRef.current.load(audioURL);
    }

    return () => {
      waveSurferRef.current?.destroy();
    };
  }, [audioURL]);

  return <div ref={waveformRef} />;
});

export default Waveform;