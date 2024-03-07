import './bucketlist';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID'
  });
}

const db = firebase.firestore();

export default function Checklist() {
  const [artists, setArtists] = useState([]);
  const [newArtist, setNewArtist] = useState('');

  useEffect(() => {
    const unsubscribe = db.collection('artists').onSnapshot(snapshot => {
      const artistsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setArtists(artistsData);
    });

    return () => unsubscribe();
  }, []);

  const addArtist = async () => {
    if (newArtist.trim() === '') return;

    await db.collection('artists').add({
      name: newArtist,
      checked: false
    });
    setNewArtist('');
  };

  const toggleArtist = async (id, checked) => {
    await db.collection('artists').doc(id).update({
      checked: !checked
    });
  };

  return (
    <layout>
    <div>
      <h1>Checklist</h1>
      <div>
        <input
          type="text"
          value={newArtist}
          onChange={e => setNewArtist(e.target.value)}
          placeholder="Enter artist name"
        />
        <button onClick={addArtist}>Add Artist</button>
      </div>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            <input
              type="checkbox"
              checked={artist.checked}
              onChange={() => toggleArtist(artist.id, artist.checked)}
            />
            <span style={{ textDecoration: artist.checked ? 'line-through' : 'none' }}>
              {artist.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
    </layout>
  );
}

