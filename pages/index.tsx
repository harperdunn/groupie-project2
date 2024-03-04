import type { NextPage } from "next";
import {initFirebase} from "../firebase";
import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";
import {useRouter} from "next/router"
import {Link} from "next/link"
import { useEffect } from 'react';
import{auth} from "../firebase"



const Home: NextPage = () =>{

const provider= new GoogleAuthProvider();
const router=useRouter();
const[user, loading]=useAuthState(auth); //gets the user state, loading to know to wait for it to load or not


const signIn= async () =>{ //calls the popup function with the client and provider given
  const result = await signInWithPopup(auth, provider)
  console.log(result.user);
  if (loading){
    return (
  <div>Loading...</div>
   );
  }
  if (user) {
    router.push("/loggedin");
  }
}

return (
  <div className="text-center flex flex-col gap-4 items-center">
    <div>Please sign in to continue</div>
    <button onClick={signIn}>
      <div className="bg-blue-600 text-white rounded-md p-2 w-48">
        Sign In
      </div>
    </button>
  </div>
);
}

export default Home;
