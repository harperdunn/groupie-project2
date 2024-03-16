// components/Navbar.js
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
                <Link className='navbar-link' href="/profile/view"><img className="navbar-icon" src="/Profile Icon.png" /></Link>
                <Link className='navbar-link' href="/bucketlist/bucketlist"><img className="navbar-icon" src="/Bucket List Icon.png" /></Link>
                <Link className='navbar-link' href="/post/likes"><img className="navbar-icon" src="/White Heart Icon.png" /></Link>
                <Link className='navbar-link' href="/post/create"><img className="navbar-icon" src="/Post Icon.png" /></Link>
                <Link className='navbar-link' href="/search/search"><img className="navbar-icon" src="/Search Icon.png" /></Link>
                <Link className='navbar-link' href="/discover/discover"><img className="navbar-icon" src="/Globe Icon.png" /></Link>
                <Link className='navbar-link' href="/info/info"><img className="navbar-icon" src="/Info Icon.png" /></Link>                
                <button onClick={handleSignOut} className="signout-button"><img className="navbar-icon" src="/Signout Icon.png" /></button>
        </nav>
    );
};

export default Navbar;
