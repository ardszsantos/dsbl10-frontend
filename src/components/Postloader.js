import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeletePost from './deletePost';
import UpdatePost from './updatePost';
import { toast } from 'react-toastify';

const PostLoader = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10); // Set posts per page to 10
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/posts`);
      setPosts(response.data.reverse()); // Reverse the posts to show the latest first
      setLoading(false);
    } catch (error) {
      setError('Error fetching posts');
      toast.error('Error fetching posts.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openReadPostPage = (postId) => {
    navigate(`/post/${postId}`);
  };

  const openEditModal = (post) => {
    setCurrentPost(post);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (post) => {
    setCurrentPost(post);
    setIsDeleteModalOpen(true);
  };

  const toggleMenu = (id) => {
    setIsMenuOpen(isMenuOpen === id ? null : id);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {currentPosts.map((post, index) => (
        <div
          key={post.id}
          className="flex items-center justify-between p-4 mb-4 border border-gray-200 rounded-lg shadow-sm"
        >
          <div>
            <span className="text-gray-600 font-bold mr-2">
              #{indexOfFirstPost + index + 1}
            </span>
            <button
              className="text-blue-600 font-bold text-lg hover:underline"
              onClick={() => openReadPostPage(post.id)}
            >
              {post.title}
            </button>
            <p className="text-gray-500 text-sm">
              by {post.author?.username || 'Unknown'} on{' '}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="relative">
            <button onClick={() => toggleMenu(post.id)} className="text-gray-600 hover:text-gray-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
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

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Edit Post Modal */}
      {currentPost && (
        <UpdatePost
          post={currentPost}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={fetchPosts}
        />
      )}

      {/* Delete Post Modal */}
      {currentPost && (
        <DeletePost
          post={currentPost}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={fetchPosts}
        />
      )}
    </div>
  );
};

export default PostLoader;
