import { NextPage } from "next";
import {initFirebase} from "../../firebase";
import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";
import {useRouter} from "next/router"
import Link from 'next/link';
import { useEffect } from 'react';
import{auth} from "../../firebase"
import './index.css';



const Home = () =>{

const provider= new GoogleAuthProvider();
const router=useRouter();
const[user, loading]=useAuthState(auth); //gets the user state, loading to know to wait for it to load or not

const signInWithGoogle= async () =>{ //calls the popup function with the client and provider given
  try{
  const result = await signInWithPopup(auth, provider)
  console.log(result.user);
  if (loading){
    return (
  <div>Loading...</div>
   );
  }
  if (user) {
    router.push("/profile/view");
  }
} catch (error) {
  // Handling errors (backend)
  console.error("Error signing in with Google: ", error);
}
}

return (
  <div>
    <div className="text-wrapper">Welcome to</div>
    <div className="text-wrapper">GROUPIE</div>
    <div className="signin-container">
      <button className='signin-button' onClick={signInWithGoogle}>
        <div>Sign In With Google</div>
      </button>
      <button className='signin-button' onClick={() => router.push("/login/signInWithEmail")}>
        <div>Sign In With Email</div>
      </button>
      <div>
        Don't have an account?
      <button className="signup-button" onClick={() => router.push('/login/signUpWithEmail')}>Sign Up!</button> {/* Add navigation to the Sign Up page */}
      </div>
    </div>
  </div>
);
}

export default Home;
