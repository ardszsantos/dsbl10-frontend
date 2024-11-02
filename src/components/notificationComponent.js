import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import io from 'socket.io-client';
import axios from 'axios';
import { jwtDecode }from 'jwt-decode';
import { Circles } from 'react-loader-spinner';

const NotificationInbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let userId;
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        userId = decodedToken.userId || decodedToken.id || decodedToken.sub;

        if (userId) {
          console.log(`User ID found in token: ${userId}`);
        } else {
          console.warn('User ID not found in token payload');
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }

    const fetchNotifications = async () => {
      try {
        console.log('Attempting to fetch notifications for user:', userId);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const existingNotifications = response.data;
        console.log('Fetched notifications:', existingNotifications); 

        setNotifications(existingNotifications);
        const unread = existingNotifications.filter((notif) => !notif.isRead).length;
        setUnreadCount(unread);
        setLoading(false);

      } catch (error) {
        console.error('Failed to fetch notifications, retrying...', error);
        setTimeout(fetchNotifications, 5000);
      }
    };

    fetchNotifications();

    const socket = io(`${process.env.REACT_APP_BACKEND_URL}`);
    console.log(`Joining room for user ${userId}`);
    socket.emit('join', userId);

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('newNotification', (notification) => {
      console.log('Received new notification via socket:', notification); 
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((count) => count + 1);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      console.log('Cleaning up socket connection'); 
      socket.disconnect();
    };
  }, []);

  const toggleInbox = () => setIsOpen(!isOpen);

  const markAllAsRead = async () => {
    try {
      console.log('Deleting all notifications'); 
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setNotifications([]);
      setUnreadCount(0);
      setIsOpen(false);

      console.log('All notifications deleted');
    } catch (error) {
      console.error('Failed to delete notifications:', error);
    }
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
              Delete all
            </button>
          </h4>
          {loading ? (
            <div className="flex justify-center">
              <Circles color="#4A90E2" height={40} width={40} />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} className="p-2 border-b border-gray-200">
                <p className="text-sm text-gray-600">{notification.message}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No notifications</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationInbox;
