import { useState, useEffect } from 'react';
import { useAuth, db } from "../../firebase";
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
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
        const posts = [];

        for (let postId of likedPostsIds) {
          const postRef = doc(db, "posts", postId);
          const postSnap = await getDoc(postRef);

          if (postSnap.exists()) {
            posts.push({ id: postSnap.id, ...postSnap.data() });
          }
        }

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
      <div className="liked-posts-container">
        <div className="liked-posts-section">
          <h2>Liked Posts</h2>
          <div className="posts-container">
            {likedPosts.map(({ id, artist, date, venue, rating }) => (
              <div key={id} className="post-thumbnail" onClick={() => navigateToPost(id)}>
                <h4>{artist}</h4>
                <p>Date: {date}</p>
                <p>Venue: {venue}</p>
                <p>Rating: {rating}/5</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LikedPosts;
