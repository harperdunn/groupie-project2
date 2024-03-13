import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useRouter } from "next/router";
import Layout from '../../components/Layout';
import './discover.css';

const Discover = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
  
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
  
    const router = useRouter();
    const navigateToPost = (postId) => {
    router.push(`/post/${postId}`);
    };

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
                {posts.map(({ id, artist, date, venue, rating }) => (
                  <div key={id} className="discover-post-thumbnail" onClick={() => navigateToPost(id)}>
                    <h4>{artist}</h4>
                    <p>Date: {date}</p>
                    <p>Venue: {venue}</p>
                    <p>Rating: {rating}/5</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
            <button className='refresh-button' onClick={(event) => handleRefresh()} style={{marginLeft: '10px'}}>Refresh</button>
        </div>
      </Layout>
    );
  };
  
  export default Discover;
  