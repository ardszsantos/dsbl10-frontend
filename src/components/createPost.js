import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import { Rings } from 'react-loader-spinner'; // Importing the spinner component

Modal.setAppElement('#root');

const CreatePost = ({ refreshPosts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
    clipboard: { matchVisual: false },
  };

  const formats = [
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link', 'image',
  ];

  const handleQuillChange = (value, delta, source, editor) => {
    const plainText = editor.getText().trim();
    const htmlContent = editor.getHTML();
    const imageTagPresent = htmlContent.includes('<img');

    if (plainText.length === 0 && !imageTagPresent) {
      setError('Content cannot be empty or contain only spaces.');
      return;
    }

    setError(null);
    setContent(value);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
    setTitle('');
    setContent('');
    setLoading(false); // Reset loading state
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a post.');
      toast.error('You must be logged in to create a post.');
      return;
    }

    if (content.trim().length === 0 && !content.includes('<img')) {
      setError('Post content cannot be empty.');
      return;
    }

    setLoading(true); // Set loading state to true to disable button and show loader

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/posts`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      closeModal();
      toast.success('Post created successfully!');
      refreshPosts();
    } catch (err) {
      setError('Tente re-logar, auth ta cagada por enquanto!.');
      console.error(err);
      setLoading(false); // Reset loading state on error
    }
  };

  return (
    <>
      <button onClick={openModal} className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
        Create Post
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="absolute top-1/2 left-1/2 max-w-5xl w-11/12 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-black dark:text-white flex flex-col p-6 rounded-lg shadow-lg max-h-screen overflow-hidden"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50"
        contentLabel="Create Post"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Create a New Post</h2>
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleCreatePost} className="flex flex-col h-full space-y-4">
          <div className="flex-grow overflow-y-auto">
            <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-gray-100">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg mb-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter post title"
              maxLength={50}
              required
            />

            <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-gray-100">Content</label>
            <ReactQuill
              value={content}
              onChange={handleQuillChange}
              modules={modules}
              formats={formats}
              bounds={'.app'}
              placeholder="Enter post content"
              className="w-full h-64  dark:text-white"
            />
          </div>

          {/* Buttons Section */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700"
              disabled={loading} // Disable the cancel button while loading
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-800 ${loading ? 'cursor-not-allowed' : ''}`}
              disabled={loading} // Disable the create button while loading
            >
              {loading ? (
                <Rings
                  height="24"
                  width="24"
                  color="#ffffff"
                  ariaLabel="loading-indicator"
                />
              ) : (
                'Create Post'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreatePost;
