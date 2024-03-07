import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import Layout from '../../components/Layout';

const ViewPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const postsArray = [];
      querySnapshot.forEach((doc) => {
        // Assumes that every document has the structure we expect
        postsArray.push({ id: doc.id, ...doc.data() });
      });
      setPosts(postsArray);
    };

    fetchPosts();
  }, []);

  return (
    <Layout>
      <div>
        <h1>All Posts</h1>
        {posts.map((post) => (
          <div key={post.id}>
            <h2>Artist: {post.artist}</h2>
            <p>Venue: {post.venue}</p>
            <p>Date: {post.date}</p>
            <h3>Set List:</h3>
            <ul>
              {post.setList && post.setList.map((song, index) => (
                <li key={index}>{song}</li>
              ))}
            </ul>
            <p>Rating: {Array(post.rating).fill('★').join('')} ({post.rating}/5)</p>
            <p>Review: {post.review}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default ViewPosts;
