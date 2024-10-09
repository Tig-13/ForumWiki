import React from 'react';

const Comments = ({ comment, user, postId, editComment, setEditComment, handleUpdateComment, handleDeleteComment, handleEditComment }) => {
    return (
        <li className="p-3 bg-gray-200 rounded-lg">
            {editComment && editComment.id === comment.id ? (
                <div>
                    <textarea
                        value={editComment.content}
                        onChange={(e) =>
                            setEditComment({ ...editComment, content: e.target.value })
                        }
                        className="w-full p-3 mb-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        onClick={() => handleUpdateComment(postId, comment.id)}
                        className="bg-blue-500 text-white py-1 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-300"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => setEditComment(null)}
                        className="bg-gray-400 text-white py-1 px-4 rounded-lg shadow hover:bg-gray-500 transition duration-300 ml-2"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <>
                    <p className="text-gray-700">{comment.content}</p>
                    {user.role !== 'Guest' && comment.userId === user.id && (
                        <>
                            <button
                                onClick={() => handleEditComment(comment)}
                                className="bg-gray-400 text-white py-1 px-3 rounded-lg shadow hover:bg-gray-500 transition duration-300 mt-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteComment(postId, comment.id)}
                                className="bg-gray-500 text-white py-1 px-3 rounded-lg shadow hover:bg-gray-600 transition duration-300 mt-2 ml-2"
                            >
                                Delete
                            </button>
                        </>
                    )}
                </>
            )}
        </li>
    );
};

export default Comments;
