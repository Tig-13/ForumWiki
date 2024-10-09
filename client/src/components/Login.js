import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = ({ setUser, appendLog }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        appendLog('Login process started...');
        try {
            const response = await api.post('/user/login', { username, password });
            appendLog(`Login response received with status: ${response.status}`);
            appendLog(`Response data: ${JSON.stringify(response.data)}`);

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                const userData = { id: response.data.id, username: response.data.username, role: response.data.role };
                localStorage.setItem('user', JSON.stringify(userData));
                appendLog(`User data to set: ${JSON.stringify(userData)}`);
                setUser(userData);
                navigate('/categories');
            } else {
                throw new Error('Invalid user data');
            }
        } catch (error) {
            appendLog(`Login failed: ${error.message}`);
            console.error('Login Error:', error);
            setErrorMessage('Invalid username or password');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Login</h2>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <label className="text-lg text-gray-700">
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="border border-gray-300 rounded-lg py-2 px-4 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 ease-in-out mt-1"
                    />
                </label>
                <label className="text-lg text-gray-700">
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border border-gray-300 rounded-lg py-2 px-4 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 ease-in-out mt-1"
                    />
                </label>
                <button
                    type="submit"
                    className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300 ease-in-out"
                >
                    Login
                </button>
            </form>
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            <p className="mt-4 text-gray-600">
                New user?{' '}
                <button
                    onClick={() => navigate('/register')}
                    className="text-blue-500 hover:text-blue-600 transition-colors duration-300 ease-in-out"
                >
                    Register here
                </button>
            </p>
        </div>
    );
};

export default Login;
