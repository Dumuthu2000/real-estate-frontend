import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from "swiper";
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

const Listing = () => {
    SwiperCore.use({Navigation});
    const[listing, setListing] = useState(null);
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState(false);
    const { listingID } = useParams();

    useEffect(()=>{
        const fetchListing=async(listingID)=>{          
            try {
                setLoading(true);
                const result = await axios.get(`http://localhost:5000/api/listing/get-listing/${listingID}`);

                if(result.data.success === false){
                    setError(true);
                    setLoading(false);
                    return;
                }

                setListing(result.data);
                console.log(result.data)
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
                console.log("asdaddadd")
            }
        }

        fetchListing(listingID);
    }, [listingID])
  return (
    <main>
        {loading &&
            <p className="text-2xl text-center my-7 text-slate-700">Loading.....</p>
        }
        {error &&
            <p className="text-2xl text-center my-7 text-red-700">Something went wrong!!!!!</p>
        }
        {listing && !loading && !error &&
            <div className="">
                <Swiper navigation>
                    {listing.imageURLs.map((url)=>(
                        <SwiperSlide key={url}>
                            <div className="h-[550px]" style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        }
    </main>
  )
}

export default Listing
