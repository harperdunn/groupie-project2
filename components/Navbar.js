// components/Navbar.js
// this is the navbar component, add links here to make them appear
import './navbar.css';
import Link from 'next/link';
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from 'react';
import { useRouter } from "next/router";

const Navbar = () => {
    const router = useRouter();
    const [user, loading] = useAuthState(auth);

    const handleSignOut = async () => {
        await auth.signOut();
        router.push('/');
    };

    return (
        <nav className='navbar'>
                <Link className='navbar-link' href="/profile/edit">Profile</Link>
                <Link className='navbar-link' href="/bucketlist/bucketlist">Bucket List</Link>
                <Link className='navbar-link' href="/post/create-post">Create New Post</Link>
                <Link className='navbar-link' href="/search/search">Search</Link>
                <Link className='navbar-link' href="/discover/discover">Discover</Link>
                <button onClick={handleSignOut} className="signout-button">Sign Out</button>
        </nav>
    );
};

export default Navbar;