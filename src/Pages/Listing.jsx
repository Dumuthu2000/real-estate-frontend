import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from "swiper";
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { useSelector } from "react-redux";
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
  } from 'react-icons/fa';
import Contact from "../components/Contact";

const Listing = () => {
    SwiperCore.use({Navigation});
    const[listing, setListing] = useState(null);
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState(false);
    const[copied, setCopied] = useState(false);
    const[contact, setContact] = useState(false);

    const { listingID } = useParams();
    const { currentUser } = useSelector(state=> state.user);

    useEffect(()=>{
        const fetchListing=async(listingID)=>{          
            try {
                setLoading(true);
                const result = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/listing/get-listing/${listingID}`);

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
                <div className="fixed top-[13%] right-[3%] z-10 rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
                    <FaShare
                        className='text-slate-500'
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                            setTimeout(() => {
                              setCopied(false);
                            }, 2000);
                          }}
                    />
                </div>
                {copied && (
                    <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2 text-green-700">Link copied!</p>
                )}
                <div className='flex flex-col max-w-7xl mx-auto p-3 my-7 gap-4'>
                    <p className='text-2xl font-semibold'>
                        {listing.name} - ${' '}
                        {listing.offer
                            ? listing.discountPrice.toLocaleString('en-US')
                            : listing.regularPrice.toLocaleString('en-US')}
                        {listing.type === 'rent' && ' / month'}
                    </p>
                    <p className="flex item-center mt-6 gap-2 text-slate-600 my-2 text-sm">
                        <FaMapMarkerAlt className="text-green-700"/>
                        {listing.address}
                    </p>
                    <div className="flex gap-4">
                        <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                        </p>
                        {listing.offer && (
                            <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md"
                            >$ {+listing.regularPrice - +listing.discountPrice} OFF /-</p>
                        )}
                    </div>
                    <p className="text-justify text-slate-800 text-[15px]">
                        <span className="font-semibold text-black text-[17px]">Description - </span>{listing.description}
                    </p>
                    <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaBed className='text-lg' />
                            {listing.bedRooms > 1
                            ? `${listing.bedRooms} beds `
                            : `${listing.bedRooms} bed `}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaBath className='text-lg' />
                            {listing.bathRooms > 1
                            ? `${listing.bathRooms} baths `
                            : `${listing.bathRooms} bath `}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaParking className='text-lg' />
                            {listing.parking ? 'Parking spot' : 'No Parking'}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaChair className='text-lg' />
                            {listing.furnished ? 'Furnished' : 'Unfurnished'}
                        </li>
                    </ul>
                    {currentUser && currentUser._id !== listing.userRef && !contact &&(
                        <button 
                            className="bg-slate-800 uppercase text-white p-3 rounded-lg hover:opacity-95"
                            onClick={()=>{setContact(true)}}>Contact lanlord</button>
                    )}
                    {contact && <Contact listing={listing}/>}
                </div>
            </div>
        }
    </main>
  )
}

export default Listing
