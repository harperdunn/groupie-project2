import { useState, useEffect } from 'react';
import { useAuth, db, storage } from "../../firebase";
import { setDoc, doc, getDoc, } from 'firebase/firestore';
import { useRouter } from "next/router";
import UserInfo from '../../components/Profile/UserInfo';
import Layout from '../../components/Layout'; 
import './view.css';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


export default function EditProfile() {
    const { currentUser, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true); 
    const [bio, setBio] = useState('');
    const [artists, setArtists] = useState(['', '', '', '', '']);
    const [imageUrl, setImageUrl] = useState('');
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
                setImageUrl(userData.profileUrl || currentUser.PhotoUrl || '');//sets imageURL to the existing one in Google or nothing if there isn't one
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
                profileUrl: imageUrl,
            }, {merge: true });
        setBio()
            console.log('Profile updated');
            // Optionally: Redirect or show a success message
            router.push('/profile/view');
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const imageName = file.name; //to store in storage
        const storageRef = ref(storage, `profilePictures/${currentUser.uid}/${imageName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
    
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // optional: track and show upload progress
            },
            (error) => {
                // handle any errors
                console.error("Upload error:", error);
            },
            () => {
                // Handle successful uploads on complete
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageUrl(downloadURL); //updates my imageUrl variable
                    currentUser.profileUrl=imageUrl; //update url in firestore
                });
            }
        );
    };

    return (
        <>
        <Layout>
            <div className='edit-section'><UserInfo/></div>
            <form onSubmit={handleSubmit}>
                <div className='edit-section'>
                    <h2>Profile Picture:</h2>
                    {imageUrl && <img className="profile-picture" src={imageUrl} alt="Profile" style={{width: '100px', height: '100px'}} />}
                    <div>
                        <input type="file" onChange={handleImageChange} />
                    </div>
                </div>
                <div className='edit-section'>
                    <div>
                        <h2>Bio:</h2>
                    </div>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>
                <div className='edit-section'>
                    <h2>Top Five Artists:</h2>
                    {artists.map((artist, index) => (
                        <div className='artists-edit'>
                            <input
                                key={index}
                                value={artist}
                                onChange={(e) => handleArtistChange(index, e.target.value)}
                                placeholder={`Artist #${index + 1}`}
                            />
                        </div>
                    ))}
                </div>
                <button className="edit-profile-btn" type="submit">Update Profile</button>
            </form>
            </Layout>
        </>
    );
}
