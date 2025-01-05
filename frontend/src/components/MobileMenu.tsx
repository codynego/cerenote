import  { useState } from "react";


interface MobileMenuProps {
    setRecordState: (state: boolean) => void;
    menuOpen: boolean;
    setMenuOpen: (state: boolean) => void;
  } 
  

export const MobileMenu: React.FC<MobileMenuProps> = ({ setRecordState, menuOpen, setMenuOpen }) => {



  const toggleMenu = () => {
    console.log(menuOpen);
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-3/4 bg-white bg-opacity-10 shadow-lg border-t rounded-2xl border-gray-200 z-50">
      <div className="flex justify-around items-center px-4 py-2">
        {/* Hamburger Menu */}
        <button
          className="text-white text-lg"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        {/* New Note Icon */}
        <button
          className="absolute left-1/2 transform -translate-x-1/2 bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700"
          aria-label="Create new note"
        >
          <i className="fa-solid fa-plus text-2xl"></i>
        </button>

        {/* Profile Icon */}
        <button
          className="text-white text-lg"
          aria-label="View profile"
        >
          <i className="fa-solid fa-user"></i>
        </button>

        {/* ai recording Icon */}
        {/* <button
          className="text-white text-lg"
          aria-label="recordig"
          onClick={() => setRecordState(true)}>
          <i className="fa-solid fa-microphone"></i>
        </button> */}
      </div>

      {/* Collapsible Menu */}

    </div>
  );
};
