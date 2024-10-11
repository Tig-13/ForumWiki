import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    return (
        <header className="flex flex-col md:flex-row items-center justify-between px-4 py-3 bg-gray-100 shadow-md">
            <div className="flex items-center justify-between w-full md:w-auto mr-4">
                <Link to="/" className="text-2xl font-bold text-gray-600 hover:text-gray-500 transition-colors duration-300">
                    ForumWiki
                </Link>
                <button
                    className="text-gray-600 md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
            <nav className={`md:flex ${isMenuOpen ? 'flex' : 'hidden'} flex-col md:flex-row md:items-center md:gap-6 w-full`}>
                <ul className="flex flex-col md:flex-row gap-4 text-lg md:w-auto">
                    <li><Link to="/" className="text-gray-700 hover:text-gray-500 transition-colors duration-300">Home</Link></li>
                    <li><Link to="/categories" className="text-gray-700 hover:text-gray-500 transition-colors duration-300">Categories</Link></li>
                    {user.role === 'Admin' && (
                        <li><Link to="/manage-users" className="text-gray-700 hover:text-gray-500 transition-colors duration-300">Manage Users</Link></li>
                    )}
                </ul>

                <ul className="flex flex-col md:flex-row gap-4 ml-auto text-lg items-center md:justify-end md:w-auto">
                    {user.username === 'Guest' ? (
                        <>
                            <li><Link to="/login" className="text-gray-700 hover:text-gray-500 transition-colors duration-300">Login</Link></li>
                            <li><Link to="/register" className="text-gray-700 hover:text-gray-500 transition-colors duration-300">Register</Link></li>
                        </>
                    ) : (
                        <li><button onClick={handleLogout} className="text-gray-700 hover:text-gray-500 transition-colors duration-300">Logout</button></li>
                    )}
                    <li className="text-gray-400 text-sm">{user.username} ({user.role})</li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
