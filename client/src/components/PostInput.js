import React, { useState } from 'react';

const PostInput = ({ onAddPost, userRole, categoryId }) => {
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [message, setMessage] = useState('');

    const handleAddPost = async (e) => {
        e.preventDefault();
        if (userRole === 'Guest') {
            setMessage('Guests are not allowed to add posts');
            return;
        }

        try {
            await onAddPost({ ...newPost, categoryId: parseInt(categoryId) });
            setNewPost({ title: '', content: '' });
            setMessage('Post added successfully');
        } catch (error) {
            console.error('Error adding post:', error);
            setMessage('Error adding post');
        }
    };

    return (
        <div>
            {message && <p className="text-red-500 mb-4">{message}</p>}
            <form onSubmit={handleAddPost} className="mb-6">
                <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Enter post title"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Enter post content"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-300"
                >
                    Add Post
                </button>
            </form>
        </div>
    );
};

export default PostInput;
