import { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const CreateListing = () => {
    const[files, setFiles] = useState([]);
    const[formData, setFormData] = useState({
        imageURLs: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        parking: false,
        furnished: false,
        offer: false,
        bedRooms: 1,
        bathRooms: 1,
        regularPrice: 50,
        discountPrice: 0,

    });
    const[imageUplaodError, setImageUploadError] = useState(false);
    const[uploading, setUploading] = useState(false);
    const[loading, setLoading] = useState(false);
    const[submitError, setSubmitError] = useState(false);
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();

    const handleImageUpload=()=>{
        if(files.length > 0 && files.length + formData.imageURLs.length < 7){
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for(let i = 0; i<files.length; i++){
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls)=>{
                setFormData({...formData, imageURLs: formData.imageURLs.concat(urls )
                })
                setImageUploadError(false);
                setUploading(false);
            }).catch((err)=>{
                setImageUploadError('Image uload failed (2 MB max per image)');
                setUploading(false);
            })
        }else{
            setImageUploadError('You can only upload 6 images per listing');
            setUploading(false);
        }
    }

    const storeImage=async(file)=>{
        return new Promise((resolve, reject)=>{
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot)=>{
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Progress is ${progress} %`)
                },
                (error)=>{
                    reject(error);
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((dowloadURL)=>{
                        resolve(dowloadURL);
                    })
                }
            )
        })
    }

    const handleDeleteImage=(index)=>{
        setFormData({...formData, imageURLs: formData.imageURLs.filter((_, i)=> i !== index)})
    }

    const handleChanges=(e)=>{
        if(e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({...formData, type: e.target.id})
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setFormData({...formData, [e.target.id]: e.target.checked})
        }
        if(e.target.type === 'number' || e.target.type === 'textarea' || e.target.type === 'text'){
            setFormData({...formData, [e.target.id]: e.target.value});
        }
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            if(formData.imageURLs.length < 1){
                setSubmitError("You must upload atleast one image");
                return;
            }
            if(formData.regularPrice < formData.discountPrice){
                setSubmitError('Discount price must lower than regular price');
            }
            setLoading(true);
            setSubmitError(false);
            const token = Cookies.get('access_token');

            if(formData.imageURLs.length < 1){
                setSubmitError("You must upload atleast one image");
                return;
            }
            if(formData.regularPrice < formData.discountPrice){
                setSubmitError('Discount price must lower than regular price');
            }    
            const result = await axios.post(`http://localhost:5000/api/listing/create`,{
                ...formData, 
                userRef: currentUser._id,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true
                }
            )
            if(result.data.success === false){
                setSubmitError(result.data.message);
                setLoading(false);
                return;
            }
            // navigate(`/create-listing/${result.data._id}`);
            navigate(`/`);
        } catch (error) {
            setSubmitError(error);
            setLoading(false);
            console.log(error)
        }  
    }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
      <form className='flex flex-col sm:flex-row gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 flex-1'>
            <input type="text" placeholder='Name' id='name' 
            className='border rounded-lg p-3' maxLength='62' minLength='10' required
            onChange={handleChanges} defaultValue={formData.name}/>
            <textarea type="text" placeholder='Description' id='description' 
            className='border rounded-lg p-3' required
            onChange={handleChanges} defaultValue={formData.description}/>
            <input type="text" placeholder='Address' id='address' 
            className='border rounded-lg p-3' maxLength='62' minLength='10' required
            onChange={handleChanges} defaultValue={formData.address}/>
            <div className='flex gap-6 flex-wrap'>
                <div className="flex gap-2">
                    <input type="checkbox" id='sale' className='w-5' 
                        onChange={handleChanges} 
                        checked={formData.type === 'sale'}/>
                    <span>Sale</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='rent' className='w-5' 
                        onChange={handleChanges} 
                        checked={formData.type === 'rent'}/>
                    <span>Rent</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='parking' className='w-5'
                        onChange={handleChanges} 
                        checked={formData.parking}/>
                    <span>Parking spot</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='furnished' className='w-5'
                        onChange={handleChanges} 
                        checked={formData.furnished}/>
                    <span>Furnished</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='offer' className='w-5'
                        onChange={handleChanges} 
                        checked={formData.offer}/>
                    <span>Offer</span>
                </div>
            </div>
            <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                    <input type="number" id='bedrooms' className='border border-grey-300 p-3 rounded-lg w-14' min='1' max='10'
                    onChange={handleChanges} defaultValue={formData.bedRooms}/>
                    <p>Beds</p>
                </div>
                <div className="flex items-center gap-2">
                    <input type="number" id='bedrooms' className='border border-grey-300 p-3 rounded-lg w-14' min='1' max='10'
                    onChange={handleChanges} defaultValue={formData.bathRooms}/>
                    <p>Baths</p>
                </div>
                <div className="flex items-center gap-2">
                    <input type="number" id='regularPrice' className='border border-grey-300 p-3 rounded-lg w-17' min='50' max='1000000'
                    onChange={handleChanges} defaultValue={formData.regularPrice}/>
                    <div className="flex flex-col items-center">
                        <p>Regular price</p>
                        <span className='text-xs'>($ / month)</span>
                    </div>
                </div>
                {formData.offer && (
                <div className="flex items-center gap-2">
                    <input type="number" id='discountPrice' className='border border-grey-300 p-3 rounded-lg w-17' min='0' max='1000000'
                    onChange={handleChanges} defaultValue={formData.discountPrice}/>
                    <div className="flex flex-col items-center">
                        <p>Discounted price</p>
                        <span className='text-xs'>($ / month)</span>
                    </div>
                </div>
                )}
                
            </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Images:
                <span className='font-normal ml-2 text-gray-700'>The first image will be the cover (max 6)</span>
            </p>
            <div className="flex gap-4">
                <input onChange={(e)=>{
                    setFiles(e.target.files)
                }} type="file" id='images' accept='image/*' multiple className='border border-gray-300 p-3 w-full'/>
                <button className='text-green-700 border border-green-700 
                p-3 rounded uppercase hover:shadow-lg disabled:opacity-90' type="button" onClick={handleImageUpload}>
                    {uploading ? "Uploading....." : "Upload"}
                </button>
            </div>
            <p className='text-red-700 text-sm'>{imageUplaodError && imageUplaodError}</p>
            {
                formData.imageURLs.length > 0 && formData.imageURLs.map((url, index)=>(
                    <div key={index} className="flex justify-between p-3 border items-center">
                        <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg'/>
                        <button type='button' onClick={()=>handleDeleteImage(index)} className='text-red-700 uppercase text-sm p-3 hover:opacity-75'>Delete</button>
                    </div>
                ))
            }
            <button className='p-3 bg-slate-700 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80'>
                {loading ? 'Loading......' : 'Create Listing'}
            </button>
            {submitError && <p className='text-red-700 text-sm'>{submitError.message}</p>}
        </div>
      </form>
    </main>
  )
}

export default CreateListing;
