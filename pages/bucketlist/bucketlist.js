import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, useAuth } from '../../firebase';
import Layout from '../../components/Layout';
import { v4 as uuidv4 } from 'uuid';
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
    if (!file) return null;

    const uniqueFilename = `${currentUser.uid}/${uuidv4()}-${imageName}`;

    const imageRef = ref(storage, `bucketListImages/${uniqueFilename}`);
    await uploadBytes(imageRef, file);
    return getDownloadURL(imageRef);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxFileSize = 5 * 1024 * 1024; // 5 MB

    if (!file) {
      alert('No file selected.');
      return;
    }

    if (!validTypes.includes(file.type)) {
      alert('Invalid file type. Please select an image (JPEG, PNG, GIF).');
      return;
    }

    if (file.size > maxFileSize) {
      alert('File is too large. Please upload files less than 5MB.');
      return;
    }

    setFile(file);
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

  const toggleWatched = (index) => {
    const updatedList = bucketList.map((item, i) => 
      i === index ? { ...item, watched: !item.watched } : item
    );
    setBucketList(updatedList);
    updateFirebaseBucketList(updatedList);
  };

  const handleDeleteArtist = async (index) => {
    const artistToDelete = bucketList[index];
    const updatedList = bucketList.filter((_, i) => i !== index);
    setBucketList(updatedList);
    await updateFirebaseBucketList(updatedList);
  
    if (artistToDelete.imageUrl) {
      const imageRef = ref(storage, artistToDelete.imageUrl);
      deleteObject(imageRef).then(() => {
        console.log("Image successfully deleted from storage.");
      }).catch((error) => {
        console.error("Error removing image from storage:", error);
      });
    }
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
                    {item.imageUrl && <img className='img-BL' src={item.imageUrl} alt={item.name} />}
                  </div>
                  <button className="delete-BL" onClick={() => handleDeleteArtist(index)}>Delete</button>
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
