import { useState, useEffect } from 'react';
import { useAuth, db, storage } from "../../firebase";
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { useRouter } from "next/router";
import Layout from '../../components/Layout';
import './edit.css';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

export default function EditProfile() {
    const { currentUser, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [bio, setBio] = useState('');
    const [artists, setArtists] = useState(['', '', '', '', '']);
    const [imageFile, setImageFile] = useState(null); 
    const [previewUrl, setPreviewUrl] = useState(''); 
    const [existingImageUrl, setExistingImageUrl] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!currentUser) {
            if (!authLoading) {
                router.push('/');
            }
            return;
        }

        console.log(currentUser.uid);
        const fetchUserProfile = async () => {
            const userRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                setBio(userData.bio || '');
                setArtists(userData.artists || ['', '', '', '', '']);
                setPreviewUrl(userData.profileUrl || currentUser.PhotoUrl || '');
                setExistingImageUrl(userData.profileUrl || '');
            } else {
            await setDoc(userRef, {
                bio,
                artists,
                profileUrl: imageUrl,
            }, {merge: true });
            }
            setLoading(false);
        };

        fetchUserProfile();
    }, [currentUser, authLoading, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const uploadImage = async () => {
            if (imageFile) {
                const uniqueFilename = `${currentUser.uid}/${uuidv4()}-${imageFile.name}`;
                const storageRef = ref(storage, `profilePictures/${uniqueFilename}`);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);
                
                try {
                    await new Promise((resolve, reject) => {
                        uploadTask.on(
                            "state_changed",
                            () => {},
                            reject,
                            async () => {
                                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                resolve(downloadURL);
                                setPreviewUrl(downloadURL); 
                            }
                        );
                    });
                } catch (error) {
                    console.error("Upload error:", error);
                    return null;
                }
            }
            return previewUrl; 
        };

        const imageUrl = await uploadImage();
        if (!imageUrl) return; 

        try {
            // Update user profile
            const userRef = doc(db, "users", currentUser.uid);
            await setDoc(userRef, {
                bio,
                artists,
                profileUrl: imageUrl,
            }, { merge: true });
            
            if (existingImageUrl && existingImageUrl !== imageUrl) {
                
                const oldImageRef = ref(storage, existingImageUrl);
                await deleteObject(oldImageRef);
            }
            
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

        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxFileSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            alert('Invalid file type. Please select an image (JPEG, PNG, GIF).');
            return;
        }

        if (file.size > maxFileSize) {
            alert('File is too large. Please upload files less than 5MB.');
            return;
        }

        setImageFile(file); 
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result); 
        };
        reader.readAsDataURL(file);
    };

    return (
        <>
            <Layout>
                <div className='edit-container'>
                    <h1>Edit Your Profile</h1>
                    <form onSubmit={handleSubmit}>
                        <div className='edit-section'>
                            <h2>Profile Picture:</h2>
                            {previewUrl && <img className="profile-picture-edit" src={previewUrl} alt="Profile" style={{width: '100px', height: '100px'}} />}
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
                            <div className='artist-grid'>
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
                        </div>
                        <button className="update-profile-btn" type="submit">Update</button>
                    </form>
                </div>
            </Layout>
        </>
    );
}
