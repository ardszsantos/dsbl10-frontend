import React from 'react';
import Modal from 'react-modal';

const ReadPost = ({ post, isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Read Post"
      className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50"
    >
      <h2 className="text-3xl font-bold mb-4">{post.title}</h2>  {/* Post Title */}
      <p className="text-gray-700 mb-6">{post.content}</p>  {/* Post Content */}
      <div className="flex justify-end">
        <button onClick={onClose} className="text-blue-500 hover:underline">Close</button>
      </div>
    </Modal>
  );
};

export default ReadPost;
