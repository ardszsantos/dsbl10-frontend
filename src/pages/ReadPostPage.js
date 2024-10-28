import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import CommentsComponent from '../components/CommentsComponent';
import NavBar from '../components/navbar';

const ReadPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        setError('Failed to load post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <ThreeDots height="80" width="80" color="#4A90E2" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500 dark:text-red-400">{error}</div>;
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen flex flex-col p-4 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-md"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-3xl bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">{post.title}</h1>
            <div
              className="post-content w-full text-justify leading-relaxed break-words overflow-hidden"
              style={{ whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
        <CommentsComponent postId={id} />
      </div>
    </>
  );
};

export default ReadPostPage;
