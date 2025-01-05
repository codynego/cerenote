import { FloatingBtn } from "@/components/FloatingBtn";
import { ListNotes } from "@/components/ListNotes";
import { SideBar } from "@/components/SideBar";
import { useAuth } from "../context/AuthProvider";
import VoiceRecording from "@/components/VoiceRecording";
import { useState } from "react";
import Templates from "@/components/Templates";
import { useNavigate } from "react-router-dom";
import { MobileMenu } from "@/components/MobileMenu";

export const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [recordState, setRecordState] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const openEditor = () => {
    navigate("/editor");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  console.log("dashboard", isAuthenticated);

  return (
    <div className="bg-primary text-white flex w-full h-screen overflow-hidden relative">
      {/* Hamburger Menu Button */}
      <button
        className="absolute top-4 right-6 z-50 p-2 bg-white text-black rounded-md md:hidden"
        onClick={toggleSidebar}
      >
        <i className={isSidebarOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
      </button>

      {/* Sidebar */}
      <div className={` bg-blue-950 md:block ${isSidebarOpen ? "block" : "hidden"} md:w-1/4 w-full`}>
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4">
        <h1 className="text-2xl block md:hidden">Cerenote</h1>
        <div className="flex justify-center py-7">
          <div className="w-full max-w-[600px] md:max-w-[800px]">
            <div
              className="cursor-pointer bg-white bg-opacity-30 border-dotted border-2 border-black md:w-[600px] md:h-[100px] h-[60px] flex justify-center items-center hover:opacity-60 hover:border-4 relative rounded-2xl m-auto"
              onClick={openEditor}
            >
              <i className="fa-regular fa-plus text-4xl"></i>
              <p className="absolute w-full text-4xl md:text-6xl opacity-5 text-center">New Notes</p>
            </div>

            <div>
              <Templates />
            </div>

            <div className="mt-5">
              <ListNotes title={"Recent Notes"} />
              {/* <ListNotes title={"All Notes"} /> */}
            </div>

            <div onClick={() => setRecordState(true)} className="p-10 hidden md:block">
              <FloatingBtn type={"record"} />
            </div>

            {recordState && <VoiceRecording />}
          </div>
        </div>
      </div>
    </div>
  );
};
