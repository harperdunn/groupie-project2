import { useState, useEffect } from 'react';
import { useAuth, db, storage } from "../../firebase";
import { setDoc, doc, getDoc, } from 'firebase/firestore';
import { useRouter } from "next/router";
import UserInfo from '../../components/Profile/UserInfo';
import Layout from '../../components/Layout'; 
import './edit.css';
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

        const fetchUserProfile = async () => {
            const userRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                setBio(userData.bio || '');
                setArtists(userData.artists || ['', '', '', '', '']);
                setImageUrl(userData.profileUrl || currentUser.PhotoUrl || '');
            } else {
                console.log("Document does not exist");
            }
            setLoading(false);
        };

        fetchUserProfile();
    }, [currentUser, authLoading, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return; 
        try {
            const userRef = doc(db, "users", currentUser.uid);
            await setDoc(userRef, {
                bio,
                artists,
                profileUrl: imageUrl,
            }, {merge: true });
            console.log('Profile updated');
            router.push('/profile/view');
        } catch (error) {
            console.error("Error updating profile:", error);
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
        const imageName = file.name;
        const storageRef = ref(storage, `profilePictures/${currentUser.uid}/${imageName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
    
        uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
                console.error("Upload error:", error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageUrl(downloadURL);
                });
            }
        );
    };

    return (
        <>
        <Layout>
            <form onSubmit={handleSubmit}>
                <div className='edit-section'>
                    <h2>Profile Picture:</h2>
                    {imageUrl && <img className="profile-picture-edit" src={imageUrl} alt="Profile" style={{width: '100px', height: '100px'}} />}
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
                        <div className='artist-edit' key={index}>
                            <input
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
