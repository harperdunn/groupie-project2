import { useState, useEffect } from 'react';
import { useAuth, db } from "../../firebase";
import { setDoc, doc, getDoc} from 'firebase/firestore';
import { useRouter } from "next/router";
import UserInfo from '../../components/Profile/UserInfo';
import Layout from '../../components/Layout'; 

export default function EditProfile() {
    const { currentUser, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true); 
    const [bio, setBio] = useState('');
    const [artists, setArtists] = useState(['', '', '', '', '']);
    const router = useRouter();
   
    useEffect(() => {
        if (!currentUser) {
            if (!authLoading) {
                router.push('/');
            }
            return;
        }

        // Fetch user profile
        const fetchUserProfile = async () => {
            const userRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                setBio(userData.bio || '');
                setArtists(userData.artists || ['', '', '', '', '']);
            } else {
                // Handle the case where there is no user data
                console.log("Document does not exists");
            }
            setLoading(false);
        };

        fetchUserProfile();
    }, [currentUser, authLoading, router]);

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
