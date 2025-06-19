import React from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';
import { logout } from './api';

const Header = () => {
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await logout();
            window.location.href = '/login';
        } catch (error) {
            alert('Logout failed.');
        }
    };

    return (
        <header>
            <nav className="flex justify-between">
                <div>
                    <Link to="/">Home</Link>
                </div>
                <div className="flex gap-10">
                    {/* <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link> */}
                    <button type="button" href="#" onClick={handleLogout}>Logout</button>
                </div>
            </nav>
        </header>
    );
};

export default Header; 