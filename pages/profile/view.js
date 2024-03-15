import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { useAuth, db } from "../../firebase";
import { doc, getDoc, collection, query, where, getDocs} from 'firebase/firestore';
import Layout from '../../components/Layout';
import UserInfo from '../../components/Profile/UserInfo';
import './view.css';

/**
 * Component to view the user profile along with their posts.
 */
export default function ViewProfile() {
    const { currentUser, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [bio, setBio] = useState('');
    const [artists, setArtists] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [posts, setPosts] = useState([]);
    const router = useRouter();

    /**
     * Fetches the current user's profile and posts from Firestore on component mount.
     */
    useEffect(() => {
        
        const fetchUserProfileAndPosts = async () => {
            if (!currentUser) {
                if (!authLoading) {
                    router.push('/');
                }
                return;
            }
            
            // Fetching user profile
            const userRef = doc(db, "users", currentUser.uid);
        
            const docSnap = await getDoc(userRef);
            //fetching user posts
            if (docSnap.exists()) {
                const userData = docSnap.data();
                setBio(userData.bio || '');
                setArtists(userData.artists || []);
                setImageUrl(userData.profileUrl || '');
            } else {
                console.log("Document does not exist");
            }

            const postsQuery = query(collection(db, "posts"), where("userId", "==", currentUser.uid));
            const querySnapshot = await getDocs(postsQuery);
            const userPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(userPosts);

            setLoading(false);
        };

        fetchUserProfileAndPosts();
    }, [currentUser, authLoading, router]);

    /**
     * Navigates to the detail page of a post.
     * @param {string} postId - The ID of the post to navigate to.
     */
    const navigateToPost = (postId) => {
        router.push(`/post/${postId}`);
    };
    
    //This page renders the user's own profile page with all of its elements and an option to edit their profile.
    return (
        <Layout>
            <div className="profile-container">
                <div className="profile-header">
                    <img src={imageUrl} alt="Profile" className="profile-picture" />
                    <h1><UserInfo /></h1>
                </div>
                <div className="profile-section">
                    <h2>Bio:</h2>
                    <div className='bio-container'>
                        <p className="profile-bio">{bio}</p>
                    </div>
                </div>
                <div className="profile-section">
                    <h2>Top 5 Artists:</h2>
                    <ul className="artist-list">
                        {artists.map((artist, index) => (
                            <li key={index}>{artist || `Artist #${index + 1} not specified`}</li>
                        ))}
                    </ul>
                </div>
                <div className="profile-section">
                    <h2>Your Posts:</h2>
                    <div className="personal-posts-container">
                        {posts.map(({ id, artist, date, venue, rating, likes }) => (
                            <div key={id} className="personal-post" onClick={() => navigateToPost(id)}>
                                <h4>{artist}</h4>
                                <p>Rating: {Array.from({ length: rating }, (_, index) => <span key={index}>★</span>)}</p>
                                <p>Venue: {venue}</p>
                                <p>Date: {date}</p>
                                <p>Likes: {likes.length}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="edit-profile-btn" onClick={() => router.push('/profile/edit')}>Edit Profile</button>
            </div>
        </Layout>
    );
}
