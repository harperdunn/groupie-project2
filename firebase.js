// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Assuming you're using Firebase Storage
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, onAuthStateChanged} from "firebase/auth";
import {useEffect, useState} from 'react'


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

//custom react hook. useAuth sets the variable currentUser every time the auth state changes so that it's always updated
export function useAuth() {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Set loading to false once user is determined
    });
    return unsubscribe; // Clean up subscription
  }, []);

  return { currentUser, loading }; // Return loading state along with currentUser
}