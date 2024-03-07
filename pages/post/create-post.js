// pages/post/create-post 
import { useState } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Make sure this path matches your Firebase config file
import Layout from '../../components/Layout'; // If you're using a Layout component

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add a new post to the "posts" collection
    try {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        // Add more post properties here (e.g., timestamp, author)
      });

      router.push('/post/view-post'); // Redirect to homepage or posts page after creation
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <h1>Create Post</h1>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Post</button>
      </form>
    </Layout>
  );
};

export default CreatePost;
