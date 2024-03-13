import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../../firebase';
import { db } from '../../firebase';
import Layout from '../../components/Layout';
import './viewPost.css';

const Post = ({ post }) => {
  const { currentUser } = useAuth();
  const [hasLiked, setHasLiked] = useState(false);
  const router = useRouter();
  const { postId } = router.query;

  useEffect(() => {
    if (post.likes.includes(currentUser?.uid)) {
      setHasLiked(true);
    }
  }, [post.likes, currentUser]);

  const handleLike = async () => {
    if (!currentUser) {
      console.error("No user logged in");
      return;
    }

    const postRef = doc(db, "posts", postId);

    // If the user has already liked the post, unlike it; otherwise, like it
    if (hasLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(currentUser.uid)
      });
      setHasLiked(false);
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(currentUser.uid)
      });
      setHasLiked(true);
    }
  };

  if (!post) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <button onClick={() => router.back()}>Back</button>
      <h1>{post.artist}</h1>
      <p>Venue: {post.venue}</p>
      <p>Date: {post.date}</p>
      <p>Rating: {post.rating}</p>
      <p>Review: {post.review}</p>
      <div>
        Set List:
        <ul>
          {post.setList.map((song, index) => (
            <li key={index}>{song}</li>
          ))}
        </ul>
      </div>
      {post.imageUrl && <img src={post.imageUrl} alt="Post image" style={{ width: 200, height: 250 }} />}
      {/* Display genres if they exist */}
      {post.genres && (
        <div>Genres: {post.genres.join(", ")}</div>
      )}
      <div>
        <button onClick={handleLike}>{hasLiked ? 'Unlike' : 'Like'}</button>
        <p>{post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}</p>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const { postId } = context.params;
  const docRef = doc(db, "posts", postId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return {
      props: {
        post: null,
      },
    };
  }

  return {
    props: {
      post: {
        id: docSnap.id,
        ...docSnap.data(),
      },
    },
  };
}

export default Post;