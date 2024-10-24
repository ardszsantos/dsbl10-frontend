import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';  // Import toast

const UpdatePost = ({ post, isOpen, onClose, onUpdate }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const token = localStorage.getItem('token');

  const handleUpdate = async () => {
    try {
      const updatedPost = { title, content };
      await axios.patch(`http://localhost:3000/posts/${post.id}`, updatedPost, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUpdate(post.id, updatedPost);
      onClose();
      toast.success('Post updated successfully!');  // Success toast
    } catch (error) {
      toast.error('Failed to update post. Please try again.');  // Error toast
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
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
