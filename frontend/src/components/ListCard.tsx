import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Note {
  id: number;
  title: string;
  content: string;
}

export const ListCard = ({ note, key }: { note: Note, key: string }) => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);  // Local state to show/hide options

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = note.content;
  const textContent = tempDiv.textContent || tempDiv.innerText;
  const content = textContent.replace(/\s+$/, '');

  const openEditor = (note: Note) => {
    navigate('/editor', { state: { note: note } });
  };

  const handleOptionClick = (action: string) => {
    setShowOptions(false);  // Close the options menu after an action is clicked
    switch (action) {
      case 'edit':
        openEditor(note);
        break;
      case 'delete':
        // Add delete functionality here
        alert('Delete functionality not implemented');
        break;
      case 'share':
        // Add share functionality here
        alert('Share functionality not implemented');
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="bg-white text-gray-400 rounded-2xl h-[60px] md:h-[80px] overflow-hidden flex flex-col justify-center items-center p-4 cursor-pointer hover:border border-2 hover:bg-purple-800 hover:text-white gap-2"
      key={key}
      onClick={() => openEditor(note)}
    >
      <div className="flex w-full justify-between items-center">
        <p className="text-xs">{content.slice(0, 30)}</p>

        {/* Options icon */}
        <div className="relative">
          <i
            className="fa-solid fa-ellipsis-vertical text-white cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();  // Prevent triggering the editor on icon click
              setShowOptions(!showOptions);  // Toggle options visibility
            }}
          />

          {/* Options menu */}
          {showOptions && (
            <div
              className="absolute right-0 bg-white text-gray-700 rounded-md shadow-lg w-32 mt-1 z-10"
              onMouseLeave={() => setShowOptions(false)} // Hide options on mouse leave
            >
              <ul className="text-xs">
                <li
                  className="cursor-pointer hover:bg-gray-200 p-2"
                  onClick={() => handleOptionClick('edit')}
                >
                  Edit
                </li>
                <li
                  className="cursor-pointer hover:bg-gray-200 p-2"
                  onClick={() => handleOptionClick('delete')}
                >
                  Delete
                </li>
                <li
                  className="cursor-pointer hover:bg-gray-200 p-2"
                  onClick={() => handleOptionClick('share')}
                >
                  Share
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <i className="fa-solid fa-note-sticky text-blue-700"></i>
        <h1 className="text-xs font-bold">{note.title}</h1>
      </div>
    </div>
  );
};
