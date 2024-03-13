import { useState, useEffect } from 'react';
import { useAuth, db } from "../../firebase";
import { doc, getDoc, collection, query, where, getDocs, deleteDoc} from 'firebase/firestore';
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
        const fetchUserProfileAndPosts = async () => {
            if (!currentUser) {
                if (!authLoading) {
                    router.push('/');
                }
                return;
            }

            const userRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(userRef);

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

    const navigateToPost = (postId) => {
        router.push(`/post/${postId}`);
    };

    const handleDeletePost = async () => {
        if (post.userId === currentUser?.uid) {
          const isConfirmed = window.confirm("Are you sure you want to delete this post?");
          if (isConfirmed) {
            await deleteDoc(doc(db, "posts", postId));
      
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
              likedPosts: arrayRemove(postId)
            });
    
            router.push('/profile/view');
          }
        } else {
          console.error("You're not authorized to delete this post.");
        }
      };
    

    return (
        <Layout>
            <div className="profile-container">
                <div className="profile-header">
                    <img src={imageUrl} alt="Profile" className="profile-picture" />
                    <h1><UserInfo /></h1>
                </div>
                <div className="profile-section">
                    <h2>Bio</h2>
                    <p className="profile-bio">{bio}</p>
                </div>
                <div className="profile-section">
                    <h2>Top Artists</h2>
                    <ul className="artist-list">
                        {artists.map((artist, index) => (
                            <li key={index}>{artist || `Artist #${index + 1} not specified`}</li>
                        ))}
                    </ul>
                </div>
                <div className="profile-section">
                    <h2>Your Posts</h2>
                    <div className="personal-posts-container">
                        {posts.map(({ id, artist, date, venue, rating }) => (
                            <div key={id} className="personal-post" onClick={() => navigateToPost(id)}>
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
