import { AiOutlineBell } from "react-icons/ai";
import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaLocationArrow, FaShoppingCart, FaChevronDown } from "react-icons/fa";
import {
  useAllProductsQuery,
  useGetRetailerDashboardByIdQuery,
} from "../../redux/api/productApiSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import NotificationList from "../Auth/Notification";
import { BASE_URL, DASHBOARD_ID } from "../../redux/constants";
import ProductCarousel from "../../components/TopCarousel";
import { Link } from "react-router-dom";
import logo from "../../Assets/logo.png";
import ProductSearch from "./ProductSearch";
import { useGetUserDetailsQuery } from "../../redux/api/usersApiSlice";

const RetailerNav = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);

  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useAllProductsQuery();
  const {
    data: dashboard,
    error: dashboardError,
    isLoading: dashboardLoading,
  } = useGetRetailerDashboardByIdQuery();

  const { userInfo } = useSelector((state) => state.auth);
  const storedData = JSON.parse(localStorage.getItem("userData"));
  const userId = storedData?._id;

  const {
    data: userDetails,
    isLoading,
    isError,
  } = useGetUserDetailsQuery(userId, {
    skip: !userId, // Prevent fetching if userId is not available
  });
  console.log(userDetails, "userDetails");
  // Extract cart count from API response
  const cartCount = userDetails?.cart?.length || 0;

  const username = storedData?.username;
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleNotificationClick = () => {
    navigate("/notification");
  };

  const handleBellMouseEnter = () => setShowNotification(true);
  const handleBellMouseLeave = () => {
    if (!isCardHovered) {
      setShowNotification(false);
    }
  };

  const handleCardMouseEnter = () => setIsCardHovered(true);
  const handleCardMouseLeave = () => {
    setIsCardHovered(false);
    setShowNotification(false);
  };

  const handleLogout = () => {
    // Implement logout logic
    localStorage.removeItem("userData");
    navigate("/login");
  };
  return (
    <nav className="dark:bg-gray-800 bg-gray-100 shadow-md w-full z-[49] sticky top-0 left-0">
      <div className="w-full px-4 py-3 flex justify-between items-center gap-4">
        <div className="flex items-center space-x-4 ml-16">
          <img src={logo} alt="Logo" className="h-5 w-auto" />
        </div>
        <ProductSearch />

        <div className="flex items-between gap-6">
          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex justify-center items-center text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              Hello, <span>{username}</span>
              <FaChevronDown className="ml-2" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl z-20">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="relative">
            <Link to="/cart" className="flex items-center">
              <FaShoppingCart
                size={24}
                className="text-xl text-gray-700 dark:text-gray-300 hover:text-blue-600"
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white aspect-square flex justify-center items-center text-xs rounded-full px-1.5">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Notifications */}
          <div
            className="relative"
            onMouseEnter={handleBellMouseEnter}
            onMouseLeave={handleBellMouseLeave}
          >
            <AiOutlineBell
              className="text-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 cursor-pointer"
              onClick={handleNotificationClick}
              size={24}
            />
            {showNotification && (
              <div
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-700 rounded-lg shadow-xl z-20"
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
              >
                <NotificationList />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default RetailerNav;
