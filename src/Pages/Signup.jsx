import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import OAuth from '../components/OAuth';

const Signup = () => {
  const[username, setUsername] = useState('');
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[error, setError] = useState(null);
  const[loading, setLoading] = useState(false);

  const handleSignUp=async(e)=>{
    e.preventDefault();
    setLoading(true)
    const formData = {username, email, password}
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, formData, {withCredentials: true})
    .then((res)=>{
      if(res.data.success === false){
        setLoading(false);
        setError(res.data.message);
        return;
      }
      setLoading(false)
      alert('user added successfully')
    }).catch((error)=>{
      setLoading(false)
      setError(error.message)
    })
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input type="text" placeholder='username'
        className='border rounded-lg p-3 outline-none' id='username' onChange={(e)=>{
          setUsername(e.target.value)
        }}/>
        <input type="text" placeholder='email'
        className='border rounded-lg p-3 outline-none' id='email' onChange={(e)=>{
          setEmail(e.target.value)
        }}/>
        <input type="text" placeholder='password'
        className='border rounded-lg p-3 outline-none' id='password' onChange={(e)=>{
          setPassword(e.target.value)
        }}/>
        <button disabled={loading}
        className='bg-slate-700 p-3 rounded-lg text-white uppercase
        hover:opacity-95 disabled:opacity-80' onClick={handleSignUp}>
          {loading ? "Loading..." : "Sign Up"}</button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-3'>
        <p>Have an account?</p>
        <Link to={`/sign-in`}>
        <span className='text-blue-800'>Sign In</span></Link>
      </div>
      {error &&
        <p className='text-red-500 mt-5'>{error}</p>
      }
    </div>
  )
}

export default Signup
