import { DropDown } from './DropDown';
import { DirCategory } from './DirCategory';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthProvider';

interface FolderProps {
    title: string
    shared: boolean
} 

interface CategoryProps {
  id: number
  name: string
} 

export const Folders = ({title, shared} : FolderProps) => {
    const [dropDown, setDropDown] = useState(true)
    const [createNew, setCreateNew] = useState(false)
    const [value, setValue] = useState('')
    const { setAccessToken } = useAuth()
    const [categories, setCategories] = useState([])
    const accessToken = localStorage.getItem('token')
    const url = shared ? 'http://localhost:8000/categories/shared/':"http://localhost:8000/categories/"
  

    const handleCreateFolder = () => {
        setCreateNew(true)
    }

    const handlefetch = async () => {
      
      try {
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (response.status === 200) {
          setCategories(response.data.data)
        
        } else {
          console.error('Login failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error logging in:', error);
      }
    }

    useEffect(() => {
      if (accessToken) {
        setAccessToken(accessToken)
        handlefetch()
      }
      // console.log(categories)
    }, [categories])
    
    
    const handleCreateNew = async () => {
      try {
        // setFetching(true)
        console.log("fetching")
        const data = {
          name: value
        }
    
        const response = await axios.post('http://localhost:8000/category/create', data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setValue("")
    
        if (response.status === 200) {
          console.log(response)
          // localStorage.setItem('token', response.data.access_token);
          console.log("category created")
          setCreateNew(false)
        } else {
          console.error('Login failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error logging in:', error);
      }
    };

  return (
    <div className='border-b-2  mt-2 pt-4 pb-4 border-gray-600'>
      <div className="flex justify-between ">
        <div className='flex gap-2 cursor-pointer mb-2'>
            <DropDown dropDown={dropDown} setDropDown={setDropDown} />
            <h2>{title}</h2>
        </div>
          <i className="fa-regular fa-plus cursor-pointer" onClick={handleCreateFolder}></i>
      </div>
      {dropDown ? 
      <div className='flex flex-col gap-2'>
        {
          categories.map((category: CategoryProps) => (
            <DirCategory title={category.name} key={category.id} />
            ))
        }
      </div> : null}

      {createNew ? 
        <div className='bg-slate-500 w-full h-full top-0 left-0  right-0 bg-opacity-30 absolute flex justify-center items-center'>
          <div className='flex gap-5 justify-center items-center flex-col bg-white md:w-[500px] md:h-[300px] rounded-2xl text-blue-950 p-7'>
            <h1 className='text-3xl'>Create New</h1>
            <input
            className='border-2 border-blue-950 w-full p-2 rounded-2xl'
            type='text'
            value={value}
            onChange={(e) => {setValue(e.target.value)}}
            />
            <button className='bg-blue-950 p-2 rounded-2xl w-1/2 text-white' onClick={handleCreateNew}>Create</button>
          </div>
        </div> : null}
  </div>
  )
}
