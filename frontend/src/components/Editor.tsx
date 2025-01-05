import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import '../styles/editor.css';
import { debounce } from 'lodash';
import { FloatingBtn } from './FloatingBtn';
import AiChat from './AiChat';
import LeftSidebar from './LeftSideBar';
import EditorMenu from './EditorMenu';
import { useLocation, useNavigate } from 'react-router-dom';

export const Editor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const debouncedSend = useRef(
    debounce((socket: WebSocket | null, noteId: string | undefined, title: string, content: any) => {
      if (socket?.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({
          id: noteId || null,
          title: title,
          content: content
        });
        console.log('Sending debounced message:', message);
        socket.send(message);
      } else {
        console.log('WebSocket is not open. ReadyState:', socket?.readyState);
      }
    }, 2000) // 2-second debounce delay
  ).current;

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [note, setNote] = useState<{ id?: string; title?: string; content?: string; updated_at: string } | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [lastSaved, setLastSaved] = useState<string>(''); // Track last saved time

  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const noteContent = location.state?.note;
  const noteId = noteContent?.id;

  const template = location.state?.template;
  const audioStream = location.state?.audio;

  // Function to calculate how many seconds ago the note was last saved
  const getSecondsAgo = (lastSaved: string): string => {
    const now = new Date();
    const lastSavedDate = new Date(lastSaved);
    const secondsAgo = Math.floor((now.getTime() - lastSavedDate.getTime()) / 1000);
    return `${secondsAgo} seconds ago`;
  };

  // Initialize Quill Editor
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
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
      quillRef.current = quill;
    }
  }, []);

  // Handle WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/editor/${token}`);

    ws.onopen = () => {
      console.log(noteContent)
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      console.log('Received:', event.data);
      const data = JSON.parse(event.data);

      // Update note state safely
      setNote((prev) => (JSON.stringify(prev) !== JSON.stringify(data?.note) ? data?.note : prev));
      setMessages((prev) => [...prev, data.content]);
    };

    ws.onclose = () => console.log('WebSocket connection closed');
    ws.onerror = (error) => console.error('WebSocket error:', error);

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [token]);

  // Synchronize Quill content with the WebSocket
  useEffect(() => {
    if (noteContent && !note) {
      setNote(noteContent);
    }

    if (quillRef.current) {
      // Save the current cursor position
      const cursorPosition = quillRef.current.getSelection()?.index;

      // Set the content if note or title is updated
      if (note && !title) {
        setTitle(note?.title || '');
        quillRef.current.root.innerHTML = note?.content || '';
      } else if (note && title) {
        setTitle(title);
        quillRef.current.root.innerHTML = note?.content || '';
      }


      // Restore the cursor position after setting the content
      if (cursorPosition !== undefined) {
        quillRef.current.setSelection(cursorPosition);
      }

      // Handle template insertion
      if (template) {
        quillRef.current.root.innerHTML = template;
      }

      // Attach text-change listener
      quillRef.current.on('text-change', () => {
        const editorContent = quillRef.current?.getSemanticHTML() || '';
        debouncedSend(socket, note?.id, title, editorContent);
        // Update last saved time immediately
        setLastSaved(new Date().toISOString());
      });
    }
  }, [note, title, template]);

  // Update last saved time every 5 seconds if no save occurs
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastSaved) {
        setLastSaved(new Date().toISOString());
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [lastSaved]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleRightSidebar = () => setRightSidebarOpen((prev) => !prev);

  return (
    <div className="editor-wrapper flex flex-col h-screen w-screen">
      {/* Header */}
      <header className="editor-header flex items-center px-4 py-2 bg-gray-100 shadow">
        <div
          className="editor-logo font-bold text-3xl text-blue-950 mr-4 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          CereNote
        </div>
        <div className="flex justify-between w-full">
          <div className='grid grid-cols-3 gap-2 w-full'>
          <input
            type="text"
            value={title || "Untitled Note"}
            onChange={(e) => setTitle(e.target.value)}
            className="editor-title bg-transparent px-2 py-1 w-1/4 rounded-md focus:outline-none focus:ring border hover:border-2 hover:border-blue-950 grid-cols-2 w-full"
          />
                    {/* Display Last Saved */}
                    {lastSaved && (
            <div className="text-xs text-gray-600 mt-2 mr-4">
              Last saved: {getSecondsAgo(lastSaved)}
            </div>
          )}
          </div>
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
          className={`editor-container bg-blue-950 flex-grow border ml-5 mr-5 overflow-hidden ${isSidebarOpen ? 'w-4/5' : 'w-full'}`}
        >
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
              <FloatingBtn type="chat" />
            )}
          </div>
          {isRightSidebarOpen && <AiChat />}
        </aside>
      </main>
    </div>
  );
};
