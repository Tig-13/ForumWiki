import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { CATEGORY_API } from '../tools/constants';

const Categories = ({ user }) => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editCategory, setEditCategory] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get(CATEGORY_API);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error.response ? error.response.data : error.message);
            setMessage('Error fetching categories');
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!user || user.role === 'Guest') {
            setMessage('Guests cannot add categories');
            return;
        }
        try {
            const response = await api.post(CATEGORY_API, { name: newCategory, userId: user.id });
            setCategories([...categories, response.data]);
            setNewCategory('');
            setMessage('Category added successfully');
        } catch (error) {
            console.error('Error adding category:', error.response ? error.response.data : error.message);
            setMessage('Error adding category');
        }
    };

    const handleEditCategory = (category) => {
        if (!user) {
            setMessage('User not authenticated');
            return;
        }
        if (user.role === 'Admin' || category.userId === user.id) {
            setEditCategory(category);
            setNewCategory(category.name);
        } else {
            setMessage('You can only edit your own categories');
        }
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        if (!user) {
            setMessage('User not authenticated');
            return;
        }
        try {
            await api.put(`${CATEGORY_API}/${editCategory.id}`, { ...editCategory, name: newCategory });
            setCategories(categories.map(cat => (cat.id === editCategory.id ? { ...cat, name: newCategory } : cat)));
            setEditCategory(null);
            setNewCategory('');
            setMessage('Category updated successfully');
        } catch (error) {
            console.error('Error updating category:', error.response ? error.response.data : error.message);
            setMessage('Error updating category');
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!user) {
            setMessage('User not authenticated');
            return;
        }
        const categoryToDelete = categories.find(category => category.id === id);
        if (user.role === 'Admin' || categoryToDelete.userId === user.id) {
            try {
                await api.delete(`${CATEGORY_API}/${id}`);
                setCategories(categories.filter(category => category.id !== id));
                setMessage('Category deleted successfully');
            } catch (error) {
                console.error('Error deleting category:', error.response ? error.response.data : error.message);
                setMessage('Error deleting category');
            }
        } else {
            setMessage('You can only delete your own categories');
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Categories</h2>

            {message && <p className="text-gray-600 italic">{message}</p>}

            {user.role !== 'Guest' && (
                <form className="flex gap-4" onSubmit={editCategory ? handleUpdateCategory : handleAddCategory}>
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Enter category name"
                        required
                        className="border border-gray-300 rounded-lg py-2 px-4 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 ease-in-out"
                    />
                    <button className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-600 hover:text-white transition-colors duration-300 ease-in-out">
                        {editCategory ? 'Update Category' : 'Add Category'}
                    </button>
                </form>
            )}

            {categories.length === 0 ? (
                <p className="text-gray-500 mt-4">No categories found.</p>
            ) : (
                <ul className="space-y-2 mt-4">
                    {categories.map((category) => (
                        <li key={category.id} className="flex justify-between items-center">
                            <Link
                                to={`/categories/${category.id}/posts`}
                                className="text-lg text-gray-700 font-medium hover:text-gray-500 transition-colors duration-300"
                            >
                                {category.name}
                            </Link>
                            {(user && (user.role === 'Admin' || category.userId === user.id)) && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditCategory(category)}
                                        className="bg-gray-400 text-white font-semibold py-1 px-4 rounded-lg shadow-md hover:bg-gray-500 transition-colors duration-300"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(category.id)}
                                        className="bg-gray-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Categories;
