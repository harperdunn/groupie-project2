import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, useAuth } from '../../firebase';
import Layout from '../../components/Layout';

const CreateBucketList = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [bucketList, setBucketList] = useState([]);
  const [newArtist, setNewArtist] = useState('');
  const router = useRouter();

  // Fetch user's bucket list on login
  useEffect(() => {
    if (!currentUser) {
      if (!authLoading) {
        router.push('/');
      }
      return;
    }

    const fetchBucketList = async () => {
      const bucketListRef = doc(db, "bucketlists", currentUser.uid);
      const docSnap = await getDoc(bucketListRef);

      if (docSnap.exists()) {
        const { bucketList } = docSnap.data();
        setBucketList(bucketList.map(name => ({ name, watched: false })));
      } else {
        console.log("No existing bucket list");
      }
    };

    fetchBucketList();
  }, [currentUser, authLoading, router]);

  // Update Firestore document on bucketList state change
  useEffect(() => {
    if (currentUser && bucketList.length > 0) {
      const updateBucketList = async () => {
        const bucketListRef = doc(db, "bucketlists", currentUser.uid);
        await setDoc(bucketListRef, { bucketList: bucketList.map(item => item.name) }, { merge: true });
      };

      updateBucketList().catch(console.error);
    }
  }, [bucketList, currentUser]);

  const handleAddArtist = () => {
    if (newArtist.trim() !== '') {
      setBucketList(currentList => [...currentList, { name: newArtist, watched: false }]);
      setNewArtist('');
    }
  };

  const handleToggleWatched = (index) => {
    setBucketList(currentList => currentList.map((item, i) => 
      i === index ? { ...item, watched: !item.watched } : item
    ));
  };

  const handleDeleteArtist = (index) => {
    setBucketList(currentList => currentList.filter((_, i) => i !== index));
  };

  if (authLoading) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <div>
        <label htmlFor="newArtist">Add Artist to Bucket List:</label>
        <input
          id="newArtist"
          type="text"
          value={newArtist}
          onChange={(e) => setNewArtist(e.target.value)}
        />
        <button type="button" onClick={handleAddArtist}>Add to Bucket List</button>
        <ul>
          {bucketList.map((item, index) => (
            <li key={index}>
              <input
                type="checkbox"
                checked={item.watched}
                onChange={() => handleToggleWatched(index)}
              />
              {item.name}
              <button type="button" onClick={() => handleDeleteArtist(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default CreateBucketList;
