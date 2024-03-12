import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import Layout from '../../components/Layout';
import './discover.css';

const Discover = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
  
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
          // Get the first 10 posts
          const randomPosts = shuffledPosts.slice(0, 9);
          setPosts(randomPosts);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching random posts:', error);
        }
      };
  
      fetchRandomPosts();
    }, []);
  
    return (
      <Layout>
        <div className='discover-section'>
          <h1>Discover</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="profile-section">
              <div className="posts-container">
                {posts.map(({ id, artist, date, venue, rating }) => (
                  <div key={id} className="post-thumbnail" onClick={() => navigateToPost(id)}>
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
      </Layout>
    );
  };
  
  export default Discover;
  