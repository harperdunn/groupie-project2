import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useRouter } from "next/router";
import Layout from '../../components/Layout';
import './search.css';

const search = () => {
  const [posts, setPosts] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filterCategories, setFilterCategories] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

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
    setFilterCategories(['artist', 'venue', 'genre', 'displayName']);
  }, []);

  const router = useRouter();
    const navigateToPost = (postId) => {
    router.push(`/post/${postId}`);
    };

  const handleFilterSearch = searchInput => {
    setSearchResult([]);
    if (searchInput === undefined || searchInput == null || (searchInput !== null && searchInput.trim() === "")) {
      return;
    }
    for (const post of posts) {
      if (selectedFilter === null) {
        for (const filterCategory of filterCategories) {
          if (post[filterCategory] && post[filterCategory].toLowerCase().includes(searchInput.toLowerCase())) {
            setSearchResult((prevResults) => [...prevResults, post]);
            break;
          }
        }
      } else if (post[selectedFilter] && post[selectedFilter].toLowerCase().includes(searchInput.toLowerCase())) {
        setSearchResult((prevResults) => [...prevResults, post]);
      }
    }
    setSearchPerformed(true);
  };

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

  function showPostsSearchList(searchResultList) {
    const sortedResults = searchResultList.slice().sort((a, b) => b.likes.length - a.likes.length);

    return (
      sortedResults.map((result) => (
        <div>
        <div key={result.id} className='search-post-thumbnail' onClick={() => navigateToPost(id)}>
          <h2>{result.artist}</h2>
          <p>Date: {result.date}</p>
          <p>Venue: {result.venue}</p>
          <p>Rating: {Array(result.rating).fill('★').join('')} ({result.rating}/5)</p>
          <p>Author: {(result.displayName)}</p>
          <p>{result.likes.length} {result.likes.length === 1 ? 'Like': 'Likes'}</p>
        </div>
        </div>
      ))
    );
  }

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      handleFilterSearch(searchTerm);
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
        <h2>Filter your search by...</h2>
        <div className='filter-container'>
          {renderCheckboxFilters(['artist', 'venue', 'genre', 'displayName'])}
        </div>
        </div>
        <div className='search-posts-container'>
            {searchPerformed && searchResult.length === 0 ? <p>No results!</p> : showPostsSearchList(searchResult)}
        </div>
    </Layout>
  );
}

export default search;
