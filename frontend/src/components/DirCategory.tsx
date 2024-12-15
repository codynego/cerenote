import React, { useState, useEffect, useRef } from 'react';
import { DropDown } from './DropDown'; // Adjust the path as necessary

interface DirCategoryProps {
  title: string;
  id: number;
  activeId: number | null;
  setActiveId: (id: number | null) => void;
}

export const DirCategory: React.FC<DirCategoryProps> = ({ title, id, activeId, setActiveId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropDown, setDropDown] = useState(false);

  const handleOption = () => {
    setActiveId(activeId === id ? null : id);
    setDropDown(!dropDown);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setActiveId(null);
      setDropDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = activeId === id;

  return (
    <div ref={containerRef} className='ml-2 flex gap-2 cursor-pointer justify-between relative'>
      <div className='flex gap-2'>
        <DropDown dropDown={dropDown} setDropDown={setDropDown} />
        <h2>{title}</h2>
      </div>
      <i className="fa fa-ellipsis-v text-gray-600" onClick={handleOption}></i>
      {isActive && (
        <div className='p-2 text-sm bg-white text-blue-950 w-[70px] h-[40px] absolute right-[-80px] flex flex-col rounded-sm justify-center items-center'>
          <button className="border-b-2 border-gray-600 w-full" onClick={() => alert('Edit clicked')}>Edit</button>
          <button onClick={() => alert('Delete clicked')}>Delete</button>
        </div>
      )}
    </div>
  );
};