// components/Layout.js
// this is the layout component, mainly it formats the navbar
// use this wrapper in your page to make a navbar appear there
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className='page-wrapper'>
            <Navbar />
            <div className='main-content'>{children}</div>
            {/* Footer */}
        </div>
    );
};

export default Layout;
