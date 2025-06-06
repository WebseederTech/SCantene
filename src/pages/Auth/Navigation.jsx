// import { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { useLogoutMutation } from "../../redux/api/usersApiSlice";
// import { logout } from "../../redux/features/auth/authSlice";
// import logo from "../../Assets/logo3.png";
// import FavoritesCount from "../Products/FavoritesCount";
// import ThemeToggle from "../../components/ThemeToggle";
// import {
//   LayoutDashboard,
//   Package,
//   Tag,
//   Box,
//   Star,
//   Users,
//   UserCheck,
//   FileText,
//   Home,
//   ShoppingBag,
//   ShoppingCart,
//   HeartIcon,
//   History,
//   Bug,
//   BellIcon,
//   MenuIcon,
// } from "lucide-react";
// import {
//   AiOutlineUsergroupAdd,
//   AiOutlineLogin,
//   AiOutlineUserAdd,
//   AiOutlineShoppingCart,
// } from "react-icons/ai";
// import { CgProfile } from "react-icons/cg";
// import { FiLogOut } from "react-icons/fi";
// import { IoMdClose } from "react-icons/io";

// const menuItems = {
//   Admin: [
//     { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
//     { path: "/admin/productlist", label: "Products", icon: Package },
//     { path: "/admin/categorylist", label: "Category", icon: Tag },
//     { path: "/admin/brandlist", label: "Brand", icon: Box },
//     {
//       path: "/admin/all-users",
//       label: "All Customers",
//       icon: AiOutlineUsergroupAdd,
//     },
//     { path: "/admin/orderlist", label: "Orders", icon: Star },
//     {
//       path: "/admin/coupon",
//       label: "Coupon Code",
//       icon: AiOutlineShoppingCart,
//     },
//     { path: "/admin/user-cart", label: "Customer Cart", icon: ShoppingCart },
//     { path: "/admin/search-history", label: "Search History", icon: History },
//     { path: "/admin/bug-reports", label: "Bug Reports", icon: Bug },
//     {
//       path: "/admin/admin-notification",
//       label: "Broadcast ",
//       icon: BellIcon,
//     },
//   ],
//   Buyer: [
//     { path: "/", label: "Home", icon: Home },
//     { path: "/shop", label: "Shop", icon: ShoppingBag },
//     { path: "/cart", label: "Cart", icon: ShoppingCart },
//     {
//       path: "/favorite",
//       label: "Favorites",
//       icon: HeartIcon,
//       extra: <FavoritesCount />,
//     },
//     { path: "/yourorder", label: "Your Order", icon: AiOutlineShoppingCart },
//   ],
// };

// const Navigation = () => {
//   const { userInfo } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [logoutApiCall] = useLogoutMutation();
//   const sidebarRef = useRef(null);

//   const [isCollapsed, setIsCollapsed] = useState(userInfo?.role === "Buyer");

//   const logoutHandler = async () => {
//     try {
//       await logoutApiCall().unwrap();
//       dispatch(logout());
//       navigate("/login");
//       if (userInfo?.role === "Buyer") setIsCollapsed(true);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         userInfo?.role === "Buyer" &&
//         sidebarRef.current &&
//         !sidebarRef.current.contains(event.target)
//       ) {
//         setIsCollapsed(true);
//       }
//     };

//     if (!isCollapsed) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isCollapsed, userInfo]);

//   return (
//     <>
//       {/* Open Button (For Buyers) */}
//       {userInfo?.role === "Buyer" && isCollapsed && (
//         <button
//           onClick={() => setIsCollapsed(false)}
//           className="fixed top-4 left-6 text-white bg-gray-800 p-2 rounded-lg z-50"
//         >
//           <MenuIcon size={20} />
//         </button>
//       )}

//       {/* Backdrop (Dimming Effect - Only for Buyers) */}
//       {userInfo?.role === "Buyer" && !isCollapsed && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={() => setIsCollapsed(true)}
//         ></div>
//       )}

