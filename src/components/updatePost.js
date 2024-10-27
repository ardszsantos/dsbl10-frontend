import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';  // Import toast

const UpdatePost = ({ post, isOpen, onClose, onUpdate, refreshPosts }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const token = localStorage.getItem('token');

  const handleUpdate = async () => {
    try {
      const updatedPost = { title, content };
      await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/posts/${post.id}`, updatedPost, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onUpdate(post.id, updatedPost);
      onClose();
      toast.success('Post updated successfully!');
      refreshPosts();  // Refresh the posts list after updating the post
    } catch (error) {
      toast.error('Failed to update post. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Post"
      className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg p-6 max-w-lg mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-gray-600  bg-opacity-50"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Post</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 rounded"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 rounded"
          rows="5"
        />
      </div>
      <div className="flex justify-end">
        <button onClick={handleUpdate} className="text-blue-500 dark:text-blue-400 hover:underline mr-4">Update Post</button>
        <button onClick={onClose} className="text-red-500 dark:text-red-400 hover:underline">Cancel</button>
      </div>
    </Modal>
  );
};

export default UpdatePost;
