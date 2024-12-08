
import { useAuth } from '../context/AuthProvider';

export const Nav = () => {
  const { isAuthenticated} = useAuth();

const logout = () => {
    window.location.href = '/login'
}
  return (
    <div className='bg-transparent flex justify-between text-white text-base p-7 items-center'>
      <h1 className='text-2xl md:text-3xl lg:text-5xl'>CERENOT</h1>
      <ul className='hidden md:flex gap-10'>
        <li className='cursor-pointer hover:border-b-2 hover:border-white'>Home</li>
        <li className='cursor-pointer hover:border-b-2 hover:border-white'>Features</li>
        <li className='cursor-pointer hover:border-b-2 hover:border-white'>About</li>
      </ul>
      <div>
        {isAuthenticated ? (
          <div className='flex gap-10'>
            <button onClick={logout} className='button-primary px-4 py-1 md:px-6 md:py-2 text-sm md:text-base'>DashBoard</button>
            <button onClick={logout} className='button-primary px-4 py-1 md:px-6 md:py-2 text-sm md:text-base'>Logout</button>
          </div>
        ) : (
          <div className='flex gap-5  md:gap-10'>
            <button className='button-primary px-4 py-1 md:px-6 md:py-2 text-sm md:text-base'><a href="/login">Login</a></button>
            <button className='button-primary  px-4 py-1 md:px-6 md:py-2 text-sm md:text-base'><a href="/signup">Sign up</a></button>
          </div>
        )}
      </div>
    </div>
  );
};