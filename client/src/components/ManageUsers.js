import React, { useState, useEffect } from 'react';
import api from '../api';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'User' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/user');
            setUsers(response.data);
        } catch (error) {
            setMessage('Error fetching users');
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/user/${id}`);
                setMessage('User deleted successfully');
                fetchUsers();
            } catch (error) {
                setMessage('Error deleting user');
            }
        }
    };

    const editUser = (user) => {
        setEditingUser(user);
    };

    const updateUser = async () => {
        try {
            await api.put(`/user/${editingUser.id}`, {
                username: editingUser.username,
                role: editingUser.role,
            });
            setMessage('User updated successfully');
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            setMessage('Error updating user');
        }
    };

    const addUser = async () => {
        try {
            await api.post('/user/register', newUser);
            setMessage('User added successfully');
            setNewUser({ username: '', password: '', role: 'User' });
            fetchUsers();
        } catch (error) {
            setMessage('Error adding user');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">Manage Users</h2>
            {message && <p className="text-red-500 mb-4">{message}</p>}

            {/* Форма для добавления нового пользователя */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Add New User</h3>
                <div className="grid grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        className="border border-gray-300 rounded-lg py-2 px-4 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="border border-gray-300 rounded-lg py-2 px-4 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="border border-gray-300 rounded-lg py-2 px-4 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <button
                        onClick={addUser}
                        className="col-span-3 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                    >
                        Add User
                    </button>
                </div>
            </div>

            {/* Таблица пользователей */}
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Users</h3>
            <table className="w-full table-auto border-collapse bg-gray-50 shadow-md">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4 border">Username</th>
                        <th className="py-2 px-4 border">Role</th>
                        <th className="py-2 px-4 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="bg-white">
                            <td className="py-2 px-4 border">{user.username}</td>
                            <td className="py-2 px-4 border">{user.role}</td>
                            <td className="py-2 px-4 border">
                                <button
                                    onClick={() => editUser(user)}
                                    className="bg-gray-500 text-white font-semibold py-1 px-3 rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    className="bg-red-500 text-white font-semibold py-1 px-3 ml-4 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Форма редактирования пользователя */}
            {editingUser && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Edit User</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <input
                            type="text"
                            value={editingUser.username}
                            onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                            className="border border-gray-300 rounded-lg py-2 px-4 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            value={editingUser.role}
                            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                            className="border border-gray-300 rounded-lg py-2 px-4 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>
                        <button
                            onClick={updateUser}
                            className="col-span-3 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                        >
                            Update User
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
