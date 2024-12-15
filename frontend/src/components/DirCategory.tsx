import React from 'react';
import {DropDown} from './DropDown'; // Adjust the path as necessary

interface DirCategoryProps {
  title: string;
}

export const DirCategory: React.FC<DirCategoryProps> = ({ title}) => {
  const [dropDown, setDropDown] = React.useState(false);
  return (
      <div className='ml-2 flex gap-2 cursor-pointer justify-between'>
        <div className='flex gap-2'>
          <DropDown dropDown={dropDown} setDropDown={setDropDown}/>
          <h2>{title}</h2>
        </div>
        <i className="fa fa-ellipsis-v text-gray-600" ></i>
    </div>
  )
}
