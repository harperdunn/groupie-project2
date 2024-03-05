
import {useRouter} from "next/router"
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc} from 'firebase/firestore';


import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Profile = () => {
  const [user] = useAuthState(auth);
  //profile variable with user's bio and artists (string and list)
  const [profile, setProfile] = useState({ bio: '', topArtists: [] });
  //user edit mode
  const [editMode, setEditMode] = useState(false);

  // Fetch user profile from Firestore
  useEffect(() => {
    if (user) {
      const docRef = doc(db, 'profiles', user.uid);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      });
    }
  }, [user]);

  // Update profile information
  const updateProfile = async () => {
    const docRef = doc(db, 'profiles', user.uid);
    await setDoc(docRef, profile);
    setEditMode(false);
  };

  if (!user) return <div>Please sign in</div>;

  return (
    <div>
      <h1>Profile Page</h1>
      {editMode ? (
        <div>
          <input
            type="text"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Your bio"
          />
          <button onClick={() => updateProfile()}>Save</button>
        </div>
      ) : (
        <div>
          <p>{profile.bio}</p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default Profile;