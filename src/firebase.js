// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ceylon-estate.firebaseapp.com",
  projectId: "ceylon-estate",
  storageBucket: "ceylon-estate.appspot.com",
  messagingSenderId: "744928853410",
  appId: "1:744928853410:web:afb42fd052c3d452fe86fb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);