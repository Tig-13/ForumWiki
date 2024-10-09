import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { CATEGORY_API, POST_API } from '../tools/constants';
import LikeButtons from './LikeButtons'; 
import PostInput from './PostInput';
import Comments from './Comments'; 

const Posts = ({ user }) => {
    const { categoryId } = useParams();
    const [posts, setPosts] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [editComment, setEditComment] = useState(null);
    const [newComment, setNewComment] = useState(''); 
    const [message, setMessage] = useState('');
    const [comments, setComments] = useState({});
    const [likedPosts, setLikedPosts] = useState({}); 

    const hasUserLikedPost = async (postId) => {
        try {
            const response = await api.get(`${POST_API}/${postId}/liked/${user.id}`);
            const liked = response.data.liked;
            setLikedPosts(prev => ({ ...prev, [postId]: liked })); 
        } catch (error) {
            console.error('Error checking like status:', error);
            setMessage('Error checking like status');
        }
    };

    const fetchPosts = useCallback(async () => {
        try {
            const response = await api.get(`${POST_API}${CATEGORY_API}/${categoryId}`);
            const postsData = response.data;
            setPosts(postsData || []);
    
            if (postsData && postsData.length > 0) {
                await Promise.all(postsData.map(async (post) => {
                    await fetchComments(post.id); 
                    await hasUserLikedPost(post.id); 
                }));
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            setMessage('Error fetching posts');
        }
    }, [categoryId]);

    const fetchCategory = useCallback(async () => {
        try {
            const response = await api.get(`${CATEGORY_API}/${categoryId}`);
            const categoryData = response.data;
            setCategoryName(categoryData.name);
        } catch (error) {
            console.error('Error fetching category:', error);
            setMessage('Error fetching category');
        }
    }, [categoryId]);

    const fetchComments = async (postId) => {
        try {
            const response = await api.get(`${POST_API}/${postId}/comments`);
            const commentsData = response.data;
            setComments(prev => ({ ...prev, [postId]: commentsData }));
        } catch (error) {
            setMessage('Error fetching comments');
        }
    };

    const handleAddComment = async (postId, commentContent) => {
        const savedComment = newComment; 
        setNewComment(''); 
        try {
            const response = await api.post(`${POST_API}/${postId}/comments`, {
                content: commentContent, 
                userId: user.id,
            });
            const addedComment = response.data;
            setComments(prev => ({
                ...prev,
                [postId]: [...(prev[postId] || []), addedComment],
            }));
            setNewComment(''); 
        } catch (error) {
            setMessage('Error adding comment');
            setNewComment(savedComment);
        }
    };

    const handleUpdateComment = async (postId, commentId) => {
        try {
            const response = await api.put(`${POST_API}/${postId}/comments/${commentId}`, {
                content: editComment.content,
                userId: user.id,
            });
            const updatedComment = response.data;
            setComments(prev => ({
                ...prev,
                [postId]: prev[postId].map(comment => comment.id === commentId ? updatedComment : comment),
            }));
            setEditComment(null); 
        } catch (error) {
            setMessage('Error updating comment');
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            await api.delete(`${POST_API}/${postId}/comments/${commentId}`);
            setComments(prev => ({
                ...prev,
                [postId]: prev[postId].filter(comment => comment.id !== commentId),
            }));
        } catch (error) {
            setMessage('Error deleting comment');
        }
    };

    const handleEditComment = (comment) => {
        setEditComment(comment); 
    };

    const handleLikePost = async (postId) => {
        const post = posts.find(post => post.id === postId);

        console.log(user.id , postId); 
        
        try {
            const response = await api.post(`${POST_API}/${postId}/like`, { postId, userId: user.id });
            setPosts(posts.map(post =>
                post.id === postId ? { ...post, likes: response.data.likes, isAlreadyLiked: true } : post
            ));
            setLikedPosts(prev => ({ ...prev, [postId]: true }));
        } catch (error) {
            console.error(error);
            setMessage('Error liking post');
        }
    };

    const handleUnlikePost = async (postId) => {
        if (!likedPosts[postId]) {
            setMessage('You haven\'t liked this post yet');
            return;
        }

        try {
            const response = await api.delete(`${POST_API}/${postId}/like/${user.id}`);
            setPosts(posts.map(post =>
                post.id === postId ? { ...post, likes: response.data.likes, isAlreadyLiked: false } : post
            ));
            setLikedPosts(prev => ({ ...prev, [postId]: false }));
        } catch (error) {
            setMessage('Error unliking post');
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        fetchCategory();
    }, [fetchCategory]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
            <h2 className="text-3xl font-bold text-gray-700 mb-6">Posts in {categoryName}</h2>

            {message && <p className="text-red-500 mb-4">{message}</p>}

            {user.role !== 'Guest' && (
                <PostInput onAddPost={handleAddComment} user={user} categoryId={categoryId} />
            )}

            {posts.length === 0 ? (
                <p className="text-gray-600">No posts found for this category.</p>
            ) : (
                <ul className="space-y-6">
                    {posts.map((post) => (
                        <li key={post.id} className="p-4 bg-gray-100 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                            <p className="text-gray-700 mb-4">{post.content}</p>

                            <LikeButtons
                                isLiked={likedPosts[post.id]} 
                                likes={post.likes} 
                                onLike={() => handleLikePost(post.id)} 
                                onUnlike={() => handleUnlikePost(post.id)} 
                            />

                            <ul className="space-y-4">
                                {comments[post.id]?.map((comment) => (
                                    <Comments
                                        key={comment.id}
                                        comment={comment}
                                        user={user}
                                        postId={post.id}
                                        editComment={editComment}
                                        setEditComment={setEditComment}
                                        handleUpdateComment={handleUpdateComment}
                                        handleDeleteComment={handleDeleteComment}
                                        handleEditComment={handleEditComment}
                                    />
                                ))}
                            </ul>

                            {user.role !== 'Guest' && (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleAddComment(post.id, newComment); 
                                    }}
                                    className="mt-4"
                                >
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)} 
                                        placeholder="Add a comment"
                                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-300"
                                    >
                                        Add Comment
                                    </button>
                                </form>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Posts;
