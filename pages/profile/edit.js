import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { v4 as uuidv4 } from 'uuid';
import { useAuth, db, storage } from "../../firebase";
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import Layout from '../../components/Layout';
import './edit.css';


/**
 * Component to edit the logged in user's profile.
 * Allows updating the bio, favorite artists, and profile picture.
 */
export default function EditProfile() {
    const { currentUser, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [bio, setBio] = useState('');
    const [artists, setArtists] = useState(['', '', '', '', '']);
    const [imageFile, setImageFile] = useState(null); 
    const [previewUrl, setPreviewUrl] = useState(''); 
    const [existingImageUrl, setExistingImageUrl] = useState('');
    const router = useRouter();


      /**
     * Fetches the current user profile from Firestore on component mount and when currentUser or authLoading changes.
     */
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
                setPreviewUrl(userData.profileUrl || currentUser.PhotoUrl || '/Temp Profile Icon.png');
                setExistingImageUrl(userData.profileUrl || '');
            } else {
            await setDoc(userRef, {
                bio,
                artists,
                profileUrl: imageFile,
            }, {merge: true });
            }
            setLoading(false);
        };

        fetchUserProfile();
    }, [currentUser, authLoading, router]);


    /**
     * Handles the submission of the profile update form.
     * @param {React.FormEvent} e - The form event.
     */
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
        // Update user profile in Firestore
        try {
            const userRef = doc(db, "users", currentUser.uid);
            await setDoc(userRef, {
                bio,
                artists,
                profileUrl: imageUrl,
            }, { merge: true });
            
            console.log('Profile updated');
            router.push('/profile/view');
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };
    


     /**
     * Handles changes to the artists array.
     * @param {number} index - The index of the artist to update.
     * @param {string} value - The new value of the artist.
     */
    const handleArtistChange = (index, value) => {
        const newArtists = [...artists];
        newArtists[index] = value;
        setArtists(newArtists);
    };


     /**
     * Handles the selection of a new image file.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     */
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


    //the actual page layout, displaying form to update the user's profile
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
