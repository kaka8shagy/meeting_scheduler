import React from 'react';

import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <nav className="flex justify-between">
                <div>
                    <Link to="/">Home</Link>
                </div>
                <div className="flex gap-10">
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                </div>
            </nav>
        </header>
    );
};

export default Header; 