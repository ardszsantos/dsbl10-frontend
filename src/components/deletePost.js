import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const DeletePost = ({ post, isOpen, onClose, onDelete }) => {
  // Get the token (assume it's stored in localStorage after login)
  const token = localStorage.getItem('token');

  // Function to delete the post
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/posts/${post.id}`, {
        headers: {
          Authorization: `Bearer ${token}`  // Add the Authorization header with the JWT token
        }
      });
      onDelete(post.id); // Pass the deleted post ID to parent
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Delete Post"
      className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50"
    >
      <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
      <p className="mb-6">Do you really want to delete the post titled "{post.title}"?</p>
      <div className="flex justify-end">
        <button onClick={handleDelete} className="text-red-500 hover:underline mr-4">Yes, delete it</button>
        <button onClick={onClose} className="text-blue-500 hover:underline">Cancel</button>
      </div>
    </Modal>
  );
};

export default DeletePost;
