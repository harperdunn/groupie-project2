// components/Navbar.js
// this is the navbar component, add links here to make them appear
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
            <Link href="/profile/edit">Profile</Link>
            <Link href="/bucketlist/bucketlist">Bucket List</Link>
            <Link href="/post/post">Create New Post</Link>
            <Link href="/search/search">Search</Link>
            <Link href="/discover/discover">Discover</Link>
            <button onClick={handleSignOut} className="hover:underline ">
            Sign Out
            </button>
        </nav>
    );
};

export default Navbar;
