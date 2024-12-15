import React from "react";
import { ListCard } from "./ListCard";
import { DropDown } from "./DropDown";

interface ListNotesProps {
  title: string;
}

export const ListNotes = ({ title }: ListNotesProps) => {
    const [dropDown, setDropDown] = React.useState(false);
  return (
    <div className="py-2 overflow-x-hidden">
        <div className="flex gap-5">
        <h1 className="text-xl">{title}</h1>
        <DropDown dropDown={dropDown} setDropDown={setDropDown} />
        </div>
        {
            dropDown ? 
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 my-3">
                <ListCard/>
                <ListCard/>
                <ListCard/>
                <ListCard/>
                <ListCard/>
                <ListCard/>
  
            </div> : null
        }
    </div>
  )
}
