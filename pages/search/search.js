import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useRouter } from "next/router";
import Layout from '../../components/Layout';
import './search.css';

/**
 * The Search component allows users to search for posts based on various filter criteria.
 */
const Search = () => {
  const [posts, setPosts] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filterCategories, setFilterCategories] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  /**
   * Fetches all posts from the database on component mount.
   */
  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const postsArray = [];
      querySnapshot.forEach((doc) => {
        // Assumes that every document has the structure we expect
        postsArray.push({ id: doc.id, ...doc.data() });
      });
      setPosts(postsArray);
    };

    fetchPosts();
    setFilterCategories(['artist', 'venue', 'genres', 'displayName']);
  }, []);

  const router = useRouter();

  /**
   * Navigates to a specific post's page.
   * @param {string} postId - The ID of the post to navigate to.
   */
  const navigateToPost = (postId) => {
    router.push(`/post/${postId}`);
  };

  /**
   * Handles the search logic, filtering posts based on the selected filter and search term.
   * @param {string} searchInput - The current value of the search input field.
   */
  const handleFilterSearch = searchInput => {
    setSearchResult([]);
    if (searchInput === undefined || searchInput == null || (searchInput !== null && searchInput.trim() === "")) {
      return;
    }
    for (const post of posts) {
      if (selectedFilter === null) { //if no filter is selected, then iterate through each filter category to look for match or inclusion
        for (const filterCategory of filterCategories) {
          if (Array.isArray(post[filterCategory])){ //if "genres" category, iterate through the array of genres
            for(const genre of post[filterCategory]) {
              if(genre.toLowerCase().includes(searchInput.toLowerCase())) {
                setSearchResult((prevResults) => [...prevResults, post]);
                break;
              }
            }
          }
          else if (post[filterCategory] && post[filterCategory].toLowerCase().includes(searchInput.toLowerCase())) {
            setSearchResult((prevResults) => [...prevResults, post]);
            break;
          }
        }
      } 
      else if (Array.isArray(post[selectedFilter])) { //if "genres" category, iterate through the array of genres
        for (const genre of post[selectedFilter]) {
          if (genre.toLowerCase().includes(searchInput.toLowerCase())) {
            setSearchResult((prevResults) => [...prevResults, post]);
            break;
          }
        }
      }
      else if (post[selectedFilter] && post[selectedFilter].toLowerCase().includes(searchInput.toLowerCase())) {
        setSearchResult((prevResults) => [...prevResults, post]);
      }
    }
    setSearchPerformed(true);
  };

   /**
   * Renders checkbox filters for the search functionality.
   * @param {string[]} filterList - A list of filter categories.
   * @returns A list of checkbox inputs for filtering search results.
   */
  function renderCheckboxFilters(filterList) {
    return (
      filterList.map((filterItem) => (
        <div id={`${filterItem}-div`} key={filterItem}>
          <label>
            <input
              className='filter-item'
              id={`${filterItem}-checkbox`}
              type="checkbox"
              checked={selectedFilter === filterItem}
              onChange={() => {
                if (selectedFilter === filterItem) {
                  setSelectedFilter(null);
                } else {
                  setSelectedFilter(filterItem);
                }
              }}
            />
            {filterItem}
          </label>
        </div>
      ))
    );
  }

  /**
   * Renders the list of search results.
   * @param {Object[]} searchResultList - The list of filtered posts to be displayed.
   * @returns A list of div elements representing each post.
   */
  function showPostsSearchList(searchResultList) {
    const sortedResults = searchResultList.slice().sort((a, b) => b.likes.length - a.likes.length);

    return (
      sortedResults.map((result) => (
        <div key={result.id} className='search-post-thumbnail' onClick={() => navigateToPost(result.id)}>
          <h2>{result.artist}</h2>
          <p>Date: {result.date}</p>
          <p>Venue: {result.venue}</p>
          <p>Rating: {Array(result.rating).fill('★').join('')} ({result.rating}/5)</p>
          <p>Author: {result.displayName}</p>
          <p>{result.likes.length} {result.likes.length === 1 ? 'Like' : 'Likes'}</p>
        </div>
      ))
    );
  }

  /**
   * Triggers the search when the Enter key is pressed.
   * @param {React.KeyboardEvent} e - The keyboard event.
   */
  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      handleFilterSearch(searchTerm);
    }
  };

  //layout: search bar at the top, with checkboxes to filter by categories
  return (
    <Layout>
      <div className='search-container'>
        <h1>Looking for something?</h1>
        <div>
          <input
            className='input-search'
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter a search term..."
            onKeyDown={handleEnterPress}
          />
          <button className="search-btn" onClick={() => handleFilterSearch(searchTerm)}>Search</button>
        </div>
        <h2>Filter your search by...</h2>
        <div className='filter-container'>
          {renderCheckboxFilters(['artist', 'venue', 'genres', 'displayName'])}
        </div>
      </div>
      <div className='search-posts-container'>
        {searchPerformed && searchResult.length === 0 ? <p>No results!</p> : showPostsSearchList(searchResult)}
      </div>
    </Layout>
  );
}

export default Search;
