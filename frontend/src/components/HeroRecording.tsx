
import soundWaveImage from '../assets/soundwave2.png';

export const HeroRecording = () => {
  return (
    <div className='w-full flex justify-center items-center relative'>
      <div className='w-48 h-48 rounded-full bg-white shadow-inner-blue'></div>
      <img src={soundWaveImage} alt="sound wave" className='w-full md:w-1/2 h-[300px] md:h-[500px] absolute'/>
    </div>
  );
};