import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const UpdatePost = ({ post, isOpen, onClose, onUpdate }) => {
  const [title, setTitle] = useState(post.title);  // Initialize with current title
  const [content, setContent] = useState(post.content);  // Initialize with current content

  // Get the token (assume it's stored in localStorage after login)
  const token = localStorage.getItem('token');

  // Function to update the post
  const handleUpdate = async () => {
    try {
      const updatedPost = { title, content };
      await axios.patch(`http://localhost:3000/posts/${post.id}`, updatedPost, {
        headers: {
          Authorization: `Bearer ${token}`  // Add the Authorization header with the JWT token
        }
      });
      onUpdate(post.id, updatedPost);  // Pass the updated post to parent
      onClose();  // Close the modal
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Post"
      className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}  // Update title state
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}  // Update content state
          className="w-full p-2 border border-gray-300 rounded"
          rows="5"
        />
      </div>
      <div className="flex justify-end">
        <button onClick={handleUpdate} className="text-blue-500 hover:underline mr-4">Update Post</button>
        <button onClick={onClose} className="text-red-500 hover:underline">Cancel</button>
      </div>
    </Modal>
  );
};

export default UpdatePost;
