import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../../firebase';
import { db } from '../../firebase';
import Layout from '../../components/Layout';

const Post = ({ post }) => {
  const { currentUser } = useAuth();
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length); // New state for managing like count
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
    const userRef = doc(db, "users", currentUser.uid);

    if (hasLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(currentUser.uid)
      });
      await updateDoc(userRef, {
        likedPosts: arrayRemove(postId)
      });
      setHasLiked(false);
      setLikeCount(prev => prev - 1); // Decrement like count
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(currentUser.uid)
      });
      await updateDoc(userRef, {
        likedPosts: arrayUnion(postId)
      });
      setHasLiked(true);
      setLikeCount(prev => prev + 1); // Increment like count
    }
  };

  const handleDelete = async () => {
    if (post.userId === currentUser?.uid) {
      // Confirmation dialog
      const isConfirmed = window.confirm("Are you sure you want to delete this post?");
      if (isConfirmed) {
        await deleteDoc(doc(db, "posts", postId));
        router.push('/profile/view');
      } else {
      }
    } else {
      console.error("You're not authorized to delete this post.");
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
        {currentUser && post.userId === currentUser.uid && (
          <button onClick={handleDelete} style={{marginLeft: '10px'}}>Delete Post</button>
        )}
        <p>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</p>
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