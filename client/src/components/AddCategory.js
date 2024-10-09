import React, { useState } from 'react';
import api from '../api';

const AddCategory = ({ user }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  if (user.role !== 'Admin') {
    return <p>Only admins can add categories.</p>; // Скрывает форму для всех, кроме администраторов
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/category', { name });
      setMessage('Category added successfully');
      setName('');
    } catch (error) {
      setMessage('Error adding category');
      console.error('Error adding category:', error);
    }
  };

  return (
    <div>
      <h2>Add Category</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Category Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          required
        />
        <button type="submit">Add Category</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddCategory;
