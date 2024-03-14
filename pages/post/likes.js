import { useState, useEffect } from 'react';
import { useAuth, db } from "../../firebase";
import { doc, getDoc, collection, query, where, getDocs, documentId } from 'firebase/firestore'; 
import { useRouter } from "next/router";
import Layout from '../../components/Layout';
import './likes.css';

const LikedPosts = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLikedPosts = async () => {
      if (!currentUser) {
        console.error("No user logged in");
        setLoading(false);
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().likedPosts) {
        const likedPostsIds = userSnap.data().likedPosts;
        if (likedPostsIds.length === 0) {
          setLoading(false);
          return;
        }

        const chunkSize = 10;
        const chunks = [];
        for (let i = 0; i < likedPostsIds.length; i += chunkSize) {
          chunks.push(likedPostsIds.slice(i, i + chunkSize));
        }

        const postsPromises = chunks.map(chunk => {
          const postsQuery = query(collection(db, "posts"), where(documentId(), 'in', chunk));
          return getDocs(postsQuery);
        });

        const postsSnapshots = await Promise.all(postsPromises);
        const posts = postsSnapshots.flatMap(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        setLikedPosts(posts);
      }

      setLoading(false);
    };

    fetchLikedPosts();
  }, [currentUser]);

  const navigateToPost = (postId) => {
    router.push(`/post/${postId}`);
  };

  if (loading) return <Layout>Loading...</Layout>;
  if (!likedPosts.length) return <Layout>No liked posts found.</Layout>;

  return (
    <Layout>
      <div className="liked-container">
        <div className="liked-section">
          <h1>Your Liked Posts</h1>
          <div className="liked-posts-container">
            {likedPosts.map(({ id, artist, date, venue, rating, displayName, likes }) => (
              <div key={id} className="liked-post-thumbnail" onClick={() => navigateToPost(id)}>
                <h4>{artist}</h4>
                <p>Date: {date}</p>
                <p>Venue: {venue}</p>
                <p>Rating: {rating}/5</p>
                <p>Author: {displayName}</p>
                <p>Likes: {likes.length}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LikedPosts;
