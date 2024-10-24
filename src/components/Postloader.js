import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeletePost from './deletePost';  // Import DeletePost component
import UpdatePost from './updatePost';  // Import UpdatePost component
import ReadPost from './readPost';  // Import ReadPost component
import { toast } from 'react-toastify';  // Import toast

const Postloader = () => {
  const [posts, setPosts] = useState([]);  // State to hold posts
  const [loading, setLoading] = useState(true);  // State for loading indicator
  const [error, setError] = useState(null);  // State for handling errors
  const [currentPost, setCurrentPost] = useState(null);  // State for the selected post
  const [isReadModalOpen, setIsReadModalOpen] = useState(false);  // State for read modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);  // State for edit modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);  // State for delete modal
  const [isMenuOpen, setIsMenuOpen] = useState(null); // State for controlling each post's menu

  // Function to fetch posts from the API
  const fetchPosts = () => {
    setLoading(true);  // Set loading before fetching
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/posts`)  // Adjust API URL as needed
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching posts');
        toast.error('Error fetching posts.');  // Error toast
        setLoading(false);
      });
  };

  // Fetch posts when the component mounts
  useEffect(() => {
    fetchPosts();
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

  // Function to toggle menu per post
  const toggleMenu = (id) => {
    setIsMenuOpen(isMenuOpen === id ? null : id);  // Toggle the menu for each post
  };

  // Handle post update and refresh the posts
  const handlePostUpdate = (id, updatedPost) => {
    fetchPosts();  // Refresh the posts list from API after updating
    toast.success('Post updated successfully!');
      // Success toast
  };

  // Handle post delete and refresh the posts
  const handlePostDelete = (id) => {
    fetchPosts();  // Refresh the posts list from API after deleting
    toast.success('Post deleted successfully!');  // Success toast
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {posts
        .slice()  // Create a shallow copy of the posts array
        .reverse()  // Reverse the order so that the latest post appears first
        .map((post, index) => (
          <div
            key={post.id}
            className="flex items-center justify-between p-4 mb-4 border border-gray-200 rounded-lg shadow-sm"
          >
            {/* Post Title and Information */}
            <div>
              {/* Post Number */}
              <span className="text-gray-600 font-bold mr-2">#{index + 1}</span>

              {/* Post Title */}
              <button
                className="text-blue-600 font-bold text-lg hover:underline"
                onClick={() => openReadModal(post)}
              >
                {post.title}
              </button>

              {/* Author and Date */}
              <p className="text-gray-500 text-sm">
                by {post.author?.username || 'Unknown'} on{' '}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Hamburger Menu for Post Options */}
            <div className="relative">
              <button
                onClick={() => toggleMenu(post.id)}
                className="text-gray-600 hover:text-gray-800"
              >
                {/* Hamburger Icon */}
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>

              {/* Menu for Edit and Delete */}
              {isMenuOpen === post.id && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                  <button
                    onClick={() => openEditModal(post)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(post)}
                    className="block px-4 py-2 text-red-700 hover:bg-red-200 w-full text-left"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
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
    </div>
  );
};

export default Postloader;
