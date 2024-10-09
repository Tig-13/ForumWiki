import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();  
        navigate('/');  
    };

    return (
        <header className="flex flex-row items-center gap-4">
            <Link to="/" className="text-2xl font-bold text-gray-600 hover:text-gray-500 transition-colors duration-300">
                ForumWiki
            </Link>
            <nav className="flex flex-row gap-4 w-full items-center">
             
                <ul className="flex flex-row list-none gap-4 text-lg">
                    <li><Link to="/" className="text-gray-700 hover:text-gray-500 transition-colors duration-300">Home</Link></li>
                    <li><Link to="/categories" className="text-gray-700 hover:text-gray-500 transition-colors duration-300">Categories</Link></li>
                    {user.role === 'Admin' && (
                        <li><Link to="/manage-users" className="text-gray-700 hover:text-gray-500 transition-colors duration-300">Manage Users</Link></li>
                    )}
                </ul>

         
                <ul className="flex flex-row list-none gap-4 ml-auto text-lg items-center">
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
