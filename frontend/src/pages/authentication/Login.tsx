import { HeroRecording } from '@/components/HeroRecording';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthBtn } from '@/components/AuthBtn';
import { useAuth } from '@/context/AuthProvider';
export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fetching, setFetching] = useState(false)
  const { isAuthenticated, setIsAuthenticated, setAccessToken } = useAuth()
  
  // const generateKey = async () => {
  //   return await crypto.subtle.generateKey(
  //     {name: "AES-GCM", length:256}, true, ["encrypt", "decrypt"]
  //   )
  // }
  // const encryptToken = async () => {
  //   const encoder = new TextEncoder();
  //   const data = encoder.encode(accessToken);

  //   const iv = crypto.getRandomValues(new Uint8Array(12))
  //   const key = await generateKey()

  //   const encryptedData = await crypto.subtle.encrypt(
  //     {name: "AES-GCM", iv: iv},
  //     key,
  //     data
  //   );
  //   return {iv, encryptedData}
  // }

  useEffect(() => {
    // if (email && !/\S+@\S+\.\S+/.test(email)) {
    //   setEmailError('Invalid email address');
    // } else {
    //   setEmailError('');
    // }

    if (password && password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      if (!email) {
        setEmailError('Email fields is required');
      }
      else if (!password) {
        setPasswordError('Password fields is required');
      }
    }
    await handleLogin(email, password);
    setPassword("");
    setEmail("");
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setFetching(true)
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
  
      const response = await axios.post('http://localhost:8000/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
  
      if (response.status === 200) {
        console.log(response)
        localStorage.setItem('token', response.data.access_token);
        setAccessToken(response.data.access_token)
        // encryptToken()
        setIsAuthenticated(true)
        console.log("login",isAuthenticated)
        navigate('/dashboard'); // Navigate to the dashboard or another page
      } else {
        console.error('Login failed:', response.statusText);
      }
      setFetching(false)
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 h-screen">
      <div className='flex justify-center items-center w-full bg-gray-300  rounded shadow-md'>
      <div className="text-blue-900 w-full p-5 lg:p-0 lg:w-1/2 flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold text-center md:text-4xl">Welcome Back!</h1>
        <h2 className="text-xl font-semibold text-center md:text-2xl">Login</h2>
        
      </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
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
          <div className='flex justify-between w-full'>
            <p className='text-slate-400'>Don't have an account?</p>
            <p> <a href="/signup">Sign up</a></p>
          </div>
        <AuthBtn fetching={fetching} text={"Login"}/>
        <div className='flex justify-center items-center'>
            <p><a href='/password-reset'>Forgot Password?</a></p>
        </div>
        </form>
      </div>
      </div>
      <div className='login-bg bg-primary hidden md:flex justify-center items-center flex-col text-white gap-5'>
        <h1 className='text-4xl w-[400px] text-center'>Your AI Assistant for Effortless Note-Taking</h1>
        <p className='w-[500px] text-slate-400 text-center'>From capturing ideas to finding clarity—Cerenote does the heavy lifting so you can focus on what matters.</p>
        <div>
          <HeroRecording/>
        </div>
        <div className='features flex gap-5 text-xl justify-center items-center'>
          <p>Think</p>
          <i className="fa-solid fa-right-long text-purple-300"></i>
          <p>Write</p>
          <i className="fa-solid fa-right-long text-purple-300"></i>
          <p>understand</p>
        </div>

      </div>
    </div>
  );
};