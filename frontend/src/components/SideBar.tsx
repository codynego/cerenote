// import React from 'react';
// import { DropDown } from './DropDown';
// import { DirCategory } from './DirCategory';

import { Category } from './Category';
// import { Folder } from 'lucide-react';
import { Folders } from './Folders';

export const SideBar = () => {
    // const [dropDown, setDropDown] = React.useState(false);
    

  return (
    <div className='md:w-1/5 h-screen bg-blue-950  shadow-slate-300 p-3 md:p-7 flex flex-col justify-between'>
      <div className="">
        <div className="border-b-2  mt-2 pt-4 pb-4 border-gray-600">
            <h2>Recent notes</h2>
        </div>
        <Folders title='My Folders' shared={false}/>
        <Folders title='Shared with me' shared={true}/>
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
