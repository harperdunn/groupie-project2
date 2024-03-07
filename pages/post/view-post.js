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
                <div>
                    {posts.map((post) => (
                        <div key={post.id}>
                            <h2>{post.title}</h2>
                            <p>{post.content}</p>
                            {/* Render other post fields as needed */}
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ViewPosts;
