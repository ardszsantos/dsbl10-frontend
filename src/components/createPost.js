import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';  // Import toast for notifications

const CreatePost = ({ refreshPosts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  // Define openModal and closeModal functions
  const openModal = () => setIsModalOpen(true);  // Opens the modal
  const closeModal = () => {
    setIsModalOpen(false);  // Closes the modal
    setError(null);  // Resets error when modal is closed
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');  // Get JWT token

    if (!token) {
      setError('You must be logged in to create a post.');
      toast.error('You must be logged in to create a post.');  // Show error toast
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/posts`,
        { title, content },  // Post data
        { headers: { Authorization: `Bearer ${token}` } }  // Auth header
      );

      // Reset the form and close the modal
      setTitle('');
      setContent('');
      closeModal();  // Close the modal after success
      toast.success('Post created successfully!');  // Show success toast
      refreshPosts();
      window.location.reload();  // Refresh the posts list after creating a new post
    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.log(err)  // Show error toast
    }
  };

  return (
    <>
      <button
        onClick={openModal}  // Correctly defined function
        className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
      >
        Create Post
      </button>

      {/* Modal for creating post */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}  // Correctly defined function
        contentLabel="Create Post"
        className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50"
      >
        <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleCreatePost}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter post title"
              maxLength={136}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter post content"
              rows="4"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeModal}  // Close modal button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create Post
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreatePost;
