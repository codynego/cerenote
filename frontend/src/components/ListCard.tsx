import { useNavigate } from 'react-router-dom'
interface Note {
  title: string;
  content: string;
}

export const ListCard = ({note, key}: {note: Note, key: string}) => {
  const navigate = useNavigate()

  interface OpenEditorParams {
    note: Note;
  }

  const openEditor = (note: Note) => {
    navigate('/editor', { state: { note: note }});
  }
  return (
    <div className="bg-white text-gray-400   rounded-2xl h-[60px] md:h-[80px] overflow-hidden flex flex-col justify-center items-center p-4 cursor-pointer hover:border border-2 hover:bg-purple-800 hover:text-white gap-2" key={key} onClick={() => openEditor(note)}>
      <p className="text-xs ">{note.content.slice(0, 80)}</p>
      <div className="flex gap-4 w-full">
        <i className="fa-solid fa-note-sticky text-blue-700"></i>
        <h1 className="text-xs font-bold">{note.title}</h1>
      </div>
    </div>
  )
}
