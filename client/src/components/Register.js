import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('User');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            const response = await api.post('/user/register', { username, password, role });

            if (response && response.data) {
                setSuccessMessage('Registration successful! You can now log in.');
            }

            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setRole('User');
            navigate('/login');
        } catch (error) {
            console.error('Registration Error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Registration failed');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Register</h2>
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
                <label className="text-lg text-gray-700">
                    Confirm Password:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="border border-gray-300 rounded-lg py-2 px-4 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 ease-in-out mt-1"
                    />
                </label>
                <label className="text-lg text-gray-700">
                    Role:
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)} 
                        required
                        className="border border-gray-300 rounded-lg py-2 px-4 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 ease-in-out mt-1"
                    >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>
                </label>
                <button
                    type="submit"
                    className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300 ease-in-out"
                >
                    Register
                </button>
            </form>
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
            <p className="mt-4 text-gray-600">
                Already have an account?{' '}
                <button
                    onClick={() => navigate('/login')}
                    className="text-blue-500 hover:text-blue-600 transition-colors duration-300 ease-in-out"
                >
                    Log in here
                </button>
            </p>
        </div>
    );
};

export default Register;
