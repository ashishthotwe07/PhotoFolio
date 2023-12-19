// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCw0t-FmSrPh8c5H7PAEZo1duXjhvr4OVA",
  authDomain: "photofolio-438d9.firebaseapp.com",
  projectId: "photofolio-438d9",
  storageBucket: "photofolio-438d9.appspot.com",
  messagingSenderId: "185270524007",
  appId: "1:185270524007:web:cc43f35c8ef2a375e25cc2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);