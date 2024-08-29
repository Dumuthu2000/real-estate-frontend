import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleAuth=async()=>{
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      console.log(result)
      const formData = {
        name:result.user.displayName,
        email:result.user.email,
        profileImage:result.user.photoURL,
      }
      const data = await axios.post(`http://localhost:5000/api/auth/google`, formData)
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log('Could not sign in with google', error.message)
    }
  }
  return (
    <button
      type='button' 
      className='bg-red-700 p-3 rounded-lg text-white uppercase
      hover:opacity-95 disabled:opacity-80'
      onClick={handleGoogleAuth}
      >Continue with Google</button>
  )
}

export default OAuth
