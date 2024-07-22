import { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";

const CreateListing = () => {
    const[files, setFiles] = useState([]);
    const[formData, setFormData] = useState({
        imageURLs: [],
    });
    const[imageUplaodError, setImageUploadError] = useState(false);
    const[uploading, setUploading] = useState(false);
    console.log(formData)

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
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
            <input type="text" placeholder='Name' id='name' 
            className='border rounded-lg p-3' maxLength='62' minLength='10' required/>
            <textarea type="text" placeholder='Description' id='description' 
            className='border rounded-lg p-3' required/>
            <input type="text" placeholder='Address' id='address' 
            className='border rounded-lg p-3' maxLength='62' minLength='10' required/>
            <div className='flex gap-6 flex-wrap'>
                <div className="flex gap-2">
                    <input type="checkbox" id='sale' className='w-5'/>
                    <span>Sale</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='rent' className='w-5'/>
                    <span>Rent</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='parking' className='w-5'/>
                    <span>Parking spot</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='furnished' className='w-5'/>
                    <span>Furnished</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='offer' className='w-5'/>
                    <span>Offer</span>
                </div>
            </div>
            <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                    <input type="number" id='bedrooms' className='border border-grey-300 p-3 rounded-lg w-14' min='1' max='10'/>
                    <p>Beds</p>
                </div>
                <div className="flex items-center gap-2">
                    <input type="number" id='bedrooms' className='border border-grey-300 p-3 rounded-lg w-14' min='1' max='10'/>
                    <p>Baths</p>
                </div>
                <div className="flex items-center gap-2">
                    <input type="number" id='regularPrice' className='border border-grey-300 p-3 rounded-lg w-14' min='1' max='10'/>
                    <div className="flex flex-col items-center">
                        <p>Regular price</p>
                        <span className='text-xs'>($ / month)</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <input type="number" id='discountPrice' className='border border-grey-300 p-3 rounded-lg w-14' min='1' max='10'/>
                    <div className="flex flex-col items-center">
                        <p>Discounted price</p>
                        <span className='text-xs'>($ / month)</span>
                    </div>
                </div>
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
            <button className='p-3 bg-slate-700 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80'>Create listing</button>
        </div>
      </form>
    </main>
  )
}

export default CreateListing;
