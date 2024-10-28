import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner';

const CommentsComponent = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/comments/post/${postId}`
        );
        setComments(response.data);
      } catch (err) {
        setError('Failed to load comments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        setUserId(tokenPayload.sub);
      } catch (error) {
        console.error('Invalid token format', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/comments`,
        {
          content: newComment,
          postId: postId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, response.data]);
      setNewComment('');
      toast.success('Comment added successfully!');
    } catch (err) {
      setError('Failed to submit comment. Please try again later.');
      toast.error('Failed to submit comment. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setDeletingCommentId(commentId);
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/comments/${commentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComments(comments.filter((comment) => comment.id !== commentId));
        toast.success('Comment deleted successfully!');
      } catch (err) {
        setError('Failed to delete comment. Please try again later.');
        toast.error('Failed to delete comment. Please try again later.');
      } finally {
        setDeletingCommentId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#4A90E2"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="w-full lg:w-10/12 mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Comments</h2>

      {error && (
        <div className="text-center py-2 text-red-500 dark:text-red-400">
          {error}
        </div>
      )}

      {userId ? (
        <form onSubmit={handleCommentSubmit} className="mb-6 flex flex-col md:flex-row items-center w-full">
          <input
            type="text"
            className="flex-grow bg-white p-3 border border-gray-300 rounded-t-lg md:rounded-l-lg md:rounded-tr-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 transition-all duration-200"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-500 dark:bg-blue-700 text-white px-4 py-2 rounded-b-lg md:rounded-r-lg md:rounded-bl-none hover:bg-blue-600 dark:hover:bg-blue-800 flex items-center justify-center transition-all duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ThreeDots
                height="20"
                width="20"
                radius="9"
                color="#ffffff"
                ariaLabel="three-dots-loading"
                visible={true}
              />
            ) : (
              'Submit'
            )}
          </button>
        </form>
      ) : (
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          <a
            href="/"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            Log in
          </a>{' '}
          to post a comment.
        </p>
      )}

      {comments.length > 0 ? (
        [...comments].reverse().map((comment) => (
          <div
            key={comment.id}
            className="bg-white dark:bg-gray-800 dark:text-white p-4 mb-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            <div className="flex items-center mb-2">
              <span className="font-semibold dark:text-gray-200">{comment.user.username}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
              {userId && comment.user.id === userId && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="ml-auto text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 flex items-center transition-all duration-200"
                  disabled={deletingCommentId === comment.id}
                >
                  {deletingCommentId === comment.id ? (
                    <ThreeDots
                      height="15"
                      width="15"
                      radius="9"
                      color="#f56565"
                      ariaLabel="three-dots-loading"
                      visible={true}
                    />
                  ) : (
                    'Delete'
                  )}
                </button>
              )}
            </div>
            <p className="text-gray-800 dark:text-gray-200 break-words">{comment.content}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
};

export default CommentsComponent;
