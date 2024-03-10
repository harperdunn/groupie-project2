import { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, useAuth } from '../../firebase';
import Layout from '../../components/Layout';

const Discover = () => {
  const { currentUser } = useAuth(); // Utilize the useAuth hook to get the current user
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConcerts = async () => {
      const querySnapshot = await getDocs(collection(db, 'concerts'));
      const concertsArray = [];
      querySnapshot.forEach((doc) => {
        concertsArray.push({ id: doc.id, ...doc.data() });
      });
      // Shuffle the array to display randomized concerts
      const shuffledConcerts = concertsArray.sort(() => Math.random() - 0.5);
      setConcerts(shuffledConcerts);
      setLoading(false);
    };

    fetchConcerts();
  }, []);

  const handleAddToBucketList = async (concertId) => {
    if (!currentUser) {
      console.error("No user logged in");
      return;
    }

    // Fetch the current user's bucket list
    const userDocRef = doc(db, 'bucketlists', currentUser.uid);
    const userDocSnapshot = await getDocs(userDocRef);
    let bucketList = [];

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      bucketList = userData.bucketList || [];
    }

    // Check if the concert is already in the bucket list
    if (bucketList.find((concert) => concert.id === concertId)) {
      alert('This concert is already in your bucket list!');
      return;
    }

    // Find the concert data
    const selectedConcert = concerts.find((concert) => concert.id === concertId);

    // Add the concert to the bucket list
    bucketList.push(selectedConcert);

    // Update the user's bucket list in Firestore
    await setDoc(userDocRef, { bucketList }, { merge: true });

    alert('Concert added to your bucket list!');
  };

  const renderConcerts = () => {
    if (loading) {
      return <p>Loading concerts...</p>;
    }

    if (concerts.length === 0) {
      return <p>No concerts found.</p>;
    }

    return (
      <ul>
        {concerts.map((concert) => (
          <li key={concert.id}>
            <h2>{concert.artist}</h2>
            <p>Venue: {concert.venue}</p>
            <p>Date: {concert.date}</p>
            <button onClick={() => handleAddToBucketList(concert.id)}>Add to Bucket List</button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Layout>
      <div>
        <h1>Discover Concerts</h1>
        {renderConcerts()}
      </div>
    </Layout>
  );
};

export default Discover;
