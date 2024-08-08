import {FaSearch} from 'react-icons/fa'
import {Link, useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector(state => state.user);
  const[searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchTerm=async(e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search])
  return (
    <header className='bg-slate-200 shadow-md '>
        <div className='flex justify-between items-center max-w-7xl mx-auto p-3'>
          <Link to='/'>
            <h1  className='font-bold text-sm sm:text-2xl flex flex-wrap'>
                <span className='text-slate-500'>Ceylon</span>
                <span className='text-slate-700'>Estate</span>
            </h1>
          </Link>
          <form onSubmit={handleSearchTerm} className='bg-slate-100 p-3 rounded-lg flex items-center'>
            <input
             type="text" 
             placeholder='Search Here?' 
             className='bg-transparent outline-none w-24 sm:w-64'
             onChange={(e)=>{
              setSearchTerm(e.target.value);
             }}
            />
            <button>
              <FaSearch className='text-slate-600'/>
            </button>
          </form>
          <ul className='flex gap-4'>
            <Link to='/'>
              <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
            </Link>
            <Link to='/about'>
              <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
            </Link>
            <Link to='/profile'>
            {currentUser ?(
              <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar}/>
            ):(
              <li className='sm:inline text-slate-700 hover:underline font-bold'>Sign In</li>
            )}
            </Link>
          </ul>
        </div>
    </header>
  )
}

