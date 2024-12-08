import { HeroRecording } from "./HeroRecording"
import { useAuth } from '../context/AuthProvider';


export const Hero = () => {
    const { isAuthenticated} = useAuth();
  return (
    <div className="flex flex-col justify-center items-center text-white gap-5">
        <div className="bg-slate-600  rounded-lg flex justify-between gap-2 p-[5px] text-white">
            <p className="bg-slate-400 px-[5px] rounded-lg text-blue-800 font-bold"><i className="fa-solid fa-lightbulb"></i> Guess what?</p>
            <p>Turn Chaos into clarity <i className="fa-solid fa-right-long text-purple-300"></i></p>
        </div>
        <div className="sm:w-1/2">
            <p className="text-4xl sm:text-5xl font-bold text-center ">Make meaning out of messy thoughts</p>
        </div>
        <HeroRecording/>
        <div className="md:w-1/2">
            <p className="text-md md:text-xl text-center text-gray-300">Transform scattered ideas into clear, actionable insights with the power of AI. Organize effortlessly, think creatively, and achieve more.</p>
        </div>
        {isAuthenticated ?
        <button className="button-primary px-4 py-2">Dashboard</button> : 
        <button className="button-primary px-8 py-2">Get Started</button>}
    </div>
  )
}
