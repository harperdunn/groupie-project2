// components/Navbar.js
// this is the navbar component, add links here to make them appear
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link href="/profile/edit">Profile</Link>
        </nav>
    );
};

export default Navbar;