//       {/* Sidebar */}
//       <div
//         ref={sidebarRef}
//         className={`fixed left-0 top-0 h-full bg-gray-900 text-white flex flex-col transition-all z-50 shadow-lg ${
//           isCollapsed && userInfo?.role === "Buyer"
//             ? "-translate-x-full"
//             : "translate-x-0 w-64"
//         }`}
//       >
//         {/* CSS for Scrollbar Styling */}
//         <style>{`
//           /* Scrollbar styles for Webkit browsers (Chrome, Safari, newer Edge) */
//           .custom-scrollbar::-webkit-scrollbar {
//             width: 6px;
//           }
          
//           .custom-scrollbar::-webkit-scrollbar-track {
//             background: #1f2937; /* Dark gray track */
//           }
          
//           .custom-scrollbar::-webkit-scrollbar-thumb {
//             background-color: #4b5563; /* Gray thumb */
//             border-radius: 20px;
//             border: 2px solid #1f2937; /* Creates padding effect */
//           }
          
//           .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//             background-color: #6b7280; /* Lighter gray on hover */
//           }
          
//           /* For Firefox */
//           .custom-scrollbar {
//             scrollbar-width: thin;
//             scrollbar-color: #4b5563 #1f2937;
//           }
//         `}</style>

//         {/* Close Button (Only for Buyers) */}
//         {userInfo?.role === "Buyer" && !isCollapsed && (
//           <button
//             onClick={() => setIsCollapsed(true)}
//             className="absolute top-4 left-[250px] text-white bg-gray-800 p-2 rounded-lg z-50"
//           >
//             <IoMdClose size={24} />
//           </button>
//         )}

//         {/* Fixed Header */}
//         <div className="p-5 pb-2">
//           {/* Logo */}
//           <div className="mb-2 flex justify-between items-center">
//             <img src={logo} alt="Logo" className="h-10 object-contain" />
//           </div>
//         </div>

//         {/* Scrollable Content Area */}
//         <div className="flex-1 overflow-y-auto px-5 pb-2 custom-scrollbar">
//           {/* Sidebar Links */}
//           <ul>
//             {userInfo &&
//               menuItems[userInfo.role] &&
//               menuItems[userInfo.role].map(
//                 ({ path, label, icon: Icon, extra }) => (
//                   <li
//                     key={path}
//                     onClick={() =>
//                       userInfo.role === "Buyer" && setIsCollapsed(true)
//                     }
//                   >
//                     <Link
//                       to={path}
//                       className="flex items-center p-2 hover:bg-gray-700 hover:text-white rounded-lg transition-all"
//                     >
//                       <Icon className="mr-3" size={24} />
//                       <span>{label}</span>
//                       {extra}
//                     </Link>
//                   </li>
//                 )
//               )}
//           </ul>

//           {/* Login/Register (Only for non-logged in users) */}
//           {!userInfo && (
//             <ul className="mt-4">
//               <li
//                 onClick={() =>
//                   userInfo?.role === "Buyer" && setIsCollapsed(true)
//                 }
//               >
//                 <Link
//                   to="/login"
//                   className="flex items-center p-2 hover:bg-gray-700 hover:text-white rounded-lg transition-all"
//                 >
//                   <AiOutlineLogin className="mr-3" size={24} />
//                   <span>Login</span>
//                 </Link>
//               </li>
//               <li
//                 onClick={() =>
//                   userInfo?.role === "Buyer" && setIsCollapsed(true)
//                 }
//               >
//                 <Link
//                   to="/register"
//                   className="flex items-center p-2 hover:bg-gray-700 hover:text-white rounded-lg transition-all"
//                 >
//                   <AiOutlineUserAdd className="mr-3" size={24} />
//                   <span>Register</span>
//                 </Link>
//               </li>
//             </ul>
//           )}
//         </div>

