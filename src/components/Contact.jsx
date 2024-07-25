import axios from "axios";
import { useEffect, useState } from "react";
import Cookie from 'js-cookie';
import { Link } from "react-router-dom";

const Contact = ({listing}) => {
    const[landlord, setLandlord] = useState(null);
    const[message, setMessage] = useState('');

    useEffect(()=>{
        const fetchLandlord=async()=>{
            try {
                const token = Cookie.get('access_token');
                const result = await axios.get(`http://localhost:5000/api/user/${listing.userRef}`,{
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true
                });
                if(result.data.success === false){
                    return console.log(result.data);
                }

                setLandlord(result.data);
            } catch (error) {
                console.log(error.message);
            }
        }

        fetchLandlord();
    }, [listing.userRef]);

    const handleOnchange=async(e)=>{
        setMessage(e.target.value)
    }
  return (
    <div className="flex flex-col gap-3">
      {landlord && (
        <p>Contact <span className="font-semibold">{landlord.username}</span> for <span className="font-semibold">{listing.name}</span></p>
      )}
      <textarea name="message" 
        id="message" role="2" 
        placeholder="Enter your message here....."
        defaultValue={message} onChange={handleOnchange}
        className="w-full rounded-lg border p-3">
      </textarea>
    {landlord && landlord.email && (
        <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
        className="bg-slate-700 text-white text-center p-3 rounded-lg hover:opacity-95">
          Send Message
        </Link>
    )}
    </div>
  )
}

export default Contact
