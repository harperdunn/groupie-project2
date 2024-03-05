import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from 'react';
import { useRouter } from "next/router";
import './loggedin.css';

const Loggedin = () => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
  };
  
  useEffect(() => {
    const handleNavigationClick = (event) => {
      const target = event.target;
      const href = target.getAttribute('href');

      if (href && href.startsWith('http')) {
        return; // Allow normal navigation for external links
      }

      event.preventDefault();
      if (href) {
        window.location.href = href;
      }
    };

    document.addEventListener('click', handleNavigationClick);

    return () => {
      document.removeEventListener('click', handleNavigationClick);
    };
  }, []);

  return (
    <div>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Groupie</title>
        <link rel="stylesheet" href="homepage.css" />
      </head>
      <body>
        <header>
          <h1>GROUPIE</h1>
          <nav>
            <ul>
              <li><a href="home.html">Home</a></li>
              <li><a href="about.html">About</a></li>
              <li><a href="search.html">Search</a></li>
              <li><a href="bucketlist.html">Bucket List</a></li>
              <li><a href="post.html">Post</a></li>
              <li><a href="profile.html">Profile</a></li>
              <li><a href="followers.html">Followers</a></li>
            </ul>
          </nav>
        </header>

        <main>
          <section>
            <h2>About Us</h2>
            <p>Welcome! Groupie is a platform tailored for concert enthusiasts. Users can create and interact with posts, sharing details such as the artist, venue, date, setlist, rating, and caption. Interaction includes liking and commenting, with the ability to follow other users. Personal profiles showcase top artists and recent activity.</p>
          </section>
        </main>

        <footer>
          <p>&copy; 2024 Groupie. All rights reserved.</p>
        </footer>
      </body>
      <button onClick={handleSignOut} className="hover:underline ">
        Sign Out
      </button>
    </div>
  );
};
export default Loggedin;
