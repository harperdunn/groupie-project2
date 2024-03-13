import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, useAuth } from '../../firebase';
import Layout from '../../components/Layout';
import './bucketlist.css';

const CreateBucketList = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [bucketList, setBucketList] = useState([]);
  const [newArtist, setNewArtist] = useState('');
  const [file, setFile] = useState(null);
  const router = useRouter();
  const fileInputRef = useRef(null);

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
        setBucketList(bucketList.map(({ name, imageUrl, watched }) => ({ name, imageUrl, watched })));
      } else {
        console.log("No existing bucket list");
      }
    };

    fetchBucketList();
  }, [currentUser, authLoading, router]);

  const updateFirebaseBucketList = async (updatedList) => {
    const bucketListRef = doc(db, "bucketlists", currentUser.uid);
    await setDoc(bucketListRef, { bucketList: updatedList }, { merge: true });
  };

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
      const updatedList = [...bucketList, { name: newArtist, imageUrl, watched: false }];
      setBucketList(updatedList);
      await updateFirebaseBucketList(updatedList);
      setNewArtist('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const toggleWatched = (index) => {
    const updatedList = bucketList.map((item, i) => 
      i === index ? { ...item, watched: !item.watched } : item
    );
    setBucketList(updatedList);
    updateFirebaseBucketList(updatedList);
  };

  const handleDeleteArtist = async (index) => {
    const updatedList = bucketList.filter((_, i) => i !== index);
    setBucketList(updatedList);
    await updateFirebaseBucketList(updatedList);
  };

  if (authLoading) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <div className='bucketlist-container'>
        <div className='bucketlist'>
          <h1>Your Bucket List:</h1>
          <ul>
            {bucketList.map((item, index) => (
              <li key={index}>
                <div className='list-item'>
                  <div 
                    className='artist-name'
                    onClick={() => toggleWatched(index)}
                    style={{ textDecoration: item.watched ? 'line-through' : 'none' }}
                  >
                    {item.name}
                  </div>
                  <button className="delete-BL" onClick={() => handleDeleteArtist(index)}>Delete</button>
                </div>
                <div>
                  {item.imageUrl && <img className='img-BL' src={item.imageUrl} alt={item.name} />}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Add an artist to your bucket list:</h2>
        </div>
        <input
          className='input-bucketlist'
          id="newArtist"
          type="text"
          placeholder="Artist's name..."
          value={newArtist}
          onChange={(e) => setNewArtist(e.target.value)}
        />
        <div>
          <h2>Add a photo of the artist or their album art:</h2>
          <input
            className='input-bucketlist'
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>
        <button className="add-btn" type="button" onClick={handleAddArtist}>Add</button>
      </div>
    </Layout>
  );
};

export default CreateBucketList;
