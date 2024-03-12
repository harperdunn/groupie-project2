import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import Layout from '../../components/Layout';
import './search.css';

const search = () => {
  const [posts, setPosts] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);

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
  }, []);


  /**
   * Based on the search input iterate through all posts and find the matching attribute value to the searched value.
   * If no filter attrtibute is selected, return all posts
   */
  const handleFilterSearch = searchInput => {
    // Reset search result just in case a subsequent search is performed
    setSearchResult([]);
    for (const post of posts) {
      if (selectedFilter === null || post[selectedFilter] === searchInput) {
        setSearchResult((prevResults) => [...prevResults, post]);
      }
    }
  }


// Render the checkboxes: artist, venue, genre, userid
function renderCheckboxFilters(filterList) {
    return (
        filterList.map((filterItem) => (
            <div id={`${filterItem}-div`}>
                <label>
                    <input
                        className='filter-item'
                        id={`${filterItem}-checkbox`}
                        type="checkbox"
                        checked={selectedFilter === filterItem}
                        onChange={() => setSelectedFilter(filterItem)} 
                    />
                    {filterItem}
                </label>
            </div>
        ))
    );
}

// Show the resulting list
    function showPostsSearchList(searchResultList) {
    return (
        searchResultList.map((result) => (
        <div key={result.id}>
            <h2>Artist: {result.artist}</h2>
            <p>Venue: {result.venue}</p>
            <p>Date: {result.date}</p>
            <h3>Set List:</h3>
            <ul>
            {result.setList && result.setList.map((song, index) => (
                <li key={index}>{song}</li>
                ))}
            </ul>
            <p>Rating: {Array(result.rating).fill('★').join('')} ({result.rating}/5)</p>
            <p>Review: {result.review}</p>
            <p>Author: {(result.displayName)}</p>   
        </div>
    ))
    );
}

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      handleFilterSearch();
    }
  };

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
            <h2>
                Filter your search by...
            </h2>
            <div className='filter-container'>
                {renderCheckboxFilters(['Artist', 'Venue', 'Genre', 'Display Name'])}
            </div>
            {searchResult.length > 0 ? showPostsSearchList(searchResult): null}
        </div>
    </Layout>
);
}

export default search;