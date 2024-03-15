import React, { useEffect, useState } from 'react';
import{useAuth} from "../../firebase"


function UserInfo() {
  const [user, setUser] = useState(null);
  const {currentUser, loading}=useAuth();//current user is returned to useAuth state using custom hook

//   useEffect(() => {
//     setUser(auth.currentUser);
//   }, []);

  // Conditionally render user information if a user is signed in
  if (currentUser) {
    console.log(currentUser)
    return (
      <div>
        {currentUser.displayName}
      </div> 
    );
        }
        
  else {
    // Optionally return null or some placeholder if no user is signed in
    return <div>Signing out...</div>;
  }

}

export default UserInfo;
