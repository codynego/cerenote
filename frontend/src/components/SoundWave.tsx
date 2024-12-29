interface SoundWaveProps {
  isPaused: boolean;
}

export const SoundWave = ({ isPaused }: SoundWaveProps) => {
    return (
      <div className="soundwave w-full h-full mt-5 mb-5">
        <div className="inset-0 flex justify-center items-center">
          {[...Array(15)].map((_, index) => (
            <div
              key={index}
              className={`circle ${isPaused ? 'paused' : ''}`}
            />
          ))}
        </div>
      </div>
    );
  };
  