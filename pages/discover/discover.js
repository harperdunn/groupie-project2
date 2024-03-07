import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import Layout from '../../components/Layout';

const DiscoverPage = () => {
    const [concerts, setConcerts] = useState([]);

    useEffect(() => {
        const fetchConcerts = async () => {
            // Assuming you have a collection named 'concerts' in your Firestore
            const querySnapshot = await db.collection('concerts').get();
            const concertsArray = [];
            querySnapshot.forEach((doc) => {
                concertsArray.push({ id: doc.id, ...doc.data() });
            });
            // Randomize the array
            const randomizedConcerts = shuffleArray(concertsArray).slice(0, 10);
            setConcerts(randomizedConcerts);
        };

        fetchConcerts();
    }, []);

    // Function to shuffle array
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    return (
        <Layout>
            <div>
                <h1>Discover</h1>
                <div>
                    <h2>Upcoming Concerts Nearby</h2>
                    <ul>
                        {concerts.map((concert) => (
                            <li key={concert.id}>
                                <h3>{concert.title}</h3>
                                <p>{concert.date}</p>
                                {/* Render other concert details as needed */}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Layout>
    );
};

export default DiscoverPage;
