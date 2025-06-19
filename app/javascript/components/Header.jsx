import React from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

const Header = () => {
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            // Get CSRF token from meta tag
            const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            await axios.delete('/logout', {
                headers: {
                    'X-CSRF-Token': token,
                    'Accept': 'text/html',
                },
            });
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