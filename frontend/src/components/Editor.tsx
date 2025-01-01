import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import '../styles/editor.css'; // Ensure you style it appropriately
import { FloatingBtn } from './FloatingBtn';
import AiChat from './AiChat';
import LeftSidebar from './LeftSideBar';
import EditorMenu from './EditorMenu';

export const Editor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(true);

  useEffect(() => {
    if (editorRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [
              { header: [1, 2, 3, false] },
              { font: [] },
              { size: ['small', false, 'large', 'huge'] }
            ],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            ['link', 'image'],
            ['clean']
          ]
        }
      });

      const toolbar = document.querySelector('.ql-toolbar');
      let savedRange : any = null;

      // Save the current selection when clicking on the toolbar
      toolbar?.addEventListener('mousedown', () => {
        savedRange = quill.getSelection();
      });

      // Restore the selection after interacting with the toolbar
      toolbar?.addEventListener('mouseup', () => {
        if (savedRange) {
          quill.setSelection(savedRange);
        }
      });
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!isRightSidebarOpen);
  };

  return (
    <div className="editor-wrapper flex flex-col h-screen w-screen">
      {/* Header Bar */}
      <div className="editor-header flex items-center px-4 py-2 bg-gray-100 shadow">
        <div className="editor-logo font-bold text-xl mr-4">CereNote</div>
        <div className='flex justify-between w-full'>
          <input
            type="text"
            placeholder="Untitled Document"
            className="editor-title bg-transparent  px-2 py-1 w-1/4 duration-100 rounded-md focus:outline-none focus:ring hover:border-2 border-blue-950"
          />
          <div className="editor-actions ml-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Share</button>
          </div>
        </div>
      </div>

      {/* Menu Bar */}
      <EditorMenu/>

      {/* Main Content with Sidebars and Editor */}
      <div className="editor-main bg-gray-200  flex flex-grow overflow-hidden">
        {/* Left Sidebar */}
        <div className={`editor-sidebar relative  ${isSidebarOpen ? 'w-1/5' : 'w-0'} transition-all duration-300 bg-gray-200 p-4 shadow-inner`}>
          <button 
            className="toggle-sidebar-btn  absolute right-0 ml-6  px-2 py-1 bg-blue-950 text-white rounded-md hover:bg-red-600"
            onClick={toggleSidebar}
          >
            {/* FontAwesome icon for left sidebar open/close */}
            {isSidebarOpen ? (
              <i className="fas fa-times h-4 w-4 text-white"></i>  // Close icon
            ) : (
              <i className="fas fa-bars h-4 w-4 text-white"></i>  // Open icon
            )}
          </button>
          {isSidebarOpen && (
            <LeftSidebar />
          )}
        </div>

        {/* Editor Container */}
        <div className={`editor-container bg-blue-950 flex-grow border-1 border-blue-950 ml-5 mr-5 overflow-hidden ${isSidebarOpen ? (isRightSidebarOpen ? 'w-3/5' : 'w-4/5') : (isRightSidebarOpen ? 'w-4/5' : 'w-full')}`}>
          {/* Toolbar */}
          <div className="editor-toolbar m-5 bg-gray-900 shadow-sm w-full fixed z-10 top-0"></div>
          
          {/* Editor Content */}
          <div ref={editorRef} className="editor-content m-5 bg-white shadow-sm rounded h-full overflow-auto mt-[55px]"></div>
        </div>

        {/* Right Sidebar */}
        <div className={`editor-right-sidebar ${isRightSidebarOpen ? 'w-1/5' : 'w-0'} transition-all duration-300 bg-gray-200 p-4 shadow-inner`}>
          <button 
            className="toggle-right-sidebar-btn mb-4 px-1 py-1  rounded-md hover:bg-blue-950 hover:text-white"
            onClick={toggleRightSidebar}
          >
            {/* FontAwesome icon for right sidebar open/close */}
            {isRightSidebarOpen ? (
               <i className="fas fa-times h-6 w-6 text-blue-950 text-center hover:text-white"></i>  //
            ) : (
              <FloatingBtn />  // Open icon
            )}
          </button>
          {isRightSidebarOpen && (
            <AiChat />
          )}
        </div>
      </div>


    </div>
  );
};
