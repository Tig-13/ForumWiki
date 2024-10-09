import React, { useState, useEffect } from 'react';
import api from '../api';

const ManageUsers = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users'); // Убрали /api
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('Error fetching users');
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/users/${id}/role`, { role }); // Убрали /api
      setMessage('Role updated successfully');
      fetchUsers(); // Обновляем список пользователей после изменения
    } catch (error) {
      console.error('Error updating role:', error);
      setMessage('Error updating role');
    }
  };

  const handleUsernameChange = async (id, username) => {
    try {
      await api.put(`/users/${id}`, { username }); // Убрали /api
      setMessage('Username updated successfully');
      fetchUsers(); // Обновляем список пользователей после изменения
    } catch (error) {
      console.error('Error updating username:', error);
      setMessage('Error updating username');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`); // Убрали /api
      setMessage('User deleted successfully');
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage('Error deleting user');
    }
  };

  return (
    <div>
      <h2>Manage Users</h2>
      {message && <p>{message}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <span>{user.username} ({user.role})</span>
            <input
              type="text"
              value={user.username}
              onChange={(e) => handleUsernameChange(user.id, e.target.value)} // Обработчик изменения имени
            />
            <select
              value={user.role}
              onChange={(e) => handleRoleChange(user.id, e.target.value)} // Обработчик изменения роли
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="Guest">Guest</option>
            </select>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;
