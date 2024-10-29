// src/components/NotificationInbox.js
import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import io from 'socket.io-client';

const NotificationInbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const socket = io('http://localhost:3000'); // Update this for production

    const userId = localStorage.getItem('userId'); // Replace with actual user ID retrieval
    if (userId) socket.emit('join', userId);

    socket.on('newNotification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((count) => count + 1);
    });

    return () => socket.disconnect();
  }, []);

  const toggleInbox = () => setIsOpen(!isOpen);

  const markAllAsRead = () => {
    setUnreadCount(0);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={toggleInbox} className="relative">
        <FaBell className="text-white text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50 p-4 max-h-80 overflow-y-auto">
          <h4 className="text-gray-800 font-bold mb-2 flex justify-between items-center">
            Notifications
            <button onClick={markAllAsRead} className="text-xs text-blue-500">
              Mark all as read
            </button>
          </h4>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} className="p-2 border-b border-gray-200">
                <p className="text-sm text-gray-600">{notification.message}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No new notifications</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationInbox;
