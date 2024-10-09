import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Categories from './components/Categories';
import Posts from './components/Posts';
import Register from './components/Register';
import AddCategory from './components/AddCategory';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';

const App = () => {
    const [user, setUser] = useState({});
    const [log, setLog] = useState('');
    const [logsVisible, setLogsVisible] = useState(false);

    const appendLog = (message) => {
        setLog(prevLog => `${prevLog}\n${message}`);
    };

    useEffect(() => {
        appendLog('App component mounted');
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            appendLog(`User loaded from localStorage: ID=${storedUser.id}, Username=${storedUser.username}`);
            setUser(storedUser);
        } else {
            appendLog('No stored user, setting guest user');
            setUser({ id: 0, username: 'Guest', role: 'Guest' });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser({ id: 0, username: 'Guest', role: 'Guest' });
        appendLog('User logged out');
    };

    return (
        <Router>
            <div className="flex flex-col border border-gray-300 bg-gray-100 gap-4 p-6 rounded-lg shadow-md min-h-screen">
                <Header user={user} onLogout={handleLogout} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/categories" element={<Categories user={user} />} />
                    <Route path="/categories/:categoryId/posts" element={<Posts user={user} />} />
                    <Route path="/login" element={<Login setUser={setUser} appendLog={appendLog} log={log} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/add-category" element={<PrivateRoute user={user} element={<AddCategory />} />} />
                </Routes>

                <button
                    disabled={log === ''}
                    onClick={() => setLogsVisible(!logsVisible)}
                    className={`mt-4 bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-300 ease-in-out ${log === '' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`}
                >
                    {logsVisible ? 'Hide Logs' : 'Show Logs'}
                </button>
                {logsVisible && (
                    <textarea
                        value={log}
                        readOnly
                        rows="20"
                        cols="80"
                        style={{ marginTop: '2px', width: '100%', height: '300px' }}
                    />
                )}
            </div>
        </Router>
    );
};

export default App;
