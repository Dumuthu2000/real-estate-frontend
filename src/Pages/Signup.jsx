import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input type="text" placeholder='username'
        className='border rounded-lg p-3 outline-none' id='username'/>
        <input type="text" placeholder='email'
        className='border rounded-lg p-3 outline-none' id='email'/>
        <input type="text" placeholder='password'
        className='border rounded-lg p-3 outline-none' id='password'/>
        <button 
        className='bg-slate-700 p-3 rounded-lg text-white uppercase
        hover:opacity-95 disabled:opacity-80'>Sign Up</button>
        <button 
        className='bg-red-700 p-3 rounded-lg text-white uppercase
        hover:opacity-95 disabled:opacity-80'>Continue with Google</button>
      </form>
      <div className='flex gap-2 mt-3'>
        <p>Have an account?</p>
        <Link to={`/sign-in`}>
        <span className='text-blue-800'>Sign In</span></Link>
      </div>
    </div>
  )
}

export default Signup