//         {/* Fixed Footer */}
//         <div className="mt-auto">
//           {/* Profile & Logout (Only for logged in users) */}
//           {userInfo && (
//             <div className="border-t border-gray-700">
//               <ul>
//                 <li
//                   onClick={() =>
//                     userInfo.role === "Buyer" && setIsCollapsed(true)
//                   }
//                 >
//                   <Link
//                     to="/profile"
//                     className="flex items-center p-3 hover:bg-gray-700 hover:text-white transition-all"
//                   >
//                     <CgProfile className="mr-3" size={24} />
//                     <span>Profile</span>
//                   </Link>
//                 </li>
//                 <li>
//                   <button
//                     onClick={logoutHandler}
//                     className="flex items-center p-3 hover:text-red-500 w-full text-left border-t border-gray-700"
//                   >
//                     <FiLogOut className="mr-3" size={24} />
//                     <span>Logout</span>
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           )}

//           {/* Theme Toggle */}
//           <div className="p-4 flex justify-center border-t border-gray-700">
//             <ThemeToggle />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Navigation;


import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import logo from "../../Assets/logo3.png";
import FavoritesCount from "../Products/FavoritesCount";
import ThemeToggle from "../../components/ThemeToggle";
import {
  LayoutDashboard,
  Package,
  Tag,
  Box,
  Star,
  Home,
  ShoppingBag,
  ShoppingCart,
  HeartIcon,
  History,
  Bug,
  BellIcon,
  MenuIcon,
  PackageSearch,
  ShieldCheck,
  AlertTriangle,
  Boxes,
  X
} from "lucide-react";
import {
  AiOutlineUsergroupAdd,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { FiMenu } from "react-icons/fi";

const menuItems = {
  Admin: [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/productlist", label: "Products", icon: Package },
    { path: "/admin/categorylist", label: "Category", icon: Tag },
    { path: "/admin/subCategorylist", label: "Sub-Category", icon: Tag },
    { path: "/admin/brandlist", label: "Brand", icon: Box },
    {
      path: "/admin/all-users",
      label: "All Customers",
      icon: AiOutlineUsergroupAdd,
    },
    { path: "/admin/orderlist", label: "Orders", icon: Star },
    {
      path: "/admin/coupon",
      label: "Coupon Code",
      icon: AiOutlineShoppingCart,
    },
    { path: "/admin/user-cart", label: "Customer Cart", icon: ShoppingCart },
    { path: "/admin/search-history", label: "Search History", icon: History },
    { path: "/admin/bug-reports", label: "Bug Reports", icon: Bug },
    {
      path: "/admin/admin-notification",
      label: "Broadcast ",
      icon: BellIcon,
    },
     {
      path: "/admin/allproductslist",
      label: "All Products",
      icon: PackageSearch,
    },
     { path: "/admin/userlist", label: "Manage Users", icon: ShieldCheck },
        { path: "/admin/admin-inventory", label: "Inventory", icon: Boxes  },
        { path: "/admin/low-stock", label: "Low Stock", icon: AlertTriangle },
  ],
  Buyer: [
    { path: "/", label: "Home", icon: Home },
    { path: "/shop", label: "Shop", icon: ShoppingBag },
    { path: "/cart", label: "Cart", icon: ShoppingCart },
    {
      path: "/favorite",
      label: "Favorites",
      icon: HeartIcon,
      extra: <FavoritesCount />,
    },
    { path: "/yourorder", label: "Your Order", icon: AiOutlineShoppingCart },
  ],
};

const Navigation = ({ onActiveItemChange }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutApiCall] = useLogoutMutation();
  const sidebarRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  // Set initial state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(userInfo?.role === "Admin" ? true : false);
      } else {
        setIsOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [userInfo]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      if (userInfo?.role === "Buyer") setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle outside clicks (only for mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        window.innerWidth < 1024 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Find active menu item
  const activeMenuItem = userInfo && menuItems[userInfo.role]?.find(
    item => location.pathname === item.path
  );

  // Notify parent component about active item changes
  useEffect(() => {
    if (activeMenuItem && onActiveItemChange) {
      onActiveItemChange(activeMenuItem.label);
    }
  }, [activeMenuItem, onActiveItemChange]);

  return (
    <>
      {/* Mobile toggle button */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-2.5 left-3 z-50 p-2 rounded-lg  text-black lg:hidden"
        >
          <FiMenu  size={24} />
        </button>
      )}

      {/* Backdrop overlay for mobile */}
      {isOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col shadow-lg transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${userInfo?.role === "Admin" ? "lg:translate-x-0" : ""}`}
      >
        {/* CSS for Scrollbar Styling */}
        <style>{`
          /* Scrollbar styles for Webkit browsers (Chrome, Safari, newer Edge) */
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #1f2937; /* Dark gray track */
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #4b5563; /* Gray thumb */
            border-radius: 20px;
            border: 2px solid #1f2937; /* Creates padding effect */
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #6b7280; /* Lighter gray on hover */
          }
          
          /* For Firefox */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #4b5563 #1f2937;
          }
        `}</style>

        {/* Mobile close button */}
        {isOpen && window.innerWidth < 1024 && (
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-white p-1 lg:hidden"
          >
            <X size={24} />
          </button>
        )}

        {/* Fixed Header */}
        <div className="p-5 pb-2">
          {/* Logo */}
          <div className="mb-2 flex justify-between items-center">
            <img src={logo} alt="Logo" className="h-10 object-contain" />
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-5 pb-2 custom-scrollbar">
          {/* Sidebar Links */}
          <ul className="space-y-2">
            {userInfo &&
              menuItems[userInfo.role] &&
              menuItems[userInfo.role].map(
                ({ path, label, icon: Icon, extra }) => {
                  const isActive = location.pathname === path;
                  
                  return (
                    <li
                      key={path}
                      onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    >
                      <Link
                        to={path}
                        className={`flex items-center p-2 hover:bg-gray-700 hover:text-white rounded-lg transition-all ${
                          isActive ? "bg-gray-700 text-white" : ""
                        }`}
                      >
                        <Icon className="mr-3" size={24} />
                        <span>{label}</span>
                        {extra}
                      </Link>
                    </li>
                  );
                }
              )}
          </ul>

          {/* Login/Register (Only for non-logged in users) */}
          {!userInfo && (
            <ul className="mt-4">
              <li onClick={() => window.innerWidth < 1024 && toggleSidebar()}>
                <Link
                  to="/login"
                  className="flex items-center p-2 hover:bg-gray-700 hover:text-white rounded-lg transition-all"
                >
                  <AiOutlineLogin className="mr-3" size={24} />
                  <span>Login</span>
                </Link>
              </li>
              <li onClick={() => window.innerWidth < 1024 && toggleSidebar()}>
                <Link
                  to="/register"
                  className="flex items-center p-2 hover:bg-gray-700 hover:text-white rounded-lg transition-all"
                >
                  <AiOutlineUserAdd className="mr-3" size={24} />
                  <span>Register</span>
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Fixed Footer */}
        <div className="mt-auto">
          {/* Profile & Logout (Only for logged in users) */}
          {userInfo && (
            <div className="border-t border-gray-700">
              <ul>
                {/* <li onClick={() => window.innerWidth < 1024 && toggleSidebar()}>
                  <Link
                    to="/profile"
                    className="flex items-center p-3 hover:bg-gray-700 hover:text-white transition-all"
                  >
                    <CgProfile className="mr-3" size={24} />
                    <span>Profile</span>
                  </Link>
                </li> */}
                <li>
                  <button
                    onClick={logoutHandler}
                    className="flex items-center p-3 hover:text-red-500 w-full text-left border-t border-gray-700"
                  >
                    <FiLogOut className="mr-3" size={24} />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Theme Toggle */}
          {/* <div className="p-4 flex justify-center border-t border-gray-700">
            <ThemeToggle />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Navigation;