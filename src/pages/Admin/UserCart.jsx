// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import AdminMenu from "./AdminMenu";
// import Loader from "../../components/Loader";
// import Message from "../../components/Message";
// import { FaChevronLeft, FaChevronRight, FaTrash } from "react-icons/fa";
// import { BASE_URL } from "../../redux/constants";

// // Import the API slice functions
// import {
//   useGetUsersWithCartQuery,
//   useAdminRemoveUserCartItemMutation,
//   useRemoveAllCartItemsOfUserMutation,
// } from "../../redux/api/usersApiSlice";

// const UserCartList = () => {
//   const { userInfo } = useSelector((state) => state.auth);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit] = useState(15);
//   const [expandedUser, setExpandedUser] = useState(null);

//   // API queries and mutations
//   const {
//     data: usersWithCartData,
//     refetch,
//     isLoading,
//     error,
//   } = useGetUsersWithCartQuery();

//   const [removeCartItem, { isLoading: isRemovingItem }] =
//     useAdminRemoveUserCartItemMutation();
//   const [clearUserCart, { isLoading: isClearingCart }] =
//     useRemoveAllCartItemsOfUserMutation();

//   // State to store user data
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     if (usersWithCartData) {
//       setUsers(usersWithCartData);
//     }
//   }, [usersWithCartData]);

//   // Pagination calculations
//   const totalUsers = users.length;
//   const totalPages = Math.ceil(totalUsers / limit);
//   const paginatedUsers = users.slice(
//     (currentPage - 1) * limit,
//     currentPage * limit
//   );

//   // Toggle user expansion to show/hide cart items
//   const toggleUserExpand = (userId) => {
//     if (expandedUser === userId) {
//       setExpandedUser(null);
//     } else {
//       setExpandedUser(userId);
//     }
//   };

//   // Handle removing a cart item
//   const handleRemoveCartItem = async (userId, productId) => {
//     try {
//       await removeCartItem({ userId, productId }).unwrap();
//       refetch();
//     } catch (error) {
//       console.error("Error removing cart item:", error);
//       alert(
//         error?.data?.message || "An error occurred while removing the item."
//       );
//     }
//   };

//   // Handle clearing all cart items for a user
//   const handleClearUserCart = async (userId) => {
//     if (window.confirm("Are you sure you want to clear this user's cart?")) {
//       try {
//         await clearUserCart({ userId }).unwrap();
//         refetch();
//       } catch (error) {
//         console.error("Error clearing user cart:", error);
//         alert(
//           error?.data?.message || "An error occurred while clearing the cart."
//         );
//       }
//     }
//   };

//   // Pagination handlers
//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//     }
//   };

//   // Calculate cart total for a user
//   const calculateCartTotal = (cart) => {
//     return cart.reduce((total, item) => {
//       return total + (item.productId?.price || 0) * item.quantity;
//     }, 0);
//   };

//   return (
//     <>
//       <div className="flex flex-col items-center darktheme px-6 pb-6">
//         <section className="w-full darktheme bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-600 ">
//           <h1 className="text-2xl font-semibold mb-6 text-center text-customBlue">
//             User Cart Management
//           </h1>
//           {isLoading ? (
//             <Loader />
//           ) : error ? (
//             <Message variant="danger">
//               {error?.data?.message || error.error}
//             </Message>
//           ) : (
//             <>
//               <AdminMenu />
//               <div className="overflow-x-auto overflow-y-hidden">
//                 <table className="table-auto w-full mt-2 rounded-lg overflow-hidden">
//                   <thead>
//                     <tr className="tableheading text-sm">
//                       <th className="px-4 py-2 text-left font-medium">USER</th>
//                       <th className="px-4 py-2 text-left font-medium">EMAIL</th>
//                       <th className="px-4 py-2 text-left font-medium">
//                         CART ITEMS
//                       </th>
//                       {/* <th className="px-4 py-2 text-left font-medium">TOTAL VALUE</th> */}
//                       <th className="px-4 py-2 text-left font-medium">
//                         ACTIONS
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {paginatedUsers.map((user) => (
//                       <React.Fragment key={user._id}>
//                         <tr className="tablecontent transition-colors text-sm">
//                           <td className="px-4 py-2">{user.username}</td>
//                           <td className="px-4 py-2">{user.email}</td>
//                           <td className="px-4 py-2">
//                             <span className="p-1 text-center bg-blue-400 w-[3rem] rounded-full text-xs">
//                               {user.cart.length}
//                             </span>
//                           </td>
//                           {/* <td className="px-4 py-2">&#8377; {calculateCartTotal(user.cart).toFixed(2)}</td> */}
//                           <td className="px-4 py-2">
//                             <div className="flex space-x-2">
//                               <button
//                                 onClick={() => toggleUserExpand(user._id)}
//                                 className="text-xs bg-customBlue text-white px-3 py-1 rounded-md"
//                               >
//                                 {expandedUser === user._id ? "Hide" : "View"}{" "}
//                                 Cart
//                               </button>
//                               <button
//                                 onClick={() => handleClearUserCart(user._id)}
//                                 className="text-xs bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-1"
//                                 disabled={isClearingCart}
//                               >
//                                 <FaTrash size={10} /> Clear
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                         {expandedUser === user._id && (
//                           <tr>
//                             <td colSpan="5" className="px-4 py-2">
//                               <div className="rounded-lg overflow-hidden border border-gray-600">
//                                 <table className="table-auto w-full">
//                                   <thead>
//                                     <tr className="tableheading text-xs">
//                                       <th className="px-4 py-2 text-left font-medium">
//                                         PRODUCT
//                                       </th>
//                                       <th className="px-4 py-2 text-left font-medium">
//                                         NAME
//                                       </th>
//                                       <th className="px-4 py-2 text-left font-medium">
//                                         PRICE
//                                       </th>
//                                       <th className="px-4 py-2 text-left font-medium">
//                                         QTY
//                                       </th>
//                                       <th className="px-4 py-2 text-left font-medium">
//                                         SUBTOTAL
//                                       </th>
//                                       <th className="px-4 py-2 text-left font-medium">
//                                         ACTION
//                                       </th>
//                                     </tr>
//                                   </thead>
//                                   <tbody>
//                                     {user.cart.map((item) => (
//                                       <tr
//                                         key={item.productId?._id}
//                                         className="tablecontent text-xs"
//                                       >
//                                         <td className="px-4 py-2">
//                                           <div className="w-12 h-12 flex items-center justify-center">
//                                             {item.productId?.image ? (
//                                               <img
//                                                 src={
//                                                   BASE_URL +
//                                                   item.productId.image
//                                                 }
//                                                 alt={item.productId.name}
//                                                 className="w-full h-full object-cover rounded-md"
//                                               />
//                                             ) : (
//                                               <p className="text-gray-400 text-xs">
//                                                 No Image
//                                               </p>
//                                             )}
//                                           </div>
//                                         </td>
//                                         <td className="px-4 py-2">
//                                           {item.productId?.name ||
//                                             "Product not found"}
//                                         </td>
//                                         <td className="px-4 py-2">
//                                           &#8377;{" "}
//                                           {item.productId?.price || item.price}
//                                         </td>
//                                         <td className="px-4 py-2">
//                                           {item.qty}
//                                         </td>
//                                         <td className="px-4 py-2">
//                                           ₹{" "}
//                                           {(
//                                             (item.productId?.price
//                                               ? item.productId.price
//                                               : item.price) * item.qty
//                                           ).toFixed(2)}
//                                         </td>
//                                         <td className="px-4 py-2">
//                                           <button
//                                             onClick={() =>
//                                               handleRemoveCartItem(
//                                                 user._id,
//                                                 item.productId?._id
//                                               )
//                                             }
//                                             className="p-1 bg-red-500 text-white rounded-full"
//                                             disabled={isRemovingItem}
//                                           >
//                                             <FaTrash size={10} />
//                                           </button>
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </tbody>
//                                 </table>
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     ))}
//                   </tbody>
//                 </table>
//                 {totalPages > 0 && (
//                   <div className="flex justify-center items-center mt-6 space-x-3">
//                     <button
//                       onClick={handlePrevPage}
//                       disabled={currentPage === 1}
//                       className="px-4 py-2 aspect-square pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
//                       aria-label="Previous Page"
//                     >
//                       <FaChevronLeft />
//                     </button>
//                     <div className="flex items-center space-x-2">
//                       {Array.from({ length: totalPages }, (_, index) => (
//                         <button
//                           key={index + 1}
//                           onClick={() => setCurrentPage(index + 1)}
//                           className={`px-4 py-2 aspect-square rounded-full font-semibold text-sm transition duration-300 ease-in-out ${
//                             currentPage === index + 1
//                               ? "text-customBlue shadow hover:scale-105"
//                               : "pagination text-white hover:bg-customBlue/80"
//                           }`}
//                           aria-label={`Go to page ${index + 1}`}
//                         >
//                           {index + 1}
//                         </button>
//                       ))}
//                     </div>
//                     <button
//                       onClick={handleNextPage}
//                       disabled={currentPage === totalPages}
//                       className="px-4 py-2 aspect-square pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
//                       aria-label="Next Page"
//                     >
//                       <FaChevronRight />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </section>
//       </div>
//     </>
//   );
// };

// export default UserCartList;


import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { FaChevronLeft, FaChevronRight, FaTrash, FaSearch, FaFilter, FaEye, FaEyeSlash } from "react-icons/fa";
import { BASE_URL } from "../../redux/constants";

// Import the API slice functions
import {
  useGetUsersWithCartQuery,
  useAdminRemoveUserCartItemMutation,
  useRemoveAllCartItemsOfUserMutation,
} from "../../redux/api/usersApiSlice";

const UserCartList = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [expandedUser, setExpandedUser] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [usernameFilter, setUsernameFilter] = useState("");
  const [itemCountFilter, setItemCountFilter] = useState("");

  // API queries and mutations
  const {
    data: usersWithCartData,
    refetch,
    isLoading,
    error,
  } = useGetUsersWithCartQuery();

  const [removeCartItem, { isLoading: isRemovingItem }] =
    useAdminRemoveUserCartItemMutation();
  const [clearUserCart, { isLoading: isClearingCart }] =
    useRemoveAllCartItemsOfUserMutation();

  // State to store user data
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (usersWithCartData) {
      setUsers(usersWithCartData);
      applyFilters(usersWithCartData);
    }
  }, [usersWithCartData]);

  useEffect(() => {
    applyFilters(users);
  }, [searchTerm, usernameFilter, itemCountFilter, currentPage]);

  const applyFilters = (data) => {
    let filtered = [...data];

    // Apply search term filter (searches across username and email)
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply username filter
    if (usernameFilter) {
      filtered = filtered.filter(
        (user) => user.username.toLowerCase().includes(usernameFilter.toLowerCase())
      );
    }

    // Apply item count filter
    if (itemCountFilter) {
      const count = parseInt(itemCountFilter);
      if (!isNaN(count)) {
        filtered = filtered.filter((user) => user.cart.length === count);
      }
    }

    setFilteredUsers(filtered);
  };
  
  // Pagination calculations
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / limit);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  // Toggle user expansion to show/hide cart items
  const toggleUserExpand = (userId) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
  };

  // Handle removing a cart item
  const handleRemoveCartItem = async (userId, productId) => {
    try {
      await removeCartItem({ userId, productId }).unwrap();
      refetch();
    } catch (error) {
      console.error("Error removing cart item:", error);
      alert(
        error?.data?.message || "An error occurred while removing the item."
      );
    }
  };

  // Handle clearing all cart items for a user
  const handleClearUserCart = async (userId) => {
    if (window.confirm("Are you sure you want to clear this user's cart?")) {
      try {
        await clearUserCart({ userId }).unwrap();
        refetch();
      } catch (error) {
        console.error("Error clearing user cart:", error);
        alert(
          error?.data?.message || "An error occurred while clearing the cart."
        );
      }
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Calculate cart total for a user
  const calculateCartTotal = (cart) => {
    return cart.reduce((total, item) => {
      return total + (item.productId?.price || 0) * item.quantity;
    }, 0);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setUsernameFilter("");
    setItemCountFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen darktheme">
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <section className="w-full darktheme bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 ">
          {/* <h1 className="text-2xl font-semibold mb-6 text-center text-customBlue">
            User Cart Management
          </h1> */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <>
              {/* <AdminMenu /> */}
              
              {/* Search and Filter Section */}
              <div className="mb-6 mt-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search by username or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
                  </button>
                </div>

                {showFilters && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mt-4 border border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Filter by Username
                        </label>
                        <input
                          type="text"
                          placeholder="Enter username..."
                          value={usernameFilter}
                          onChange={(e) => setUsernameFilter(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Filter by Item Count
                        </label>
                        <input
                          type="number"
                          placeholder="Enter number of items..."
                          value={itemCountFilter}
                          onChange={(e) => setItemCountFilter(e.target.value)}
                          min="0"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={clearFilters}
                          className="w-full p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                {paginatedUsers.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Username</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cart Items</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {paginatedUsers.map((user) => (
                        <React.Fragment key={user._id}>
                          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{user.username}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2.5 py-1 text-center bg-blue-400 rounded-full text-xs text-white font-medium">
                                {user.cart.length}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              ₹ {calculateCartTotal(user.cart).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => toggleUserExpand(user._id)}
                                  className="text-xs bg-customBlue text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-blue-700 transition-colors"
                                >
                                  {expandedUser === user._id ? <><FaEyeSlash size={10} /> Hide</> : <><FaEye size={10} /> View</>}
                                </button>
                                <button
                                  onClick={() => handleClearUserCart(user._id)}
                                  className="text-xs bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-red-600 transition-colors"
                                  disabled={isClearingCart}
                                >
                                  <FaTrash size={10} /> Clear
                                </button>
                              </div>
                            </td>
                          </tr>
                          {expandedUser === user._id && (
                            <tr>
                              <td colSpan="5" className="px-6 py-4">
                                <div className="rounded-lg overflow-hidden border border-gray-600">
                                  <table className="table-auto w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Qty</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subtotal</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                      {user.cart.map((item) => (
                                        <tr
                                          key={item.productId?._id}
                                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                          <td className="px-4 py-2 whitespace-nowrap">
                                            <div className="w-12 h-12 flex items-center justify-center">
                                              {item.productId?.image ? (
                                                <img
                                                  src={
                                                    BASE_URL +
                                                    item.productId.image
                                                  }
                                                  alt={item.productId.name}
                                                  className="w-full h-full object-cover rounded-md"
                                                />
                                              ) : (
                                                <p className="text-gray-400 text-xs">
                                                  No Image
                                                </p>
                                              )}
                                            </div>
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {item.productId?.name ||
                                              "Product not found"}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            ₹ {item.productId?.price || item.price}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {item.qty}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                            ₹{" "}
                                            {(
                                              (item.productId?.price
                                                ? item.productId.price
                                                : item.price) * item.qty
                                            ).toFixed(2)}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap">
                                            <button
                                              onClick={() =>
                                                handleRemoveCartItem(
                                                  user._id,
                                                  item.productId?._id
                                                )
                                              }
                                              className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                              disabled={isRemovingItem}
                                            >
                                              <FaTrash size={10} />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-16">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No carts found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No user carts found with the current filters.</p>
                  </div>
                )}
              </div>

              {totalPages > 0 && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-4 rounded-md">
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Previous Page"
                    >
                      <FaChevronLeft size={14} />
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: totalPages > 5 ? 5 : totalPages },
                        (_, index) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = index + 1;
                          } else {
                            if (currentPage <= 3) {
                              pageNum = index + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + index;
                            } else {
                              pageNum = currentPage - 2 + index;
                            }
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                                currentPage === pageNum
                                  ? "bg-customBlue text-white"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                              }`}
                              aria-label={`Go to page ${pageNum}`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="text-gray-700 dark:text-gray-300">...</span>
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            aria-label={`Go to page ${totalPages}`}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Next Page"
                    >
                      <FaChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserCartList;