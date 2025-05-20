import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineBell } from "react-icons/ai";
import { BASE_URL } from "../../redux/constants";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo._id;

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/notification/${userId}/unread-count`);
      setUnreadCount(response.data.data);
    } catch (error) {
      console.error("Error fetching unread notifications count:", error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/notification/${userId}`);
      setNotifications(response.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`${BASE_URL}/api/notification/markAsRead`, { notificationId });
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(`${BASE_URL}/api/notification/mark-all-as-read`, { userId });
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  return (
    <motion.div
      className="p-4 bg-white text-black rounded-lg shadow-md max-w-lg mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <AiOutlineBell className="h-6 w-6 text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={markAllAsRead}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <AnimatePresence>
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <motion.li
                key={notification._id}
                className={`p-3 rounded-lg mb-2 shadow-sm flex justify-between items-center ${notification.read ? "bg-gray-100" : "bg-blue-50"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="text-blue-500 text-xs hover:underline"
                  >
                    Mark as Read
                  </button>
                )}
              </motion.li>
            ))}
          </ul>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default NotificationList;