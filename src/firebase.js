import { initializeApp } from "firebase/app"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9Kk56yezyU4OWioPP02dDIsA6kMii_0M",
  authDomain: "real-estate-b37fb.firebaseapp.com",
  projectId: "real-estate-b37fb",
  storageBucket: "real-estate-b37fb.appspot.com",
  messagingSenderId: "247211908642",
  appId: "1:247211908642:web:e1d3745b38272d632b747b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);