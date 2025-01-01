import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import '../styles/editor.css'; // Ensure you style it appropriately
import { FloatingBtn } from './FloatingBtn';
import AiChat from './AiChat';

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
        <input
          type="text"
          placeholder="Untitled Document"
          className="editor-title flex-grow px-2 py-1 border rounded-md focus:outline-none focus:ring"
        />
        <div className="editor-actions ml-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Share</button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="editor-menu-bar bg-gray-100 px-4 py-2 shadow flex space-x-4">
        <button className="menu-item">File</button>
        <button className="menu-item">Edit</button>
        <button className="menu-item">View</button>
        <button className="menu-item">Insert</button>
        <button className="menu-item">Format</button>
        <button className="menu-item">Tools</button>
        <button className="menu-item">Extensions</button>
        <button className="menu-item">Help</button>
      </div>

      {/* Main Content with Sidebars and Editor */}
      <div className="editor-main flex flex-grow overflow-hidden">
        {/* Left Sidebar */}
        <div className={`editor-sidebar ${isSidebarOpen ? 'w-1/5' : 'w-0'} transition-all duration-300 bg-gray-200 p-4 shadow-inner`}>
          <button 
            className="toggle-sidebar-btn mb-4 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={toggleSidebar}
          >
            {/* FontAwesome icon for left sidebar open/close */}
            {isSidebarOpen ? (
              <i className="fas fa-times h-6 w-6 text-white"></i>  // Close icon
            ) : (
              <i className="fas fa-bars h-6 w-6 text-white"></i>  // Open icon
            )}
          </button>
          {isSidebarOpen && (
            <>
              <div className="sidebar-item py-2 px-3 hover:bg-gray-300 rounded cursor-pointer">Outline</div>
              <div className="sidebar-item py-2 px-3 hover:bg-gray-300 rounded cursor-pointer">Comments</div>
              <div className="sidebar-item py-2 px-3 hover:bg-gray-300 rounded cursor-pointer">Bookmarks</div>
            </>
          )}
        </div>

        {/* Editor Container */}
        <div className={`editor-container flex-grow p-4 overflow-hidden ${isSidebarOpen ? (isRightSidebarOpen ? 'w-3/5' : 'w-4/5') : (isRightSidebarOpen ? 'w-4/5' : 'w-full')}`}>
          {/* Toolbar */}
          <div className="editor-toolbar bg-gray-100 shadow-sm w-full fixed z-10 top-0"></div>
          
          {/* Editor Content */}
          <div ref={editorRef} className="editor-content bg-white shadow-sm rounded h-full overflow-auto mt-[55px]"></div>
        </div>

        {/* Right Sidebar */}
        <div className={`editor-right-sidebar ${isRightSidebarOpen ? 'w-1/5' : 'w-0'} transition-all duration-300 bg-gray-200 p-4 shadow-inner`}>
          <button 
            className="toggle-right-sidebar-btn mb-4 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={toggleRightSidebar}
          >
            {/* FontAwesome icon for right sidebar open/close */}
            {isRightSidebarOpen ? (
               <i className="fas fa-times h-6 w-6 text-white text-center"></i>  //
            ) : (
              <FloatingBtn />  // Open icon
            )}
          </button>
          {isRightSidebarOpen && (
            <AiChat />
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="editor-footer px-4 py-2 bg-gray-200 text-sm text-gray-600 flex justify-end">
        <span>Last edited a few seconds ago</span>
      </div>
    </div>
  );
};
