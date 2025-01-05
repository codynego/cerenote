import React, { useState, useEffect, useRef } from 'react';
import { FaRegCommentDots, FaFileImage, FaClipboardList, FaEdit, FaCogs, FaExclamationCircle } from 'react-icons/fa';

interface LeftSidebarProps {
    audioStream: Blob;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ audioStream }) => {
  const [activeSection, setActiveSection] = useState<string>('summarization');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Function to handle dropdown change
  const handleSectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveSection(event.target.value);
  };

  const handleSummarize = () => {
    console.log("summarize")
  }
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
  return (
    <div className="w-64 text-gray-800 pr-4 pl-4 h-full flex flex-col">
      {/* Sidebar Title */}
      <div className="text-2xl font-semibold mb-6">Note Tools</div>

      {/* Dropdown for Section Selection */}
      <select
        className="p-2 rounded-md text-sm bg-white border-gray-300 border mb-4"
        value={activeSection}
        onChange={handleSectionChange}
      >
        <option value="summarization">AI Summarization</option>
        <option value="media">Media</option>
        <option value="analytics">Analytics</option>
        <option value="suggestions">Actionable AI Suggestions</option>
      </select>

      {/* Scrollable Content */}
      <div className="mt-4 flex-grow overflow-y-auto">
        {activeSection === 'summarization' && (
          <div>
            <h3 className="text-xl mb-2">AI Summarization</h3>
            <p>Summarize your notes using AI to get a concise version of the content. This helps in reducing the length while retaining important details.</p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={() => {handleSummarize()}}>Summarize</button>
          </div>
        )}

        {activeSection === 'media' && (
          <div>
            <h3 className="text-xl mb-2">Add Media</h3>
            <p>Add images, videos, and audio to enrich your note content. This helps in making your notes more visual and interactive.</p>
            <audio
                ref={audioRef}
                className="w-full bg-transparent"
                controls
                // Update progress bar as audio plays
            >
                Your browser does not support the audio element.
            </audio>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Media</button>
          </div>
        )}

        {activeSection === 'analytics' && (
          <div>
            <h3 className="text-xl mb-2">Analytics</h3>
            <div className="space-y-3">
              {/* Human vs AI Checker */}
              <div className="flex items-center">
                <FaExclamationCircle className="mr-2 text-yellow-400" />
                <p>Human vs AI Checker</p>
              </div>
              {/* Grammar Checker */}
              <div className="flex items-center">
                <FaEdit className="mr-2 text-green-400" />
                <p>Grammar Checker</p>
              </div>
              {/* Suggestion Section */}
              <div className="flex items-center">
                <FaClipboardList className="mr-2 text-orange-400" />
                <p>Suggestions (Tone, Structure, etc.)</p>
              </div>
              {/* Plagiarism Checker */}
              <div className="flex items-center">
                <FaFileImage className="mr-2 text-red-400" />
                <p>Plagiarism Checker</p>
              </div>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Analyze</button>
            </div>
          </div>
        )}

        {activeSection === 'suggestions' && (
          <div>
            <h3 className="text-xl mb-2">Actionable AI Suggestions</h3>
            <p>AI suggests actions based on the content of the note, such as setting reminders, creating tasks, etc.</p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Get Suggestions</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
