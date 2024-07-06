import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";

const Profile = () => {
  const[file, setFile] = useState(undefined);
  const[uploadPercentage, setUploadPercentage] = useState(0);
  const[fileUploadError, setFileUploadError] = useState(false);
  const[formData, setFormData] = useState({});
  const{ currentUser } = useSelector(state => state.user);
  const fileRef = useRef(null);

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file]);

  const handleFileUpload=(file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_change',
      (snapshot)=>{
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadPercentage(Math.round(progress));
      },
      (error)=>{
        setFileUploadError(true);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL)=>{
          setFormData((prev) => ({ ...prev, avatar: downloadURL }));
        })
      })
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
         onChange={(e)=>{
          setFile(e.target.files[0]);
         }}
         type="file" ref={fileRef} hidden accept="image/.*"/>
        <img src={formData.avatar || currentUser.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover cursor-pointer self-center mt-2"
        onClick={()=>{
          fileRef.current.click()
        }}/>
        <p className="text-center">
          {
            fileUploadError ? 
            <span className="text-red-700">Error image upload (Image must be less than 2MB)</span> :
            uploadPercentage > 0 && uploadPercentage < 100 ?
            <span className="text-slate-700">{`Uploading ${uploadPercentage}%`}</span> :
            uploadPercentage === 100 ?
            <span className="text-green-700">Image uploaded successfully</span> : null
          }
        </p>
        <input type="text" placeholder="username" id="username"
        className="border p-3 rounded-lg"/>
        <input type="text" placeholder="email" id="email"
        className="border p-3 rounded-lg"/>
        <input type="text" placeholder="password" id="password"
        className="border p-3 rounded-lg"/>
        <button className="bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-95">Update</button>
        <button className="bg-green-700 p-3 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-95">create a listing</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  )
}

export default Profile
