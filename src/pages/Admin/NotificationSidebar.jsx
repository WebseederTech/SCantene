import React, { useState, useEffect } from "react";
import { Bell, X, MoreHorizontal } from "lucide-react";
import { BASE_URL } from "../../redux/constants";
import axios from "axios";

const NotificationSidebar = ({ adminId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (!isOpen && notifications.length === 0) {
      fetchNotifications();
    }
  };

  const fetchNotifications = async () => {
    if (!adminId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${BASE_URL}/api/notification/get-admin-notifications/${adminId}`
      );
      console.log(response.data, "response");

      // Directly set the array
      if (response.status === 200 && Array.isArray(response.data)) {
        setNotifications(response.data);
      } else {
        setError("Unexpected response format");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error("Error fetching admin notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format the date to be human-readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    // If it's today, show time
    if (date.toDateString() === now.toDateString()) {
      const hours = Math.floor((now - date) / (1000 * 60 * 60));
      if (hours < 24) {
        return `${hours} hours ago`;
      }
    }

    // If it's within the last week, show day
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year =
      date.getFullYear() !== now.getFullYear() ? `, ${date.getFullYear()}` : "";

    return `${day} ${month}${year}`;
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "Order":
        return <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>;
      case "User":
        return <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>;
      case "Payment":
        return (
          <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
        );
      case "Comment":
        return (
          <span className="w-4 h-4 bg-purple-500 rounded-full mr-2"></span>
        );
      default:
        return <span className="w-4 h-4 bg-gray-500 rounded-full mr-2"></span>;
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const markAllAsRead = async () => {
    if (!adminId || unreadCount === 0) return;

    try {
      // You would implement this API endpoint
      const response = await fetch(
        `${BASE_URL}/api/notification/admin/${adminId}/mark-all-read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        // Update local state to mark all notifications as read
        setNotifications(
          notifications.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        );
      }
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  return (
    <div className="relative flex items-center">
      {/* Bell Icon with Notification Badge */}
      <button className="relative p-1" onClick={toggleSidebar}>
        <Bell
          className={`h-5 w-5 md:h-6 md:w-6 ${
            isDarkMode ? "text-gray-300" : "text-gray-500"
          } hover:text-indigo-500 transition-colors`}
        />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        )}
      </button>

      {/* Notification Sidebar */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 shadow-lg z-50 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-medium">Notifications</h2>
            <div className="flex space-x-2">
              <button>
                <MoreHorizontal className="h-5 w-5 text-gray-500" />
              </button>
              <button onClick={toggleSidebar}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="flex border-b">
            <button className="flex-1 py-2 px-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              All
            </button>
            <button className="flex-1 py-2 px-4 text-sm font-medium text-gray-500">
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notification Content */}
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No notifications found
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="mb-4 pb-4 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getNotificationIcon(notification.type)}
                      <span className="text-sm font-medium">
                        {notification.type}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  <div
                    className={`ml-6 ${
                      notification.isRead ? "text-gray-500" : "font-medium"
                    }`}
                  >
                    <p className="text-sm">{notification.message}</p>
                    {notification.userId &&
                      typeof notification.userId === "object" &&
                      notification.userId.username && (
                        <p className="text-xs text-gray-500 mt-1">
                          From: {notification.userId.username} (
                          {notification.userId.email})
                        </p>
                      )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Mark all as read button */}
          {notifications.length > 0 && unreadCount > 0 && (
            <div className="px-4 pb-4">
              <button
                className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default NotificationSidebar;
