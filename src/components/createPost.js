import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';

Modal.setAppElement('#root');  // Properly set the base element for accessibility

const CreatePost = ({ refreshPosts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  // Minimal toolbar optimized for mobile use
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean'] // For clearing the format
    ],
    clipboard: { matchVisual: false }  // Avoid preserving weird formats from clipboard
  };
  
  const formats = [
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link', 'image'
  ];

  // Sanitize the input and prevent excessive spacing
  const handleQuillChange = (value, delta, source, editor) => {
    const plainText = editor.getText().trim(); // Trim whitespace and excess lines
    if (plainText.length === 0) {
      setError('Content cannot be empty or contain only spaces.');
      return;
    }
    setError(null);
    setContent(value);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);  // Reset error when modal is closed
    setTitle('');  // Clear title
    setContent('');  // Clear content
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a post.');
      toast.error('You must be logged in to create a post.');
      return;
    }

    if (content.trim().length === 0) {
      setError('Post content cannot be empty.');
      return;
    }

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
      setError('Failed to create post. Please try again.');
      console.error(err);
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
        className="absolute top-1/2 left-1/2 max-w-5xl w-11/12 transform -translate-x-1/2 -translate-y-1/2 bg-white flex flex-col p-6 rounded-lg shadow-lg max-h-screen overflow-hidden"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50"
        contentLabel="Create Post"
      >
        <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleCreatePost} className="flex flex-col h-full space-y-4">
          <div className="flex-grow overflow-y-auto">
            <label className="block text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4"
              placeholder="Enter post title"
              maxLength={50}
              required
            />

            <label className="block text-sm font-bold mb-2">Content</label>
            <ReactQuill
              value={content}
              onChange={handleQuillChange}  // Custom handler to trim spaces
              modules={modules}
              formats={formats}
              bounds={'.app'}
              placeholder="Enter post content"
              className="w-full h-64"
            />
          </div>

          {/* Buttons Section */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={closeModal}
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
