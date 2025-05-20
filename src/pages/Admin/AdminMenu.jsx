// import { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { FaTimes } from "react-icons/fa";
// import { FiMenu } from "react-icons/fi"; // Animated Menu Icon
// import { useSelector } from "react-redux";

// const AdminMenu = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { userInfo } = useSelector((state) => state.auth);

//   // Check if the user role is authorized
//   const isAuthorized = userInfo && ["Admin", "Accounts", "Inventory"].includes(userInfo.role);

//   if (!isAuthorized) return null;

//   return (
//     <>
//       {/* Menu Toggle Button */}
//       <button
//         onClick={() => setIsMenuOpen(!isMenuOpen)}
//         className="fixed top-5 right-6 text-white bg-gray-800 p-2 rounded-lg z-50 transition-all hover:bg-gray-700"
//       >
//         {isMenuOpen ? <FaTimes size={20} /> : <FiMenu size={24} />}
//       </button>

//       {/* Animated Menu Panel */}
//       <div
//         className={`fixed top-0 right-0 h-full bg-gray-900 shadow-lg z-40 w-64 transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"
//           }`}
//       >
//         <div className="p-5 text-white flex flex-col h-full">
//           <h2 className="text-lg font-semibold mb-4 text-center">Admin Menu</h2>

//           <ul className="flex-1 space-y-3">
//             {[
//               // { path: "/admin/dashboard", label: "Dashboard" },
//               // { path: "/admin/categorylist", label: "Create Category" },
//               // { path: "/admin/productlist", label: "Create Product" },
//               { path: "/admin/allproductslist", label: "All Products" },
//               { path: "/admin/userlist", label: "Manage Users" },
//               // { path: "/admin/orderlist", label: "Manage Orders" },
//               { path: "/admin/admin-inventory", label: "Inventory" },
//               { path: "/admin/low-stock", label: "Low Stock" },
//             ].map(({ path, label }) => (
//               <li key={path} onClick={() => setIsMenuOpen(false)}>
//                 <NavLink
//                   to={path}
//                   className={({ isActive }) =>
//                     `block px-4 py-2 rounded-lg transition-all ${isActive
//                       ? "bg-blue-500 text-white"
//                       : "text-gray-300 hover:bg-gray-700 hover:text-white"
//                     }`
//                   }
//                 >
//                   {label}
//                 </NavLink>
//               </li>
//             ))}
//           </ul>

//           {/* Close Button */}
         
//         </div>
//       </div>

//       {/* Backdrop when Menu is Open */}
//       {isMenuOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={() => setIsMenuOpen(false)}
//         ></div>
//       )}
//     </>
//   );
// };

// export default AdminMenu;


import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { MdInventory, MdPeople, MdViewList } from "react-icons/md";
import { useSelector } from "react-redux";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const isAuthorized = userInfo && ["Admin", "Accounts", "Inventory"].includes(userInfo.role);
  if (!isAuthorized) return null;

  const menuItems = [
    { path: "/admin/allproductslist", label: "All Products", icon: <MdViewList size={18} /> },
    { path: "/admin/userlist", label: "Manage Users", icon: <MdPeople size={18} /> },
    { path: "/admin/admin-inventory", label: "Inventory", icon: <MdInventory size={18} /> },
    { path: "/admin/low-stock", label: "Low Stock", icon: <MdInventory size={18} /> },
  ];

  return (
    <>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-2.5 right-3   p-2 rounded-lg z-50 transition-all text-black"
      >
        {isMenuOpen ? <FaTimes size={20} /> : <FiMenu size={24} />}
      </button>

      <div
        className={`fixed top-16 right-6 w-48 bg-gray-900 shadow-lg rounded-md z-40 transition-transform duration-300 p-3 space-y-2 ${
          isMenuOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <ul className="text-white text-sm space-y-2">
          {menuItems.map(({ path, label, icon }) => (
            <li key={path} onClick={() => setIsMenuOpen(false)}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`
                }
              >
                {icon}
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default AdminMenu;
