import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import DeletePost from './deletePost';  // Import DeletePost component
import UpdatePost from './updatePost';  // Import UpdatePost component
import ReadPost from './readPost';  // Import ReadPost component
import { toast } from 'react-toastify';  // Import toast

const PostRender = () => {
  const [posts, setPosts] = useState([]);  // State to hold posts
  const [loading, setLoading] = useState(true);  // State for loading indicator
  const [error, setError] = useState(null);  // State for handling errors
  const [currentPost, setCurrentPost] = useState(null);  // State for the selected post
  const [isReadModalOpen, setIsReadModalOpen] = useState(false);  // State for read modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);  // State for edit modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);  // State for delete modal

  // Fetch posts from API
  useEffect(() => {
    axios
      .get('http://localhost:3000/posts')  // Adjust API URL as needed
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching posts');
        toast.error('Error fetching posts.');  // Error toast
        setLoading(false);
      });
  }, []);

  // Function to open the read modal (for viewing post content)
  const openReadModal = (post) => {
    setCurrentPost(post);
    setIsReadModalOpen(true);
  };

  // Function to open the edit modal
  const openEditModal = (post) => {
    setCurrentPost(post);
    setIsEditModalOpen(true);
  };

  // Function to open the delete modal
  const openDeleteModal = (post) => {
    setCurrentPost(post);
    setIsDeleteModalOpen(true);
  };

  // Function to close all modals
  const closeModal = () => {
    setIsReadModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setCurrentPost(null);
  };

  // Handle post update
  const handlePostUpdate = (id, updatedPost) => {
    setPosts(posts.map(post => (post.id === id ? { ...post, ...updatedPost } : post)));
    toast.success('Post updated successfully!');  // Success toast
  };

  // Handle post delete
  const handlePostDelete = (id) => {
    setPosts(posts.filter(post => post.id !== id));
    toast.success('Post deleted successfully!');  // Success toast
  };

  if (loading) {
    return (
      <tr>
        <td colSpan="5" className="py-2 px-4 border-b text-center">Loading...</td>
      </tr>
    );
  }

  if (error) {
    return (
      <tr>
        <td colSpan="5" className="py-2 px-4 border-b text-center text-red-500">{error}</td>
      </tr>
    );
  }

  return (
    <>
      {posts.map((post, index) => (
        <tr key={post.id}>
          <td className="py-2 px-4 border-b">{index + 1}</td>
          <td className="py-2 px-4 border-b">
            <a href="#" className="text-blue-500 hover:underline" onClick={() => openReadModal(post)}>
              {post.title}
            </a>
          </td>
          <td className="py-2 px-4 border-b">{post.author?.username || 'Unknown'}</td>
          <td className="py-2 px-4 border-b">{new Date(post.createdAt).toLocaleDateString()}</td>
          <td className="py-2 px-4 border-b">
            <button className="text-blue-500 hover:underline" onClick={() => openEditModal(post)}>Edit</button>
            <button className="text-red-500 hover:underline ml-4" onClick={() => openDeleteModal(post)}>Delete</button>
          </td>
        </tr>
      ))}

      {/* Read Post Modal */}
      {currentPost && (
        <ReadPost
          post={currentPost}
          isOpen={isReadModalOpen}
          onClose={closeModal}
        />
      )}

      {/* Edit Post Modal */}
      {currentPost && (
        <UpdatePost
          post={currentPost}
          isOpen={isEditModalOpen}
          onClose={closeModal}
          onUpdate={handlePostUpdate}
        />
      )}

      {/* Delete Post Modal */}
      {currentPost && (
        <DeletePost
          post={currentPost}
          isOpen={isDeleteModalOpen}
          onClose={closeModal}
          onDelete={handlePostDelete}
        />
      )}
    </>
  );
};

export default PostRender;
