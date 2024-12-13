import React from "react";
import { ListCard } from "./ListCard";

interface ListNotesProps {
  title: string;
}

export const ListNotes = ({ title }: ListNotesProps) => {
    const [dropDown, setDropDown] = React.useState(false);
  return (
    <div className="">
        <div className="flex gap-10">
        <h1 className="text-xl">{title}</h1>
        <div onClick={() => setDropDown(!dropDown)} className="duration-1000">
        {dropDown ? <i className="fa-solid fa-caret-down" ></i> : <i className="fa-solid fa-caret-right" ></i>}
        </div>
        </div>
        {
            dropDown ? 
            <div className="grid grid-cols-3 gap-5 my-3 duration-1000">
                <ListCard/>
                <ListCard/>
                <ListCard/>
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
