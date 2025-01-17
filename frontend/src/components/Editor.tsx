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
  const [note, setNote] = useState<{ id?: string; title?: string; content?: string; summary?: string; updated_at: string } | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [lastSaved, setLastSaved] = useState<string>(''); // Track last saved time
  const [showActions, setShowActions] = useState(false); // State to control the visibility of action buttons

  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const noteContent = location.state?.note;
  const noteId = noteContent?.id;

  const [leftWidth, setLeftWidth] = useState(20); // Left sidebar width (%)
  const [rightWidth, setRightWidth] = useState(20); // Right sidebar width (%)
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);

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
      console.log(noteContent);
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
    console.log("note", noteContent)
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

  const handleOptionClick = () => setShowActions((prev) => !prev);

  const handleMouseMove = (e: MouseEvent) => {
    if (isDraggingLeft) {
      const newLeftWidth = (e.clientX / window.innerWidth) * 100;
      setLeftWidth(Math.min(Math.max(newLeftWidth, 10), 50)); // Restrict between 10% and 50%
    }

    if (isDraggingRight) {
      const newRightWidth = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
      setRightWidth(Math.min(Math.max(newRightWidth, 10), 50)); // Restrict between 10% and 50%
    }
  };

  const handleMouseUp = () => {
    setIsDraggingLeft(false);
    setIsDraggingRight(false);
  };

  useEffect(() => {
    if (isDraggingLeft || isDraggingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingLeft, isDraggingRight]);

  return (
    <div className="editor-wrapper flex flex-col h-screen w-screen  bg-gray-100">
      {/* Header */}
      <header className="editor-header flex items-center px-4 py-2 bg-gray-100 shadow w-full">
        <div
          className="editor-logo font-bold text-3xl text-blue-950 mr-4 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          CereNote
        </div>
        <div className="flex justify-between w-full">
          <div className="grid grid-cols-3 gap-2 w-full">
            <input
              type="text"
              placeholder='Untitled Note'
              value={title}
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

          {/* Options Icon */}
          <div className="relative">
            <button
              className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              onClick={handleOptionClick}
            >
              ⋮
            </button>

            {/* Action Buttons (Edit, Delete, Share) */}
            {showActions && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md p-2">
                <button className="block text-blue-500 hover:text-blue-700 mb-2">Edit</button>
                <button className="block text-red-500 hover:text-red-700 mb-2">Delete</button>
                <button className="block text-blue-500 hover:text-blue-700">Share</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Menu Bar */}
      <EditorMenu />

      {/* Main Content */}
      <main className="relative editor-main bg-gray-200 flex flex-grow overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`editor-sidebar relative transition-all duration-300 bg-gray-200 md:p-4 p-0 shadow-inner hidden md:block`}
          style={{ width: `${isSidebarOpen ? leftWidth + '%' : '0'}` }}
        >
          <button
            className="absolute left-2 md:right-0  bg-blue-950 text-white rounded-md hover:bg-red-600"
            onClick={toggleSidebar}
          >
            <i className={`fas text-xs ${isSidebarOpen ? 'fa-times' : 'fa-bars'} text-white`}></i>
          </button>
          {isSidebarOpen && <LeftSidebar audioStream={audioStream} summary={note?.summary || ''} note_id={note?.id ? parseInt(note.id) : 0} />}
        </aside>
                {/* Draggable Divider for Left Sidebar */}
                <div
          className="resizable-divider"
          onMouseDown={() => setIsDraggingLeft(true)}
          style={{
            cursor: 'ew-resize',
            width: '5px',
            backgroundColor: '#ccc',
          }}
        ></div>

        {/* Editor */}
        <section
          className={`editor-container bg-blue-950 flex-grow border md:ml-0 md:mr-0 overflow-hidden ${isSidebarOpen ? 'w-4/5' : 'w-full'}`}
          style={{ width: `${100 - leftWidth - rightWidth}%` }}
        >
          <div
            ref={editorRef}
            className="editor-content m-5 bg-white shadow-sm rounded h-full overflow-auto mt-[55px]"
          ></div>
        </section>

        {/* Draggable Divider for Right Sidebar */}
        <div
          className="resizable-divider"
          onMouseDown={() => setIsDraggingRight(true)}
          style={{
            cursor: 'ew-resize',
            width: '5px',
            backgroundColor: '#ccc',
          }}
        ></div>

        {/* Right Sidebar */}
        <aside
          className={`editor-right-sidebar  transition-all duration-300 bg-gray-200 shadow-inner`}
          style={{ width: `${isRightSidebarOpen ? rightWidth + '%' : '0'}` }}
        >
          <div
            className="mb-4 px-1 py-1 rounded-md bg-blue-950 hover:bg-red-600 z-50 absolute"
            onClick={toggleRightSidebar}
          >
            {isRightSidebarOpen ? (
              <i className="fas fa-times text-white z-50 "></i>
            ) : (
              <FloatingBtn type="chat" />
            )}
          </div>
          {isRightSidebarOpen && <AiChat noteId={note?.id ? parseInt(note.id) : 0}/>}
        </aside>
      </main>
    </div>
  );
};
