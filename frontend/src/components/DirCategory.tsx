import React from 'react';
import {DropDown} from './DropDown'; // Adjust the path as necessary

interface DirCategoryProps {
  title: string;
}

export const DirCategory: React.FC<DirCategoryProps> = ({ title }) => {
  const [dropDown, setDropDown] = React.useState(false);
  return (
      <div className='ml-2 flex gap-2 cursor-pointer'>
        <DropDown dropDown={dropDown} setDropDown={setDropDown} />
        <h2>{title}</h2>
    </div>
  )
}
