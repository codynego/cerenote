import React from 'react';
import { DropDown } from './DropDown';
import { DirCategory } from './DirCategory';
import { Category } from './Category';

export const SideBar = () => {
    const [dropDown, setDropDown] = React.useState(false);
  return (
    <div className='md:w-1/5 h-screen bg-blue-950  shadow-slate-300 p-3 md:p-7 flex flex-col justify-between'>
      <div className="">
        <div className="">
            <h2>Recent notes</h2>
        </div>
        <div className='border-b-2 border-t-2 mt-2 pt-4 pb-4 border-gray-500'>
          <div className="flex justify-between ">
            <div className='flex gap-2 cursor-pointer mb-2'>
                <DropDown dropDown={dropDown} setDropDown={setDropDown} />
                <h2>Folders</h2>
              </div>
              <i className="fa-regular fa-plus cursor-pointer"></i>
          </div>
          {dropDown ? 
          <div className='flex flex-col gap-2'>
            <DirCategory title="Personal Media" />
            <DirCategory title="Work" />
            <DirCategory title="School" />
          </div> : null}
        </div>
        <div>
          <Category title="Starred" count={10} />
          <Category title="Archived" count={4} />
          <Category title="Trash" count={6} />
        </div>
      </div>
      <div className='bg-white text-blue-950 font-semibold p-2 rounded-md w-full  text-center hover:bg-purple-200 hover:opacity-80'>
        <button className='text-center'>Settings</button>
      </div>
    </div>
  )
}
