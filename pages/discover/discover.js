import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useRouter } from "next/router";
import Layout from '../../components/Layout';
import './discover.css';

// Creating the Discover component
const Discover = () => {
  // State variables using useState hook
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // useEffect hook to fetch random posts
  useEffect(() => {
    const fetchRandomPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const allPosts = [];
        querySnapshot.forEach((doc) => {
          allPosts.push({ id: doc.id, ...doc.data() });
        });
        // Shuffle the posts array to get random posts
        const shuffledPosts = allPosts.sort(() => Math.random() - 0.5);
        // Get the first 9 posts
        const randomPosts = shuffledPosts.slice(0, 9);
        setPosts(randomPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching random posts:', error);
      }
    };

    fetchRandomPosts();
  }, [refreshKey]);

  // useRouter hook to get Next.js router object
  const router = useRouter();
  const navigateToPost = (postId) => {
    router.push(`/post/${postId}`);
  };

  // Function to handle refresh button click
  const handleRefresh = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  return (
    <Layout>
      <div className='discover-section'>
        <h1>Discover</h1>
        <h2>Want to try something new? Check out some randomized reviews!</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="discover-section">
            <div className="discover-posts-container">
              {posts.map(({ id, artist, date, venue, rating, displayName, likes }) => (
                <div key={id} className="discover-post-thumbnail" onClick={() => navigateToPost(id)}>
                  <h4>{artist}</h4>
                  <p>Date: {date}</p>
                  <p>Venue: {venue}</p>
                  <p>Rating: {rating}/5</p>
                  <p>Author: {displayName}</p>
                  <p>Likes: {likes.length}</p> {/* Display the like count */}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div>
        <button className='refresh-button' onClick={handleRefresh} style={{marginLeft: '10px'}}>Refresh</button>
      </div>
    </Layout>
  );
};

export default Discover;
