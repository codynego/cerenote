
import { useAuth } from '../context/AuthProvider';

export const Nav = () => {
  const { isAuthenticated} = useAuth();
const login = () => {
    window.location.href = '/login'
}
const logout = () => {
    window.location.href = '/login'
}
  return (
    <div className='bg-transparent flex justify-between text-white text-base p-7 items-center'>
      <h1 className='text-2xl md:text-3xl lg:text-5xl'>CERENOT</h1>
      <ul className='hidden md:flex gap-10'>
        <li>Home</li>
        <li>Features</li>
        <li>About</li>
      </ul>
      <div>
        {isAuthenticated ? (
          <div className='flex gap-10'>
            <button onClick={logout} className='button-primary px-4 py-1 md:px-6 md:py-2 text-sm md:text-base'>DashBoard</button>
            <button onClick={logout} className='button-primary px-4 py-1 md:px-6 md:py-2 text-sm md:text-base'>Logout</button>
          </div>
        ) : (
          <div className='flex gap-5  md:gap-10'>
            <button onClick={login} className='button-primary px-4 py-1 md:px-6 md:py-2 text-sm md:text-base'>Login</button>
            <button onClick={login} className='button-primary  px-4 py-1 md:px-6 md:py-2 text-sm md:text-base'>SignUp</button>
          </div>
        )}
      </div>
    </div>
  );
};