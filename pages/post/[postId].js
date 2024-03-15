// Imports
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../../firebase';
import { db } from '../../firebase';
import Layout from '../../components/Layout';
import { getStorage, ref, deleteObject } from "firebase/storage";
import './[postId].css';

/**
 * Renders the detailed view of a specific post identified by postId.
 * Allows the current user to like/unlike the post and delete the post if they are the author.
 * 
 * @param {Object} post The post data to be displayed.
 */
const Post = ({ post }) => {
  const { currentUser } = useAuth(); // Hook to access the current user's authentication status
  const [hasLiked, setHasLiked] = useState(false); // State to track if the current user has liked the post
  const [likeCount, setLikeCount] = useState(post.likes.length); // State to manage the number of likes
  const router = useRouter();
  const { postId } = router.query; // Extract postId from the URL

  useEffect(() => {
    // Check if the current user has liked the post and update state accordingly
    if (post.likes.includes(currentUser?.uid)) {
      setHasLiked(true);
    }
  }, [post.likes, currentUser]);

  /**
   * Toggles the current user's like status for the post.
   * Updates both the post's like array and the user's likedPosts array in Firestore.
   */
  const handleLike = async () => {
    if (!currentUser) {
      console.error("No user logged in");
      return;
    }

    const postRef = doc(db, "posts", postId);
    const userRef = doc(db, "users", currentUser.uid);

    if (hasLiked) {
      // Remove like from the post and user's likedPosts
      await updateDoc(postRef, {
        likes: arrayRemove(currentUser.uid)
      });
      await updateDoc(userRef, {
        likedPosts: arrayRemove(postId)
      });
      setHasLiked(false);
      setLikeCount(prev => prev - 1); // Decrement like count
    } else {
      // Add like to the post and user's likedPosts
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

  /**
   * Deletes the current post if the current user is the author.
   * Removes the post from Firestore, deletes the associated image from Firebase Storage,
   * and removes the post from the user's likedPosts array.
   */
  const handleDelete = async () => {
    if (post.userId === currentUser?.uid) {
      const isConfirmed = window.confirm("Are you sure you want to delete this post?");
      if (isConfirmed) {
        await deleteDoc(doc(db, "posts", postId));
  
        // Delete post image from Firebase Storage if it exists
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
  
        // Remove post ID from user's likedPosts
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
          likedPosts: arrayRemove(postId)
        });
  
        // Navigate back to the user's profile view
        router.push('/profile/view');
      }
    } else {
      console.error("You're not authorized to delete this post.");
    }
  };

  // Render loading state or no post found state
  if (!post) return <Layout>Loading...</Layout>;

  // Render the post details
  return (
    <Layout>
      <div className='individual-post-background'>
      <div className="individual-post-container">
        <div className='post-title-container'>
        <h1>{post.artist}</h1>
            {currentUser && post.userId !== currentUser.uid && (
              <button className='individual-post-button' onClick={handleLike}><img className="individual-post-icons" src={hasLiked ? '/Full Heart Icon.png' : '/Empty Heart Icon.png'}/></button>
            )}
            {currentUser && post.userId === currentUser.uid && (
              <button className='individual-post-button' onClick={handleDelete} style={{marginLeft: '10px'}}><img className="individual-post-icons" src='/Trash Can Icon.png'/></button>
            )}
        </div>
        <p>By {post.displayName}</p>
        <div className='post-header-container'>
          <div></div>{post.imageUrl && <img className='individual-post-img' src={post.imageUrl} alt="Post image" />} 
          <div className='post-info-container'>
            <h3>Rating: {Array.from({ length: post.rating }, (_, index) => <span key={index}>★</span>)}</h3>
            <h3>Venue: {post.venue}</h3>
            <h3>Date: {post.date}</h3>
            <h3>Likes: {likeCount}</h3>
          </div>
        </div>
          <div className='review-container'>
            <p>{post.review}</p>
          </div>
          {/* Display genres if they exist */}
          {post.genres && (
            <div className="genre-buttons">
              {post.genres.map((genre, index) => (
                <span key={index} className="genre-button">#{genre}</span>
              ))}
            </div>
          )}
          <div>
            <h2>Set List:</h2>
            <ul>
              {post.setList.map((song, index) => (
                <li key={index}>{song}</li>
              ))}
            </ul>
          </div>
          
        </div>
        </div>
        <button className="individual-back-button" onClick={() => router.back()}>Back</button> 
      </Layout>
  );
};

/**
 * getServerSideProps fetches the post data from Firestore for server-side rendering.
 * 
 * @param {Object} context Context object containing route parameters, including postId.
 * @returns {Object} Props object containing the post data for rendering.
 */
export async function getServerSideProps(context) {
  const { postId } = context.params;
  const docRef = doc(db, "posts", postId);
  const docSnap = await getDoc(docRef);

  // Check if the post exists and return its data, otherwise return null
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