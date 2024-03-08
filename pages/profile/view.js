import { useState, useEffect } from 'react';
import { useAuth, db } from "../../firebase";
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from "next/router";
import UserInfo from '../../components/Profile/UserInfo';
import Layout from '../../components/Layout';

export default function ViewProfile() {
    const { currentUser, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [bio, setBio] = useState('');
    const [artists, setArtists] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (!currentUser) {
            if (!authLoading) {
                router.push('/');
            }
            return;
        }

        const fetchUserProfile = async () => {
            const userRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                setBio(userData.bio || '');
                setArtists(userData.artists || []);
            } else {
                console.log("Document does not exist");
            }
            setLoading(false);
        };

        fetchUserProfile();
    }, [currentUser, authLoading, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <UserInfo />
            <div>
                <h2>Bio</h2>
                <p>{bio}</p>
            </div>
            <div>
                <h3>Top Five Artists</h3>
                <ul>
                    {artists.map((artist, index) => (
                        <li key={index}>{artist || `Artist #${index + 1} not specified`}</li>
                    ))}
                </ul>
            </div>
            <button onClick={() => router.push('/profile/edit')}>Edit Profile</button>
        </Layout>
    );
}
