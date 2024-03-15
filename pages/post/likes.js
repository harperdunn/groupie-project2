// Imports
import { useState, useEffect } from 'react';
import { useAuth, db } from "../../firebase";
import { doc, getDoc, collection, query, where, getDocs, documentId } from 'firebase/firestore'; 
import { useRouter } from "next/router";
import Layout from '../../components/Layout';
import './likes.css';

/**
 * LikedPosts component displays posts liked by the current user.
 * It retrieves the user's liked posts from Firestore and displays them.
 * Users can click on a post to navigate to its detailed view.
 */
const LikedPosts = () => {
  const { currentUser } = useAuth(); // Authentication hook to access the current user
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [likedPosts, setLikedPosts] = useState([]); // State to hold liked posts
  const router = useRouter(); // Next.js Router for navigation

  useEffect(() => {
    /**
     * fetchLikedPosts asynchronously fetches posts liked by the current user from Firestore.
     * It checks if the user exists and has liked posts, then queries Firestore for those posts.
     * The function handles pagination in chunks for efficiency.
     */
    const fetchLikedPosts = async () => {
      if (!currentUser) {
        console.error("No user logged in");
        setLoading(false);
        return;
      }

      // Fetch user document to get liked posts IDs
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      // Check if user document exists and has likedPosts
      if (userSnap.exists() && userSnap.data().likedPosts) {
        const likedPostsIds = userSnap.data().likedPosts;
        if (likedPostsIds.length === 0) {
          setLoading(false);
          return;
        }

        // Divide liked posts IDs into chunks for batch querying
        const chunkSize = 10;
        const chunks = [];
        for (let i = 0; i < likedPostsIds.length; i += chunkSize) {
          chunks.push(likedPostsIds.slice(i, i + chunkSize));
        }

        // Create and execute queries for each chunk
        const postsPromises = chunks.map(chunk => {
          const postsQuery = query(collection(db, "posts"), where(documentId(), 'in', chunk));
          return getDocs(postsQuery);
        });

        // Await all post queries and flatten results
        const postsSnapshots = await Promise.all(postsPromises);
        const posts = postsSnapshots.flatMap(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        setLikedPosts(posts); // Update state with fetched posts
      }

      setLoading(false); // Set loading to false after operation completes
    };

    fetchLikedPosts();
  }, [currentUser]); // Dependency array, re-run effect if currentUser changes

  /**
   * navigateToPost navigates to the detailed view of a post.
   * @param {string} postId The ID of the post to navigate to.
   */
  const navigateToPost = (postId) => {
    router.push(`/post/${postId}`);
  };

  if (loading) return <Layout>Loading...</Layout>;
  if (!likedPosts.length) 
  return (
    <Layout>
      <div className="liked-container">
        <div className="liked-section">
          <h1>Your Liked Posts</h1>
          <div className="liked-posts-container">
            <h2>No liked posts found.</h2>
          </div>
        </div>
      </div>
    </Layout>
  );

  // Render liked posts or a message if none are found
  return (
    <Layout>
      <div className="liked-container">
        <div className="liked-section">
          <h1>Your Liked Posts</h1>
          <div className="liked-posts-container">
            {likedPosts.map(({ id, artist, date, venue, rating, displayName, likes }) => (
              <div key={id} className="liked-post-thumbnail" onClick={() => navigateToPost(id)}>
                <h4>{artist}</h4>
                <p>Author: {displayName}</p>
                <p>Rating: {Array.from({ length: rating }, (_, index) => <span key={index}>★</span>)}</p>
                <p>Venue: {venue}</p>
                <p>Date: {date}</p>
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
