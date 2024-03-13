import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../../firebase';
import { db } from '../../firebase';
import Layout from '../../components/Layout';
import { getStorage, ref, deleteObject } from "firebase/storage";
import './[postId].css';

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
      const isConfirmed = window.confirm("Are you sure you want to delete this post?");
      if (isConfirmed) {
        await deleteDoc(doc(db, "posts", postId));
  
        if (post.imageUrl) {
          const storage = getStorage();
          const imageRef = ref(storage, post.imageUrl);

          deleteObject(imageRef)
            .then(() => {
              console.log("Image deleted successfully");
            })
            .catch((error) => {
              console.error("Error removing image: ", error);
            });
        }
  
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
          likedPosts: arrayRemove(postId)
        });
  
        router.push('/profile/view');
      }
    } else {
      console.error("You're not authorized to delete this post.");
    }
  };
  
  
  

  if (!post) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <div className='individual-post-background'>
      <div className="individual-post-container">
        <h1>{post.artist}</h1>
        <p>By {post.displayName}</p>
        <div className='post-header-container'>
          <div></div>{post.imageUrl && <img className='individual-post-img' src={post.imageUrl} alt="Post image" />} 
          <div className='post-info-container'>
          <div>
            <button className="individual-post-button" onClick={handleLike}>{hasLiked ? 'Unlike' : 'Like'}</button>
            {currentUser && post.userId === currentUser.uid && (
              <button className='individual-post-button' onClick={handleDelete} style={{marginLeft: '10px'}}>Delete</button>
            )}
            <p>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</p>
          </div>
          <p>Venue: {post.venue}</p>
          <p>Date: {post.date}</p>
          <p>Rating: {post.rating}</p>
          </div>
        </div>
          <div className='review-container'>
            <p>{post.review}</p>
          </div>
          <div>
            <h2>Set List:</h2>
            <ul>
              {post.setList.map((song, index) => (
                <li key={index}>{song}</li>
              ))}
            </ul>
          </div>
          {/* Display genres if they exist */}
          {post.genres && (
            <div className="genre-buttons">
              {post.genres.map((genre, index) => (
                <span key={index} className="genre-button">{genre}</span>
              ))}
            </div>
          )}
        </div>
        </div>
        <button className="individual-post-button" onClick={() => router.back()}>Back</button> 
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