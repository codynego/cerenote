import { FloatingBtn } from "@/components/FloatingBtn"
import { ListNotes } from "@/components/ListNotes"
import { SideBar } from "@/components/SideBar"
import { useAuth } from '../context/AuthProvider';
// import { useNavigate } from "react-router-dom";
import VoiceRecording from "@/components/VoiceRecording";
import { useState, useRef, useEffect } from "react";
import { MessageTypes } from '@/utils/presets'

export const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [recordState, setRecordState] = useState(true)

  // const navigate = useNavigate();
  console.log("dashboard",isAuthenticated)
  return (
    <div className="bg-primary text-white flex w-full h-screen overflow-hidden relative">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-y-auto p-10">
        <div className="flex justify-center py-7">
          <div className="w-full max-w-[600px] md:max-w-[800px]">
            <div className="bg-white bg-opacity-30 border-dotted border-2 border-black md:w-[600px] md:h-[100px] h-[60px] flex justify-center items-center hover:opacity-60 hover:border-4 relative rounded-2xl m-auto">
              <i className="fa-regular fa-plus text-4xl"></i>
              <p className="absolute w-full text-4xl md:text-6xl opacity-5 text-center">New Notes</p>
            </div>
            <div className="mt-16">
              <ListNotes title={"Recent Notes"} />
              <ListNotes title={"All Notes"} />
            </div>
            <div onClick={() => setRecordState(true)} className="p-10">
            <FloatingBtn/>
            </div>
            {recordState ? <VoiceRecording/> : null
            }
          </div>
        </div>
      </div>
    </div>
  )
}

