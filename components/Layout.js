// components/Layout.js
// this is the layout component, mainly it format the navbar
// use this wrapper in your page to make a navbar appear there
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            {/* Footer */}
        </>
    );
};

export default Layout;
