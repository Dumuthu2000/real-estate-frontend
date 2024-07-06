import { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFaliure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

const Signin = () => {
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  // const[error, setError] = useState(null);
  // const[loading, setLoading] = useState(false);
  const{loading, error} = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignIn=async(e)=>{
    e.preventDefault();
    // setLoading(true);
    dispatch(signInStart());
    const formData = {email, password}
    await axios.post(`http://localhost:5000/api/auth/signin`,formData, {withCredentials: true})
    .then((res)=>{
      if(res.data.success === false){
        // setLoading(false);
        // setError(data.message);
        dispatch(signInFaliure(data.message));
        return;
      }
      // setLoading(false);
      dispatch(signInSuccess(res.data));
      console.log(res);
      navigate('/');
    }).catch((err)=>{
      // setLoading(false);
      // setError(err.message);
      dispatch(signInFaliure(err.message));
    })
  }
 
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4'>
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
        hover:opacity-95 disabled:opacity-80' onClick={handleSignIn}>
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth/>
        
      </form>
      <div className='flex gap-2 mt-3'>
        <p>Do not have an account?</p>
        <Link to={`/sign-up`}>
        <span className='text-blue-800'>Sign Up</span></Link>
      </div>
      {error &&
        <p className='text-red-500 mt-5'>{error}</p>
      }
    </div>
  )
}

export default Signin
