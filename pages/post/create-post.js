import { useState } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc } from 'firebase/firestore';
import { db, useAuth } from '../../firebase'; 
import Layout from '../../components/Layout';

const CreatePost = () => {
  const { currentUser, loading } = useAuth(); // Use the useAuth hook
  const [artist, setArtist] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [setList, setSetList] = useState([]);
  const [newSong, setNewSong] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [genres, setGenres] = useState([]);
  const router = useRouter();

  const genreOptions = ['Rock', 'Pop', 'Jazz', 'Hip-Hop', 'Classical', 'Electronic', 'Folk', 'Reggae', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (loading) return; 
    if (!currentUser) {
      console.error("No user logged in");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        artist,
        venue,
        date,
        setList,
        rating,
        review,
        genres,
        userId: currentUser.uid, // Use the UID from currentUser provided by useAuth
      });

      router.push('/post/create-post');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleAddSong = () => {
    if (newSong.trim() !== '') {
      setSetList(currentList => [...currentList, newSong]);
      setNewSong('');
    }
  };

  const handleDeleteSong = (index) => {
    setSetList(currentList => currentList.filter((_, i) => i !== index));
  };

  const handleGenreChange = (e) => {
    const selectedGenres = Array.from(e.target.selectedOptions, option => option.value);
    setGenres(selectedGenres);
  };

  

  if (loading) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <h1>Create Post</h1>
        <div>
          <label htmlFor="artist">Artist:</label>
          <input
            id="artist"
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="venue">Venue:</label>
          <input
            id="venue"
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="newSong">Add Song to Set List:</label>
          <input
            id="newSong"
            type="text"
            value={newSong}
            onChange={(e) => setNewSong(e.target.value)}
          />
          <button type="button" onClick={handleAddSong}>Add Song</button>
          <ul>
            {setList.map((song, index) => (
              <li key={index}>{song} <button type="button" onClick={() => handleDeleteSong(index)}>Delete</button></li>
            ))}
          </ul>
        </div>
        <div>
          <label htmlFor="rating">Rating (1-5):</label>
          <input
            id="rating"
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="review">Review:</label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="genres">Genres:</label>
          <select
            id="genres"
            multiple
            value={genres}
            onChange={handleGenreChange}
            size="5"
            style={{ width: '100%', padding: '8px', marginTop: '8px' }}
          >
            {genreOptions.map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <p>Hold down the Ctrl (windows) / Command (Mac) button to select multiple options.</p>
        </div>
        <button type="submit">Create Post</button>
      </form>
    </Layout>
  );
};

export default CreatePost;
