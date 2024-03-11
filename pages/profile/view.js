import { useState, useEffect } from 'react';
import { useAuth, db } from "../../firebase";
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from "next/router";
import UserInfo from '../../components/Profile/UserInfo';
import Layout from '../../components/Layout';
import './view.css';

export default function ViewProfile() {
    const { currentUser, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [bio, setBio] = useState('');
    const [artists, setArtists] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [posts, setPosts] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (!currentUser) {
            if (!authLoading) {
                router.push('/');
            }
            return;
        }

        const fetchUserProfileAndPosts = async () => {
            const userRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                setBio(userData.bio || '');
                setArtists(userData.artists || []);
                setImageUrl(userData.profileUrl||'');
            } else {
                console.log("Document does not exist");
            }

            // Fetch user's posts
            const postsQuery = query(collection(db, "posts"), where("userId", "==", currentUser.uid));
            const querySnapshot = await getDocs(postsQuery);
            const userPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(userPosts);

            setLoading(false);
        };

        fetchUserProfileAndPosts();
    }, [currentUser, authLoading, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <div className="profile-container">
                <div className="profile-header">
                    <img src={imageUrl} alt="Profile" className="profile-picture" />
                    <UserInfo />
                </div>
                <div className="profile-section">
                    <h2>Bio</h2>
                    <p className="bio-text">{bio}</p>
                </div>
                <div className="profile-section">
                    <h3>Top Five Artists</h3>
                    <ul className="artist-list">
                        {artists.map((artist, index) => (
                            <li key={index}>{artist || `Artist #${index + 1} not specified`}</li>
                        ))}
                    </ul>
                </div>
                <div className="profile-section">
                    <h3>Your Posts</h3>
                    <div className="posts-container">
                        {posts.map(({ id, artist, date, venue, rating }) => (
                            <div key={id} className="post-thumbnail" onClick={() => { /* Placeholder for navigation */ }}>
                                <h4>{artist}</h4>
                                <p>Date: {date}</p>
                                <p>Venue: {venue}</p>
                                <p>Rating: {rating}/5</p>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="edit-profile-btn" onClick={() => router.push('/profile/edit')}>Edit Profile</button>
            </div>
        </Layout>
    );
}
