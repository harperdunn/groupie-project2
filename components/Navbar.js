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
        <nav className="navbar">
            <div>
                <Link href="/profile/edit">Profile</Link>
            </div>
            <div>
                <Link href="/bucketlist/bucketlist">Bucket List</Link>
            </div>
            <div>
                <Link href="/post/create-post">Create New Post</Link>
            </div>
            <div>
                <Link href="/post/view-post">View Posts</Link>
            </div>
            <div>
                <Link href="/search/search">Search</Link>
            </div>
            <div>
                <Link href="/discover/discover">Discover</Link>
            </div>
            <div>
                <button onClick={handleSignOut} className="hover:underline ">Sign Out</button>
            </div>
        </nav>
    );
};

export default Navbar;
