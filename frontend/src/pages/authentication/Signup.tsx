import { HeroRecording } from '@/components/HeroRecording';
import React, { useState, useEffect } from 'react';
// import { useAuth } from '@/context/AuthProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Signup = () => {
  // const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [fetching, setFetching] = useState(false);
  const [fetchStatus, setFetchStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
    if (!username && username.length < 3) {
      setUsernameError('Username must be at least 3 characters long');
      } else {
        setUsernameError('');
        }
    if (password && password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }

    if (confirmPassword && confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  }, [email, password, confirmPassword]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      if (!email) {
        setEmailError('Email field is required');
      }
      if (!password) {
        setPasswordError('Password field is required');
      }
      if (!confirmPassword) {
        setConfirmPasswordError('Confirm Password field is required');
      }
      return;
    }
    // API call to register user

    await handleRegister(username, email, password);
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      setFetching(true)
      const response = await axios.post('http://localhost:8000/register', {
        username,
        email,
        password
      });
      setFetching(false)
      if (response.status === 200) {
        setFetchStatus("sign up successful")
        navigate('/login');
      } else {
        setFetchStatus(response.statusText)
      }
    } catch (error) {
      
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 h-screen">
      <div className='flex justify-center items-center w-full bg-gray-300 rounded shadow-md'>
        <div className="text-blue-900 w-full p-5 lg:p-0 lg:w-1/2 flex flex-col gap-10">
          <div>
            <h1 className="text-2xl font-bold text-center md:text-4xl">Join Us!</h1>
            <h2 className="text-xl font-semibold text-center md:text-2xl">Signup</h2>
            {
              fetchStatus ? <p className='text-center mt-10'>{fetchStatus}</p> : <p></p>
            }
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-3 py-2 border-2 rounded ${emailError ? 'border-red-600' : 'border-green-700'}`}
                required
              />
              {usernameError && <p className="text-red-500 text-right">{usernameError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border-2 rounded ${emailError ? 'border-red-600' : 'border-green-700'}`}
                required
              />
              {emailError && <p className="text-red-500 text-right">{emailError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 border-2 rounded ${passwordError ? 'border-red-600' : 'border-green-700'}`}
                required
              />
              {passwordError && <p className="text-red-500 text-right text-sm">{passwordError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 border-2 rounded ${confirmPasswordError ? 'border-red-600' : 'border-green-700'}`}
                required
              />
              {confirmPasswordError && <p className="text-red-500 text-right text-sm">{confirmPasswordError}</p>}
            </div>
            <div className='flex justify-between w-full'>
              <p className='text-slate-400'>Already have an account?</p>
              <p><a href="/login">Login</a></p>
            </div>
            <button 
              type="submit" 
              className="flex justify-center items-center w-full py-3 bg-gradient-to-r from-[#691476] to-[#100e53] text-white rounded-full hover:bg-blue-900">
              {fetching ? <div className='loader'></div> : "Signup"}
            </button>
          </form>
        </div>
      </div>
      <div className='login-bg bg-primary hidden md:flex justify-center items-center flex-col text-white gap-5'>
        <h1 className='text-4xl w-[300px] text-center'>Organize Smarter, Not Harder</h1>
        <div>
          <HeroRecording/>
        </div>
        <div className='features flex gap-5 text-xl justify-center items-center animate-text'>
          <p>Think</p>
          <i className="fa-solid fa-right-long text-purple-300"></i>
          <p>Write</p>
          <i className="fa-solid fa-right-long text-purple-300"></i>
          <p>Understand</p>
        </div>
      </div>
    </div>
  );
};