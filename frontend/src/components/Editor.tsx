import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import '../styles/editor.css';
import { FloatingBtn } from './FloatingBtn';
import AiChat from './AiChat';
import LeftSidebar from './LeftSideBar';
import EditorMenu from './EditorMenu';
import { useLocation, useNavigate } from 'react-router-dom';

export const Editor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [title, setTitle] = useState("Untitled Document");
  const location = useLocation();
  const navigate = useNavigate();

  const note = location.state?.note;
  const template = location.state?.template;
  const audioStream = location.state?.audio;

  const initialContent = note?.content || "";

  useEffect(() => {
    if (editorRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }, { font: [] }, { size: ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            ['link', 'image'],
            ['clean'],
          ],
        },
      });

      if (note) {
        setTitle(note?.title ? note.title : "Untitled Document");
      }

      if (template) {
        console.log("Template", template);
        quill.root.innerHTML = template; // Insert the template HTML
      }

      quill.setText(initialContent);
      (editorRef.current as any).quill = quill;

      quill.on('text-change', () => {
        const editorText = quill.getText().trim();
        setTitle(editorText.substring(0, 30) || "Untitled Document");
      });

      const toolbar = document.querySelector('.ql-toolbar');
      let savedRange: any = null;

      toolbar?.addEventListener('mousedown', () => {
        savedRange = quill.getSelection();
      });

      toolbar?.addEventListener('mouseup', () => {
        if (savedRange) {
          quill.setSelection(savedRange);
        }
      });

    }
  }, [initialContent, note, template]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleRightSidebar = () => setRightSidebarOpen((prev) => !prev);

  return (
    <div className="editor-wrapper flex flex-col h-screen w-screen">
      {/* Header */}
      <header className="editor-header flex items-center px-4 py-2 bg-gray-100 shadow">
        <div
          className="editor-logo font-bold text-3xl text-blue-950 mr-4 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          CereNote
        </div>
        <div className="flex justify-between w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="editor-title bg-transparent px-2 py-1 w-1/4 rounded-md focus:outline-none focus:ring border hover:border-2 hover:border-blue-950"
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Share</button>
        </div>
      </header>

      {/* Menu Bar */}
      <EditorMenu />

      {/* Main Content */}
      <main className="editor-main bg-gray-200 flex flex-grow overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`editor-sidebar relative ${isSidebarOpen ? 'w-1/5' : 'w-0'} transition-all duration-300 bg-gray-200 p-4 shadow-inner`}
        >
          <button
            className="absolute right-0 px-2 py-1 bg-blue-950 text-white rounded-md hover:bg-red-600"
            onClick={toggleSidebar}
          >
            <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'} text-white`}></i>
          </button>
          {isSidebarOpen && <LeftSidebar audioStream={audioStream} />}
        </aside>

        {/* Editor */}
        <section
          className={`editor-container bg-blue-950 flex-grow border ml-5 mr-5 overflow-hidden ${
            isSidebarOpen
              ? isRightSidebarOpen
                ? 'w-3/5'
                : 'w-4/5'
              : isRightSidebarOpen
              ? 'w-4/5'
              : 'w-full'
          }`}
        >
          <div className="editor-toolbar m-5 bg-gray-900 shadow-sm w-full fixed z-10 top-0"></div>
          <div
            ref={editorRef}
            className="editor-content m-5 bg-white shadow-sm rounded h-full overflow-auto mt-[55px]"
          ></div>
        </section>

        {/* Right Sidebar */}
        <aside
          className={`editor-right-sidebar ${isRightSidebarOpen ? 'w-1/5' : 'w-0'} transition-all duration-300 bg-gray-200 p-4 shadow-inner`}
        >
          <div
            className="mb-4 px-1 py-1 rounded-md bg-blue-950 hover:bg-red-600"
            onClick={toggleRightSidebar}
          >
            {isRightSidebarOpen ? (
              <i className="fas fa-times text-white"></i>
            ) : (
              <FloatingBtn type={"chat"} />
            )}
          </div>
          {isRightSidebarOpen && <AiChat />}
        </aside>
      </main>
    </div>
  );
};
