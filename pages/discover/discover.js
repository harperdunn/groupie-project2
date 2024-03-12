import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import Layout from '../../components/Layout';

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
        const randomPosts = shuffledPosts.slice(0, 10);
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
      <div>
        <h1>Discover</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {posts.map((post) => (
              <div key={post.id}>
                <h2>Artist: {post.artist}</h2>
                <p>Venue: {post.venue}</p>
                <p>Date: {post.date}</p>
                <h3>Set List:</h3>
                <ul>
                  {post.setList &&
                    post.setList.map((song, index) => (
                      <li key={index}>{song}</li>
                    ))}
                </ul>
                <p>
                  Rating: {Array(post.rating).fill('★').join('')} ({post.rating}
                  /5)
                </p>
                <p>Review: {post.review}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Discover;
