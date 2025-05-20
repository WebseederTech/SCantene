import { useState } from "react";
import { Sun, Moon, X, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";
import NotificationSidebar from "../Admin/NotificationSidebar";

export default function Navbar({ activeMenuItem }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const adminId = userInfo?._id;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo")) || {};

  // Toggle dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      className={`${
        isDarkMode ? "bg-gray-800 shadow-md" : "bg-white shadow"
      } sticky top-0 z-10`}
    >
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center">
          {/* Display active menu item */}
          <h1
            className={`text-lg ml-8 lg:ml-64 md:text-xl font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {activeMenuItem || ""}
          </h1>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4 mr-9">
          <div className="relative hidden sm:block">
            {/* Search feature can be added here if needed */}
          </div>

          {adminId && <NotificationSidebar adminId={adminId} />}

          {/* <button
            onClick={toggleTheme}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 md:h-6 md:w-6 text-yellow-300" />
            ) : (
              <Moon className="h-5 w-5 md:h-6 md:w-6 text-gray-500" />
            )}
          </button> */}
          <div className="flex items-center space-x-1 md:space-x-2 cursor-pointer group relative">
            <div
              className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium shadow"
              onClick={() => navigate("/profile")}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </div>

            <span
              className={`hidden md:inline-block text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
              onClick={() => navigate("/profile")}
            >
              {user?.role || "User"}
            </span>
            
            {/* Notification Sidebar */}
            {isOpen && (
              <div className="fixed  inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 shadow-lg z-50 overflow-y-auto">
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
                    Unread
                  </button>
                </div>

                {/* Notification Categories */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                      <span className="text-sm font-medium">
                        Announcements
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">19 Aug, 21</span>
                  </div>

                  <div className="ml-6 mb-4">
                    <p className="text-sm mb-1">
                      Isaac Morgan posted an announcement
                    </p>
                    <p className="text-sm font-medium mb-1">
                      Review lecture on the 22nd February
                    </p>
                    <p className="text-xs text-gray-500">
                      on your course{" "}
                      <span className="font-medium">
                        User Experience Design Essentials
                      </span>
                    </p>
                  </div>
                </div>

                {/* More categories */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center text-xs">
                        G
                      </span>
                      <span className="text-sm font-medium">General</span>
                    </div>
                    <span className="text-xs text-gray-500">19 Aug, 21</span>
                  </div>
                </div>
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
        </div>
      </div>
    </header>
  );
}