import React, { useEffect } from "react";
import { ListCard } from "./ListCard";
import { DropDown } from "./DropDown";

interface ListNotesProps {
  title: string;
}

export const ListNotes = ({ title }: ListNotesProps) => {
    const [dropDown, setDropDown] = React.useState(false);
    const [notes, setNotes] = React.useState([]);
    const url = "http://localhost:8000/notes/";

    useEffect(() => {
      const token = localStorage.getItem("token");
      const fetchNotes = async () => {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setNotes(data.data);
      }
      fetchNotes();
    },[]);
  return (
    <div className="py-2 overflow-x-hidden">
        <div className="flex gap-5">
        <h1 className="text-xl">{title}</h1>
        <DropDown dropDown={dropDown} setDropDown={setDropDown} />
        </div>
        {
            dropDown ? 
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 my-3">
                {notes.map((note: any) => (
                    <ListCard key={note.id} note={note} />
                ))}
            </div> : null
        }
    </div>
  )
}
