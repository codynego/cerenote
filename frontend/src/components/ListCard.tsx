import { useNavigate } from 'react-router-dom'
interface Note {
  id: number;
  title: string;
  content: string;
}

export const ListCard = ({note, key}: {note: Note, key: string}) => {
  const navigate = useNavigate()

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = note.content;

  const textContent = tempDiv.textContent || tempDiv.innerText;
  const content = textContent.replace(/\s+$/, '');

  interface OpenEditorParams {
    note: Note;
  }

  const openEditor = (note: Note) => {
    console.log(note)
    navigate('/editor', { state: { note: note }});
  }
  return (
    <div className="bg-white text-gray-400   rounded-2xl h-[60px] md:h-[80px] overflow-hidden flex flex-col justify-center items-center p-4 cursor-pointer hover:border border-2 hover:bg-purple-800 hover:text-white gap-2" key={key} onClick={() => openEditor(note)}>
      <p className="text-xs ">{content.slice(0, 30)}</p>
      <div className="flex gap-4 w-full">
        <i className="fa-solid fa-note-sticky text-blue-700"></i>
        <h1 className="text-xs font-bold">{note.title}</h1>
      </div>
    </div>
  )
}
