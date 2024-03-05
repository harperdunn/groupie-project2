// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Assuming you're using Firebase Storage
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSDO3xcLU-_cQ4jGPR3bh7pUrkmaJQWxA",
  authDomain: "groupie-fire.firebaseapp.com",
  projectId: "groupie-fire",
  storageBucket: "groupie-fire.appspot.com",
  messagingSenderId: "683212724430",
  appId: "1:683212724430:web:2b28db074afd44c032989f",
  measurementId: "G-Z5ETPW62V9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

//auth and firestore references
export const auth = getAuth(app);
export const db=getFirestore(app);
export const storage= getStorage(app);