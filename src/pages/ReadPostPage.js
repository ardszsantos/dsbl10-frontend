// src/pages/ReadPostPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import { FaArrowLeft } from 'react-icons/fa';
import 'react-quill/dist/quill.snow.css';
import { ThreeDots } from 'react-loader-spinner';

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
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ThreeDots height="80" width="80" color="#4A90E2" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gray-50">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center text-gray-700 hover:text-gray-900 p-2 rounded-lg bg-gray-100 shadow-md"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-center">{post.title}</h1>
      <div className="flex justify-center">
      <div className="quill-content w-full max-w-4xl mx-auto">
        <ReactQuill
            value={post.content}
            readOnly={true}
            theme="snow"
            modules={{ toolbar: false }}
            className="w-full"
        />
        </div>
      </div>
    </div>
  );
};

export default ReadPostPage;
