import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import '../styles/editor.css'; // Ensure you style it appropriately

export const Editor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (editorRef.current) {
      new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: '#quill-toolbar', // Connect the toolbar using its ID
        },
      });
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="editor-wrapper flex flex-col h-screen w-screen">
      {/* Header Bar */}
      <div className="editor-header flex items-center px-4 py-2 bg-gray-100 shadow">
        <div className="editor-logo font-bold text-xl mr-4">Google Docs Clone</div>
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

      {/* Toolbar */}
      <div id="quill-toolbar" className="editor-toolbar bg-gray-600 shadow-sm">
        <span className="ql-formats">
          <select className="ql-header">
            <option value="1"></option>
            <option value="2"></option>
            <option selected></option>
          </select>
          <select className="ql-font"></select>
          <select className="ql-size">
            <option value="small"></option>
            <option selected></option>
            <option value="large"></option>
            <option value="huge"></option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
          <button className="ql-strike"></button>
        </span>
        <span className="ql-formats">
          <select className="ql-color"></select>
          <select className="ql-background"></select>
        </span>
        <span className="ql-formats">
          <button className="ql-script" value="sub"></button>
          <button className="ql-script" value="super"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-link"></button>
          <button className="ql-image"></button>
        </span>
      </div>

      {/* Main Content with Sidebar and Editor */}
      <div className="editor-main flex flex-grow">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="editor-sidebar w-1/5 bg-gray-200 p-4 shadow-inner">
            <button
              className="toggle-sidebar-btn mb-4 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={toggleSidebar}
            >
              Collapse
            </button>
            <div className="sidebar-item py-2 px-3 hover:bg-gray-300 rounded cursor-pointer">Outline</div>
            <div className="sidebar-item py-2 px-3 hover:bg-gray-300 rounded cursor-pointer">Comments</div>
            <div className="sidebar-item py-2 px-3 hover:bg-gray-300 rounded cursor-pointer">Bookmarks</div>
          </div>
        )}

        {/* Editor Container */}
        <div className={`editor-container flex-grow p-4 ${isSidebarOpen ? 'w-4/5' : 'w-full'}`}>
          <div ref={editorRef} className="editor-content bg-white shadow-sm rounded h-full"></div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="editor-footer px-4 py-2 bg-gray-200 text-sm text-gray-600 flex justify-end">
        <span>Last edited a few seconds ago</span>
      </div>
    </div>
  );
};
