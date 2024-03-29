// Imports
import { useState } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, useAuth } from '../../firebase';
import Layout from '../../components/Layout';
import CreatableSelect from 'react-select/creatable';
import genres from '../../components/genres';
import './create.css';
import { v4 as uuidv4 } from 'uuid';

/**
 * CreatePost component allows users to create a new post by entering details such as artist, venue, date, set list, rating, review, genres, and an image.
 * It uses firebase for storage and authentication, and react-select for genre selection.
 */
const CreatePost = () => {
  // Authentication and loading state
  const { currentUser, loading } = useAuth();

  // State hooks for post creation form
  const [artist, setArtist] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [setList, setSetList] = useState([]);
  const [newSong, setNewSong] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [genresSelected, setGenresSelected] = useState([]);
  const [file, setFile] = useState(null);
  const router = useRouter();

  /**
   * Handles the change event on the genre selection.
   * @param newValue The new value of the genre selection.
   * @param actionMeta Additional information about the action.
   */
  const handleGenreChange = (newValue, actionMeta) => {
    setGenresSelected(newValue || []);
  };

  /**
   * Asynchronously uploads the selected image file to Firebase storage.
   * @param file The file to upload.
   * @returns A promise that resolves with the download URL of the uploaded image.
   */
  const uploadImage = async (file) => {
    if (!file) return null;

    const uniqueFilename = `${currentUser.uid}/${uuidv4()}-${file.name}`;
    const imageRef = ref(storage, `postImages/${uniqueFilename}`);
    await uploadBytes(imageRef, file);
    return getDownloadURL(imageRef);
  };

  /**
   * Handles the submit event of the post creation form. It uploads the image (if any), and saves the post details to Firestore.
   * @param e The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    if (!currentUser) {
      console.error("No user logged in");
      return;
    }

    let imageUrl = '';
    if (file) {
      imageUrl = await uploadImage(file);
    }

    const genresToSave = genresSelected.map(genre => genre.label);

    try {
      await addDoc(collection(db, "posts"), {
        artist,
        venue,
        date,
        setList,
        rating,
        review,
        genres: genresToSave,
        imageUrl,
        userId: currentUser.uid,
        displayName: currentUser.displayName,
        likes: [],
      });

      router.push('/profile/view');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  /**
   * Handles file selection change, validating the file type and size.
   * @param event The change event from the file input.
   */
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

  /**
   * Adds a new song to the set list.
   */
  const handleAddSong = () => {
    if (newSong.trim() !== '') {
      setSetList(currentList => [...currentList, newSong]);
      setNewSong('');
    }
  };

  /**
   * Deletes a song from the set list by index.
   * @param index The index of the song to delete.
   */
  const handleDeleteSong = (index) => {
    setSetList(currentList => currentList.filter((_, i) => i !== index));
  };

  /**
   * Resets all form fields to their initial state.
   */
  const handleClear = () => {
    setArtist('');
    setVenue('');
    setDate('');
    setSetList([]);
    setNewSong('');
    setRating(0);
    setReview('');
    setGenresSelected([]);
    setFile(null);
  };

  if (loading) return <Layout>Loading...</Layout>;

  // JSX for the component's UI
  return (
    <Layout>
    <div className='post-container'>
      <form onSubmit={handleSubmit}>
        <div className='post-section'>
          <h1>Create A New Post</h1>
        </div>
        <div>
          <label htmlFor="artist">Artist:</label>
          <input
            className='input'
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
            className='input'
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
            className='input-date'
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
            <div>
                <label htmlFor="newSong">Set List:</label>
            </div>
          <input
            className='input-setlist'
            id="newSong"
            type="text"
            value={newSong}
            onChange={(e) => setNewSong(e.target.value)}
          />
          <button className="setlist-btns" type="button" onClick={handleAddSong}>Add Song</button>
          <ul className='setlist'>
            {setList.map((song, index) => (
              <li key={index}>{song} <button className="delete-btn" type="button" onClick={() => handleDeleteSong(index)}>Delete</button></li>
            ))}
          </ul>
        </div>
        <div>
          <label htmlFor="rating">Rating (1-5):</label>
          <input
            className='input-rating'
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
          <div>
            <label htmlFor="review">Review:</label>
          </div>
          <textarea
            className='input-review'
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="genres">Genre:</label>
          <CreatableSelect
            className='input-genre'
            id="genres"
            isMulti
            onChange={handleGenreChange}
            options={genres}
            value={genresSelected}
            placeholder="Select or create genres..."
          />
        </div>
        <div>
          <div>
            <label htmlFor="file">Upload Photo:</label>
          </div>
          <input
            className='input-photo'
            id="file"
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <div className='post-section'>
          <button className="create-btn" type="button" onClick={handleClear}>Clear</button>
          {/*<button className="create-btn" type="button" onClick={() => router.push('/profile/view')}>Cancel</button> */}
          <button className="create-btn" type="submit">Create Post</button></div>
      </form>
    </div>
    </Layout>
  );
};

export default CreatePost;
