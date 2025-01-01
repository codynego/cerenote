import React, { useState, useEffect, useRef } from 'react';

const MenuBar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleMenuClick = (menu: string) => {
    setActiveMenu((prevMenu) => (prevMenu === menu ? null : menu));
  };

  // Close the menu if clicking outside of the menu area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="editor-menu-bar z-10 bg-gray-100 px-4 py-2 shadow flex space-x-4">
      {/* File Menu */}
      <div className="relative">
        <button className="menu-item" onClick={() => handleMenuClick('file')}>File</button>
        {activeMenu === 'file' && (
          <div className="dropdown-menu flex flex-col gap-2 absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2 items-start">
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">New</button>
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Open</button>
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Save</button>
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Save As</button>
          </div>
        )}
      </div>

      {/* Edit Menu */}
      <div className="relative">
        <button className="menu-item" onClick={() => handleMenuClick('edit')}>Edit</button>
        {activeMenu === 'edit' && (
          <div className="dropdown-menu absolute flex flex-col gap-2 left-0 mt-2 w-48 bg-white shadow-lg rounded-md flex flex-col p-2 items-start">
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Undo</button>
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Redo</button>
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Cut</button>
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Copy</button>
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Paste</button>
          </div>
        )}
      </div>

      {/* View Menu */}
      <div className="relative">
        <button className="menu-item" onClick={() => handleMenuClick('view')}>View</button>
        {activeMenu === 'view' && (
          <div className="dropdown-menu gap-2 absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md flex flex-col p-2 items-start">
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Zoom In</button>
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Zoom Out</button>
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Full Screen</button>
          </div>
        )}
      </div>

      {/* Insert Menu */}
      <div className="relative">
        <button className="menu-item" onClick={() => handleMenuClick('insert')}>Insert</button>
        {activeMenu === 'insert' && (
          <div className="dropdown-menu gap-2 absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md flex flex-col p-2 items-start">
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Image</button>
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Link</button>
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Table</button>
          </div>
        )}
      </div>

      {/* Format Menu */}
      <div className="relative">
        <button className="menu-item" onClick={() => handleMenuClick('format')}>Format</button>
        {activeMenu === 'format' && (
          <div className="dropdown-menu flex flex-col p-2 items-start absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md">
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Bold</button>
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Italic</button>
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Underline</button>
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Text Color</button>
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Highlight</button>
          </div>
        )}
      </div>

      {/* Tools Menu */}
      <div className="relative">
        <button className="menu-item" onClick={() => handleMenuClick('tools')}>Tools</button>
        {activeMenu === 'tools' && (
          <div className="dropdown-menu absolute flex flex-col p-2 items-start left-0 mt-2 w-48 bg-white shadow-lg rounded-md">
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Spell Check</button>
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Word Count</button>
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Find and Replace</button>
          </div>
        )}
      </div>

      {/* Extensions Menu */}
      <div className="relative">
        <button className="menu-item" onClick={() => handleMenuClick('extensions')}>Extensions</button>
        {activeMenu === 'extensions' && (
          <div className="dropdown-menu flex flex-col p-2 items-start absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md">
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Manage Extensions</button>
            <button className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left">Add Extension</button>
          </div>
        )}
      </div>

      {/* Help Menu */}
      <div className="relative">
        <button className="menu-item" onClick={() => handleMenuClick('help')}>Help</button>
        {activeMenu === 'help' && (
          <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md flex flex-col p-2 items-start">
            <button className="dropdown-item">Documentation</button>
            <button className="dropdown-item">About</button>
            <button className="dropdown-item">Support</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuBar;
