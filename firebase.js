import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Assuming you're using Firebase Storage
import { getAuth, onAuthStateChanged} from "firebase/auth";
import {useEffect, useState} from 'react'
import firebaseConfig from './env'


// Initialize Firebase
export const app = initializeApp(firebaseConfig);


//auth and firestore references
export const auth = getAuth(app);
export const db=getFirestore(app);
export const storage= getStorage(app);

//custom react hook. useAuth sets the variable currentUser every time the auth state changes so that it's always updated
export function useAuth() {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Set loading to false once user is determined
    });
    return unsubscribe; // Clean up subscription
  }, []);

  return { currentUser, loading }; // Returns loading state along with currentUser
}