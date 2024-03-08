import { useState, useEffect } from 'react';
import { useAuth } from "../../firebase";
import { db } from '../../firebase';
import { setDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useRouter } from "next/router";
import UserInfo from '../../components/Profile/UserInfo';
import Layout from '../../components/Layout'; 

export default function EditProfile() {
    const router = useRouter(); // This should be inside the component to use the useRouter hook properly
    const {currentUser, loading} = useAuth(); // Current user is returned to useAuth state using custom hook
    const [loading2, setLoading2] = useState(loading); // Initialize loading state
    const [bio, setBio] = useState('');
    const [artists, setArtists] = useState(['', '', '', '', '']); // Initialize with 5 empty strings for the top 5 artists
   
    useEffect(() => {
        if (!currentUser && !loading2) { // Check if the user is not logged in and not loading
          router.push('/'); // Redirect if not authenticated
        } else if(currentUser) {
            setLoading2(false);
           // Set loading to false once the user is fetched
        }
      }, [currentUser, loading, router]); // Include all dependencies here

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return; // Guard clause to ensure currentUser is not null
        console.log(currentUser);
        try {
            const userRef = doc(db, "users", currentUser.uid);
            await setDoc(userRef, {
                bio,
                artists,
            }, {merge: true });
        setBio()


            console.log('Profile updated');
            // Optionally: Redirect or show a success message
        } catch (error) {
            console.error("Error updating profile:", error);
            // Provide feedback to the user about the failure
            // For example:
            // alert('Failed to update profile. Please try again later.');
        }
    };

    const handleArtistChange = (index, value) => {
        const newArtists = [...artists];
        newArtists[index] = value;
        setArtists(newArtists);
    };

    return (
        <>
        <Layout>
            <UserInfo />
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Bio</label>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>
                <div>
                    Top Five Artists:  
                    {artists.map((artist, index) => (
                        <input
                            key={index}
                            value={artist}
                            onChange={(e) => handleArtistChange(index, e.target.value)}
                            placeholder={`Artist #${index + 1}`}
                        />
                    ))}
                </div>
                <button type="submit">Update Profile</button>
            </form>
            </Layout>
        </>
    );
}
