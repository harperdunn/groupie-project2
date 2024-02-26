import type { NextPage } from 'next';
import {auth} from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from 'react';
import { useRouter } from "next/router";



const Loggedin: NextPage = () => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

    if (!user) {
      router.push("/");
    }


  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
  };

  return (
      <div className="text-left mb-6 text-sm bg-sky-100 p-3">
        <div className="mb-1 text-blue-500">You Are Logged In</div>
        <button onClick={handleSignOut} className="hover:underline ">
          Sign Out
        </button>
</div>   
  );
};
export default Loggedin;