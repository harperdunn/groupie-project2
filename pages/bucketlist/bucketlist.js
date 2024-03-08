import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, useAuth } from '../../firebase';
import Layout from '../../components/Layout';

const CreateBucketList = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [bucketList, setBucketList] = useState([]);
  const [newArtist, setNewArtist] = useState('');
  const [file, setFile] = useState(null); 
  const router = useRouter();

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
        setBucketList(bucketList);
      } else {
        console.log("No existing bucket list");
      }
    };

    fetchBucketList();
  }, [currentUser, authLoading, router]);

  useEffect(() => {
    if (currentUser && bucketList.length > 0) {
      const updateBucketList = async () => {
        const bucketListRef = doc(db, "bucketlists", currentUser.uid);
        await setDoc(bucketListRef, { bucketList }, { merge: true });
      };

      updateBucketList().catch(console.error);
    }
  }, [bucketList, currentUser]);

  const uploadImage = async (file, imageName) => {
    const imageRef = ref(storage, `bucketListImages/${currentUser.uid}/${imageName}`);
    await uploadBytes(imageRef, file);
    return getDownloadURL(imageRef);
  };

  const handleAddArtist = async () => {
    if (newArtist.trim() !== '') {
      let imageUrl = '';
      if (file) {
        imageUrl = await uploadImage(file, newArtist);
      }
      setBucketList(currentList => [...currentList, { name: newArtist, imageUrl, watched: false }]);
      setNewArtist('');
      setFile(null);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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
        <input
          type="file"
          onChange={handleFileChange}
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
              {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: 50, height: 50 }} />}
              <button type="button" onClick={() => handleDeleteArtist(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default CreateBucketList;
