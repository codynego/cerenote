import React, { useState, useEffect, useRef } from 'react';
import { FiMenu } from 'react-icons/fi'; // Importing an icon for the mobile menu

const MenuBar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleMenuClick = (menu: string) => {
    setActiveMenu((prevMenu) => (prevMenu === menu ? null : menu));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Close the menu if clicking outside of the menu area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="editor-menu-bar z-10 bg-gray-100 shadow">
      {/* Mobile Menu Toggle */}
      <div className="flex justify-between items-center px-4 py-2 md:hidden">
        <h1 className="text-xl font-bold">Menu</h1>
        <button onClick={toggleMobileMenu} className="text-2xl">
          <FiMenu />
        </button>
      </div>

      {/* Menu Items */}
      <div
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:flex space-x-4 px-4 py-2 flex-col md:flex-row md:items-center`}
      >
        {[
          { name: 'File', items: ['New', 'Open', 'Save', 'Save As'] },
          { name: 'Edit', items: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste'] },
          { name: 'View', items: ['Zoom In', 'Zoom Out', 'Full Screen'] },
          { name: 'Insert', items: ['Image', 'Link', 'Table'] },
          { name: 'Format', items: ['Bold', 'Italic', 'Underline', 'Text Color', 'Highlight'] },
          { name: 'Tools', items: ['Spell Check', 'Word Count', 'Find and Replace'] },
          { name: 'Extensions', items: ['Manage Extensions', 'Add Extension'] },
          { name: 'Help', items: ['Documentation', 'About', 'Support'] },
        ].map((menu) => (
          <div key={menu.name} className="relative">
            <button
              className="menu-item hover:underline"
              onClick={() => handleMenuClick(menu.name)}
            >
              {menu.name}
            </button>
            {activeMenu === menu.name && (
              <div className="dropdown-menu flex flex-col gap-2 absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2 items-start md:static">
                {menu.items.map((item) => (
                  <button
                    key={item}
                    className="dropdown-item hover:bg-blue-950 hover:text-white w-full p-1 text-left"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuBar;
