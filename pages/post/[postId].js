import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Layout from '../../components/Layout';
import './viewPost.css';

const Post = ({ post }) => {
const router = useRouter();

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
