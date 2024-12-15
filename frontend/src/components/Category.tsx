import React from 'react';


interface CategoryProps {
  title: string;
  count: number;
}

export const Category: React.FC<CategoryProps> = ({ title, count }) => {

  return (
      <div className='ml-2 flex gap-2 cursor-pointer justify-between pt-2'>
        <div>
            <h1>{title}</h1>
        </div>
        <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center bg-gray-400'>{count}</div>
    </div>
  )
}
