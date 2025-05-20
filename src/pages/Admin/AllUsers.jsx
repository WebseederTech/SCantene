// import { useEffect, useState } from "react";
// import {
//   FaTrash,
//   FaEdit,
//   FaCheck,
//   FaChevronLeft,
//   FaChevronRight,
// } from "react-icons/fa";
// import Message from "../../components/Message";
// import Loader from "../../components/Loader";
// import {
//   useDeleteUserMutation,
//   useGetOnlyBuyersQuery,
//   useGetUsersQuery,
//   useUpdateUserMutation,
// } from "../../redux/api/usersApiSlice";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router";
// import { useSelector } from "react-redux";
// import UserExport from "./UserExport";
// import UserImport from "./UserImport";
// import AdminMenu from "./AdminMenu";

// const AllUsers = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit] = useState(100);

//   const {
//     data: users,
//     refetch,
//     isLoading,
//     error,
//   } = useGetUsersQuery({
//     page: currentPage,
//     limit,
//   });

//   const { userInfo } = useSelector((state) => state.auth);
//   const [deleteUser] = useDeleteUserMutation();
//   const [updateUser] = useUpdateUserMutation();
//   const navigate = useNavigate();

//   const [editableRow, setEditableRow] = useState(null);
//   const [editedFields, setEditedFields] = useState({});

//   useEffect(() => {
//     refetch();
//   }, [currentPage, refetch]);

//   const deleteHandler = async (id) => {
//     if (window.confirm("Are you sure?")) {
//       try {
//         await deleteUser(id);
//         toast.success("User deleted successfully!");
//         refetch();
//       } catch (err) {
//         toast.error(err?.data?.message || err.error);
//       }
//     }
//   };

//   const toggleEdit = (user) => {
//     const userAddress = user?.addresses?.[0] || {};
//     const initialFields = {
//       userID: user?.userID || "",
//       username: user?.username || "",
//       email: user?.email || "",
//       contactNo: user?.contactNo || "",
//       city: userAddress.city || "",
//       address: userAddress.address || "",
//       postalCode: userAddress.postalCode || "",
//       country: userAddress.country || "",
//       shopName: user?.shopName || "",
//     };
//     console.log("Initial Fields for Editing:", initialFields);
//     setEditedFields(initialFields);
//     setEditableRow(user._id);
//   };

//   const updateHandler = async (id) => {
//     console.log("Updating User:", { id, ...editedFields });
//     try {
//       await updateUser({
//         userId: id,
//         ...editedFields,
//       });
//       setEditableRow(null);
//       toast.success("User updated successfully!");
//       refetch();
//     } catch (err) {
//       console.error("Update Error:", err);
//       toast.error(err?.data?.message || err.error);
//     }
//   };

//   const cancelEdit = () => {
//     setEditableRow(null);
//     setEditedFields({});
//   };

//   const handleFieldChange = (field, value) => {
//     setEditedFields((prev) => ({ ...prev, [field]: value }));
//     console.log("Edited Fields:", { ...editedFields, [field]: value });
//   };

//   const handleNextPage = () => {
//     if (currentPage < users.pagination.totalPages) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center darktheme px-6">
//       <section className="w-full  darktheme bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-600 ">
//         <AdminMenu />
//         <h1 className="text-2xl font-semibold mb-6 text-center text-customBlue">
//           Users
//         </h1>
//         <div className="flex flex-col sm:flex-row justify-end items-center sm:items-start w-full">
//           {/* <button
//             onClick={() => navigate("/admin/add-user")}
//             className="mb-4 sm:mb-0 bg-customBlue text-white py-2 px-4 rounded-lg hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-opacity-50 w-full sm:w-auto"
//           >
//             Add User
//           </button> */}
//           <div className="flex flex-wrap sm:flex-row justify-end gap-2 sm:mb-0 mb-2">
//             <UserExport
//               limit={5}
//               currentPage={currentPage}
//               fileName="User_Data"
//             />
//             <UserImport />
//           </div>
//         </div>
//         {isLoading ? (
//           <Loader />
//         ) : error ? (
//           <Message variant="danger">
//             {error?.data?.message || error.error}
//           </Message>
//         ) : (
//           <>
//             <div className="overflow-x-auto mt-4 rounded-lg text-sm">
//               <table className="table-auto w-full text-white">
//                 <thead>
//                   <tr className="tableheading">
//                     <th className="px-6 py-4 text-left font-medium">ID</th>
//                     <th className="px-6 py-4 text-left font-medium">Name</th>
//                     <th className="px-6 py-4 text-left font-medium">
//                       {" "}
//                       Shop Name
//                     </th>

//                     <th className="px-6 py-4 text-left font-medium">Email</th>
//                     <th className="px-6 py-4 text-left font-medium">
//                       Contact No
//                     </th>
//                     <th className="px-6 py-4 text-left font-medium">City</th>
//                     <th className="px-6 py-4 text-left font-medium">Address</th>
//                     <th className="px-6 py-4 text-left font-medium">
//                       Postal Code
//                     </th>
//                     <th className="px-6 py-4 text-left font-medium">Country</th>
//                     <th className="px-6 py-4 text-left font-medium">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.data.map((user, i) => {
//                     const userAddress = user.addresses[0] || {}; // Fallback if addresses are empty
//                     return (
//                       <tr
//                         key={user._id}
//                         className="tablecontent transition-colors"
//                       >
//                         {editableRow === user._id ? (
//                           <>
//                             <td className="px-6 py-4">
//                               <input
//                                 type="text"
//                                 value={editedFields.userID || ""}
//                                 onChange={(e) =>
//                                   handleFieldChange("userID", e.target.value)
//                                 }
//                                 className="w-full p-2 border rounded-lg text-black"
//                               />
//                             </td>
//                             <td className="px-6 py-4">
//                               <input
//                                 type="text"
//                                 value={editedFields.username || ""}
//                                 onChange={(e) =>
//                                   handleFieldChange("username", e.target.value)
//                                 }
//                                 className="w-full p-2 border rounded-lg text-black"
//                               />
//                             </td>
//                             <td className="px-6 py-4">
//                               <input
//                                 type="text"
//                                 value={editedFields.shopName || ""}
//                                 onChange={(e) =>
//                                   handleFieldChange("shopName", e.target.value)
//                                 }
//                                 className="w-full p-2 border rounded-lg text-black"
//                               />
//                             </td>
//                             <td className="px-6 py-4">
//                               <input
//                                 type="email"
//                                 value={editedFields.email || ""}
//                                 onChange={(e) =>
//                                   handleFieldChange("email", e.target.value)
//                                 }
//                                 className="w-full p-2 border rounded-lg text-black"
//                               />
//                             </td>
//                             <td className="px-6 py-4">
//                               <input
//                                 type="text"
//                                 value={editedFields.contactNo || ""}
//                                 onChange={(e) =>
//                                   handleFieldChange("contactNo", e.target.value)
//                                 }
//                                 className="w-full p-2 border rounded-lg text-black"
//                               />
//                             </td>
//                             <td className="px-6 py-4">
//                               <input
//                                 type="text"
//                                 value={editedFields.city || ""}
//                                 onChange={(e) =>
//                                   handleFieldChange("city", e.target.value)
//                                 }
//                                 className="w-full p-2 border rounded-lg text-black"
//                               />
//                             </td>
//                             <td className="px-6 py-4">
//                               <input
//                                 type="text"
//                                 value={editedFields.address || ""}
//                                 onChange={(e) =>
//                                   handleFieldChange("address", e.target.value)
//                                 }
//                                 className="w-full p-2 border rounded-lg text-black"
//                               />
//                             </td>
//                             <td className="px-6 py-4">
//                               <input
//                                 type="text"
//                                 value={editedFields.postalCode || ""}
//                                 onChange={(e) =>
//                                   handleFieldChange(
//                                     "postalCode",
//                                     e.target.value
//                                   )
//                                 }
//                                 className="w-full p-2 border rounded-lg text-black"
//                               />
//                             </td>
//                             <td className="px-6 py-4">
//                               <input
//                                 type="text"
//                                 value={editedFields.country || ""}
//                                 onChange={(e) =>
//                                   handleFieldChange("country", e.target.value)
//                                 }
//                                 className="w-full p-2 border rounded-lg text-black"
//                               />
//                             </td>
//                             <td className="px-6 py-4">
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => updateHandler(user._id)}
//                                   className="bg-blue-500 text-white font-bold py-1 px-3 rounded hover:bg-blue-600"
//                                 >
//                                   Save
//                                 </button>
//                                 <button
//                                   onClick={cancelEdit}
//                                   className="bg-gray-400 text-white font-bold py-1 px-3 rounded hover:bg-gray-500"
//                                 >
//                                   Cancel
//                                 </button>
//                               </div>
//                             </td>
//                           </>
//                         ) : (
//                           <>
//                             <td className="px-6 py-4">
//                               {i + 1 || "N/A"}
//                             </td>
//                             <td className="px-6 py-4">
//                               {user.username || "N/A"}
//                             </td>
//                             <td className="px-6 py-4">
//                               {user.shopName || "N/A"}
//                             </td>
//                             <td className="px-6 py-4">
//                               <a href={`mailto:${user.email}`}>{user.email}</a>
//                             </td>
//                             <td className="px-6 py-4">
//                               {user.contactNo || "N/A"}
//                             </td>
//                             <td className="px-6 py-4">
//                               {userAddress.city || "N/A"}
//                             </td>
//                             <td className="px-6 py-4">
//                               {userAddress.address || "N/A"}
//                             </td>
//                             <td className="px-6 py-4">
//                               {userAddress.postalCode || "N/A"}
//                             </td>
//                             <td className="px-6 py-4">
//                               {userAddress.country || "N/A"}
//                             </td>
//                             <td className=" py-4">
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => toggleEdit(user)}
//                                   className="font-bold py-1  rounded"
//                                 >
//                                   <FaEdit className="ml-[1rem]" />
//                                 </button>
//                                 {!user.isAdmin && (
//                                   <button
//                                     onClick={() => deleteHandler(user._id)}
//                                     className="font-bold py-1  rounded"
//                                   >
//                                     <FaTrash />
//                                   </button>
//                                 )}
//                               </div>
//                             </td>
//                           </>
//                         )}
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//             <div className="flex justify-center items-center mt-6 space-x-3">
//               <button
//                 onClick={handlePrevPage}
//                 disabled={currentPage === 1}
//                 className="px-4 py-2 aspect-square pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
//                 aria-label="Previous Page"
//               >
//                 <FaChevronLeft />
//               </button>
//               <div className="flex items-center space-x-2">
//                 {Array.from(
//                   { length: users.pagination.totalPages },
//                   (_, index) => (
//                     <button
//                       key={index + 1}
//                       onClick={() => setCurrentPage(index + 1)}
//                       className={`px-4 py-2 aspect-square rounded-full font-semibold text-sm transition duration-300 ease-in-out ${currentPage === index + 1
//                         ? "text-customBlue shadow hover:scale-105"
//                         : "pagination text-white hover:bg-customBlue/80"
//                         }`}
//                       aria-label={`Go to page ${index + 1}`}
//                     >
//                       {index + 1}
//                     </button>
//                   )
//                 )}
//               </div>
//               <button
//                 onClick={handleNextPage}
//                 disabled={currentPage === users.pagination.totalPages}
//                 className="px-4 py-2 aspect-square pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
//                 aria-label="Next Page"
//               >
//                 <FaChevronRight />
//               </button>
//             </div>
//           </>
//         )}
//       </section>
//     </div>
//   );
// };

// export default AllUsers;

// import { useEffect, useState } from "react";
// import {
//   FaTrash,
//   FaEdit,
//   FaChevronLeft,
//   FaChevronRight,
//   FaSearch,
//   FaFilter,
//   FaCheck,
//   FaTimes
// } from "react-icons/fa";
// import Message from "../../components/Message";
// import Loader from "../../components/Loader";
// import {
//   useDeleteUserMutation,
//   useGetUsersQuery,
//   useUpdateUserMutation,
// } from "../../redux/api/usersApiSlice";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router";
// import { useSelector } from "react-redux";
// import UserExport from "./UserExport";
// import UserImport from "./UserImport";
// import AdminMenu from "./AdminMenu";

// const AllUsers = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [cityFilter, setCityFilter] = useState("");
//   const [countryFilter, setCountryFilter] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);

//   const {
//     data: users,
//     refetch,
//     isLoading,
//     error,
//   } = useGetUsersQuery({
//     page: currentPage,
//     limit,
//   });

//   const { userInfo } = useSelector((state) => state.auth);
//   const [deleteUser] = useDeleteUserMutation();
//   const [updateUser] = useUpdateUserMutation();
//   const navigate = useNavigate();

//   const [editableRow, setEditableRow] = useState(null);
//   const [editedFields, setEditedFields] = useState({});
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     refetch();
//   }, [currentPage, refetch]);

//   useEffect(() => {
//     if (users && users.data) {
//       applyFilters(users.data, searchTerm, cityFilter, countryFilter);
//     }
//   }, [users, searchTerm, cityFilter, countryFilter]);

//   const applyFilters = (data, term, city, country) => {
//     let filtered = [...data];

//     // Apply search term filter
//     if (term) {
//       filtered = filtered.filter(
//         (item) =>
//           (item.username && item.username.toLowerCase().includes(term.toLowerCase())) ||
//           (item.email && item.email.toLowerCase().includes(term.toLowerCase())) ||
//           (item.shopName && item.shopName.toLowerCase().includes(term.toLowerCase()))
//       );
//     }

//     // Apply city filter
//     if (city) {
//       filtered = filtered.filter(
//         (item) =>
//           item.addresses &&
//           item.addresses[0]?.city &&
//           item.addresses[0].city.toLowerCase().includes(city.toLowerCase())
//       );
//     }

//     // Apply country filter
//     if (country) {
//       filtered = filtered.filter(
//         (item) =>
//           item.addresses &&
//           item.addresses[0]?.country &&
//           item.addresses[0].country.toLowerCase().includes(country.toLowerCase())
//       );
//     }

//     setFilteredUsers(filtered);
    
//     // Calculate pagination
//     const total = Math.ceil(filtered.length / limit);
//     setTotalPages(total > 0 ? total : 1);
//   };

//   const deleteHandler = async (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         await deleteUser(id);
//         toast.success("User deleted successfully!");
//         refetch();
//       } catch (err) {
//         toast.error(err?.data?.message || err.error);
//       }
//     }
//   };

//   const toggleEdit = (user) => {
//     const userAddress = user?.addresses?.[0] || {};
//     const initialFields = {
//       userID: user?.userID || "",
//       username: user?.username || "",
//       email: user?.email || "",
//       contactNo: user?.contactNo || "",
//       city: userAddress.city || "",
//       address: userAddress.address || "",
//       postalCode: userAddress.postalCode || "",
//       country: userAddress.country || "",
//       shopName: user?.shopName || "",
//     };
//     setEditedFields(initialFields);
//     setEditableRow(user._id);
//   };

//   const updateHandler = async (id) => {
//     try {
//       await updateUser({
//         userId: id,
//         ...editedFields,
//       });
//       setEditableRow(null);
//       toast.success("User updated successfully!");
//       refetch();
//     } catch (err) {
//       toast.error(err?.data?.message || err.error);
//     }
//   };

//   const cancelEdit = () => {
//     setEditableRow(null);
//     setEditedFields({});
//   };

//   const handleFieldChange = (field, value) => {
//     setEditedFields((prev) => ({ ...prev, [field]: value }));
//   };

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

//   const clearFilters = () => {
//     setSearchTerm("");
//     setCityFilter("");
//     setCountryFilter("");
//     setCurrentPage(1);
//   };

//   const displayedUsers = filteredUsers.length > 0 ? filteredUsers : (users?.data || []);
//   const calculatedTotalPages = totalPages > 0 ? totalPages : (users?.pagination?.totalPages || 1);

//   return (
//     <div className="min-h-screen">
//       <div className="w-full max-w-7xl mx-auto px-4">
//         <AdminMenu />
//         <div className="w-full">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
//             {/* Header Section */}
//             <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-gray-700 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
//               <div>
//                 {/* <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Users</h2> */}
//                 <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//                   Manage and track all system users
//                 </p>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 <UserExport limit={limit} currentPage={currentPage} fileName="User_Data" />
//                 <UserImport />
//               </div>
//             </div>

//             <div className="px-4 sm:px-6 py-4 sm:py-5">
//               {/* Search and Filter Section - Made more responsive */}
//               <div className="mb-6">
//                 <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
//                   <div className="relative w-full md:w-64">
//                     <input
//                       type="text"
//                       placeholder="Search by name, email or shop..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="w-full p-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   </div>

//                   <button
//                     onClick={() => setShowFilters(!showFilters)}
//                     className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors w-full md:w-auto"
//                   >
//                     <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
//                   </button>
//                 </div>

//                 {showFilters && (
//                   <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mt-4 border border-gray-200 dark:border-gray-600">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by City</label>
//                         <input
//                           type="text"
//                           placeholder="Enter city..."
//                           value={cityFilter}
//                           onChange={(e) => setCityFilter(e.target.value)}
//                           className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Country</label>
//                         <input
//                           type="text"
//                           placeholder="Enter country..."
//                           value={countryFilter}
//                           onChange={(e) => setCountryFilter(e.target.value)}
//                           className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>
//                       <div className="flex items-end sm:col-span-2 lg:col-span-1">
//                         <button
//                           onClick={clearFilters}
//                           className="w-full p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium"
//                         >
//                           Clear Filters
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {isLoading ? (
//                 <div className="flex justify-center py-12">
//                   <Loader />
//                 </div>
//               ) : error ? (
//                 <Message variant="danger">
//                   {error?.data?.message || error.error}
//                 </Message>
//               ) : (
//                 <>
//                   {/* Responsive Table */}
//                   <div className="overflow-x-auto -mx-4 sm:-mx-6">
//                     {displayedUsers.length > 0 ? (
//                       <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6">
//                         <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 md:rounded-lg">
//                           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                             <thead className="bg-gray-50 dark:bg-gray-700">
//                               <tr>
//                                 <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
//                                 <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
//                                 <th scope="col" className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Shop Name</th>
//                                 <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
//                                 <th scope="col" className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
//                                 <th scope="col" className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">City</th>
//                                 <th scope="col" className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Country</th>
//                                 <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
//                               </tr>
//                             </thead>
//                             <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                               {displayedUsers.map((user, i) => {
//                                 const userAddress = user.addresses[0] || {};
//                                 return (
//                                   <tr
//                                     key={user._id}
//                                     className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                                   >
//                                     {editableRow === user._id ? (
//                                       <>
//                                         <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
//                                           <input
//                                             type="text"
//                                             value={editedFields.userID || ""}
//                                             onChange={(e) => handleFieldChange("userID", e.target.value)}
//                                             className="w-full p-1 sm:p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                                           />
//                                         </td>
//                                         <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
//                                           <input
//                                             type="text"
//                                             value={editedFields.username || ""}
//                                             onChange={(e) => handleFieldChange("username", e.target.value)}
//                                             className="w-full p-1 sm:p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                                           />
//                                         </td>
//                                         <td className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
//                                           <input
//                                             type="text"
//                                             value={editedFields.shopName || ""}
//                                             onChange={(e) => handleFieldChange("shopName", e.target.value)}
//                                             className="w-full p-1 sm:p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                                           />
//                                         </td>
//                                         <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
//                                           <input
//                                             type="email"
//                                             value={editedFields.email || ""}
//                                             onChange={(e) => handleFieldChange("email", e.target.value)}
//                                             className="w-full p-1 sm:p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                                           />
//                                         </td>
//                                         <td className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
//                                           <input
//                                             type="text"
//                                             value={editedFields.contactNo || ""}
//                                             onChange={(e) => handleFieldChange("contactNo", e.target.value)}
//                                             className="w-full p-1 sm:p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                                           />
//                                         </td>
//                                         <td className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
//                                           <input
//                                             type="text"
//                                             value={editedFields.city || ""}
//                                             onChange={(e) => handleFieldChange("city", e.target.value)}
//                                             className="w-full p-1 sm:p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                                           />
//                                         </td>
//                                         <td className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
//                                           <input
//                                             type="text"
//                                             value={editedFields.country || ""}
//                                             onChange={(e) => handleFieldChange("country", e.target.value)}
//                                             className="w-full p-1 sm:p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                                           />
//                                         </td>
//                                         <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
//                                           <div className="flex space-x-1 sm:space-x-2">
//                                             <button
//                                               onClick={() => updateHandler(user._id)}
//                                               className="p-1 sm:p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                                               title="Save"
//                                             >
//                                               <FaCheck size={14} />
//                                             </button>
//                                             <button
//                                               onClick={cancelEdit}
//                                               className="p-1 sm:p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//                                               title="Cancel"
//                                             >
//                                               <FaTimes size={14} />
//                                             </button>
//                                           </div>
//                                         </td>
//                                       </>
//                                     ) : (
//                                       <>
//                                         <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400">
//                                           {(currentPage - 1) * limit + i + 1}
//                                         </td>
//                                         <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
//                                           {user.username || "N/A"}
//                                         </td>
//                                         <td className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-300">
//                                           {user.shopName || "N/A"}
//                                         </td>
//                                         <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-blue-600 dark:text-blue-400 truncate max-w-[120px] sm:max-w-none">
//                                           <a href={`mailto:${user.email}`} className="hover:underline">
//                                             {user.email || "N/A"}
//                                           </a>
//                                         </td>
//                                         <td className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-300">
//                                           {user.contactNo || "N/A"}
//                                         </td>
//                                         <td className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-300">
//                                           {userAddress.city || "N/A"}
//                                         </td>
//                                         <td className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-300">
//                                           {userAddress.country || "N/A"}
//                                         </td>
//                                         <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
//                                           <div className="flex space-x-1 sm:space-x-2">
//                                             <button
//                                               onClick={() => toggleEdit(user)}
//                                               className="p-1 sm:p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-md hover:bg-amber-200 dark:hover:bg-amber-900/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
//                                               title="Edit User"
//                                             >
//                                               <FaEdit size={12} className="sm:hidden" />
//                                               <FaEdit size={14} className="hidden sm:block" />
//                                             </button>
//                                             {!user.isAdmin && (
//                                               <button
//                                                 onClick={() => deleteHandler(user._id)}
//                                                 className="p-1 sm:p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//                                                 title="Delete User"
//                                               >
//                                                 <FaTrash size={12} className="sm:hidden" />
//                                                 <FaTrash size={14} className="hidden sm:block" />
//                                               </button>
//                                             )}
//                                           </div>
//                                         </td>
//                                       </>
//                                     )}
//                                   </tr>
//                                 );
//                               })}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-center py-12 sm:py-16">
//                         <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
//                         </svg>
//                         <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No users found</h3>
//                         <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No users found with the current filters.</p>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* Responsive Pagination */}
//             {!isLoading && !error && displayedUsers.length > 0 && (
//               <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
//                 <div className="flex flex-col sm:flex-row justify-between items-center">
//                   <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
//                     Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, displayedUsers.length)} of {displayedUsers.length} users
//                   </div>
                  
//                   <div className="flex justify-center items-center space-x-1 sm:space-x-2">
//                     <button
//                       onClick={handlePrevPage}
//                       disabled={currentPage === 1}
//                       className="p-1 sm:p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                       aria-label="Previous Page"
//                     >
//                       <FaChevronLeft size={12} className="sm:hidden" />
//                       <FaChevronLeft size={14} className="hidden sm:block" />
//                     </button>
                    
//                     <div className="hidden sm:flex items-center space-x-1">
//                       {Array.from(
//                         { length: calculatedTotalPages > 5 ? 5 : calculatedTotalPages },
//                         (_, index) => {
//                           let pageNum;
//                           if (calculatedTotalPages <= 5) {
//                             pageNum = index + 1;
//                           } else {
//                             if (currentPage <= 3) {
//                               pageNum = index + 1;
//                             } else if (currentPage >= calculatedTotalPages - 2) {
//                               pageNum = calculatedTotalPages - 4 + index;
//                             } else {
//                               pageNum = currentPage - 2 + index;
//                             }
//                           }

//                           return (
//                             <button
//                               key={pageNum}
//                               onClick={() => setCurrentPage(pageNum)}
//                               className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
//                                 currentPage === pageNum
//                                   ? "bg-blue-600 text-white"
//                                   : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
//                               }`}
//                               aria-label={`Go to page ${pageNum}`}
//                             >
//                               {pageNum}
//                             </button>
//                           );
//                         }
//                       )}
                      
//                       {calculatedTotalPages > 5 && currentPage < calculatedTotalPages - 2 && (
//                         <>
//                           <span className="text-gray-700 dark:text-gray-300">...</span>
//                           <button
//                             onClick={() => setCurrentPage(calculatedTotalPages)}
//                             className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
//                             aria-label={`Go to page ${calculatedTotalPages}`}
//                           >
//                             {calculatedTotalPages}
//                           </button>
//                         </>
//                       )}
//                     </div>
                    
//                     {/* Mobile Pagination Display */}
//                     <div className="flex sm:hidden items-center">
//                       <span className="text-sm text-gray-700 dark:text-gray-300">
//                         {currentPage} / {calculatedTotalPages}
//                       </span>
//                     </div>
                    
//                     <button
//                       onClick={handleNextPage}
//                       disabled={currentPage === calculatedTotalPages}
//                       className="p-1 sm:p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                       aria-label="Next Page"
//                     >
//                       <FaChevronRight size={12} className="sm:hidden" />
//                       <FaChevronRight size={14} className="hidden sm:block" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllUsers;



import { useEffect, useState } from "react";
import {
  FaTrash,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaFilter,
  FaCheck,
  FaTimes
} from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import UserExport from "./UserExport";
import UserImport from "./UserImport";
import AdminMenu from "./AdminMenu";
import UserDetailsModal from "./UserDetails";

const AllUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [cityFilter, setCityFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  // State for the user details modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);

  const {
    data: users,
    refetch,
    isLoading,
    error,
  } = useGetUsersQuery({
    page: currentPage,
    limit,
  });

  const { userInfo } = useSelector((state) => state.auth);
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const navigate = useNavigate();

  const [editableRow, setEditableRow] = useState(null);
  const [editedFields, setEditedFields] = useState({});
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  useEffect(() => {
    if (users && users.data) {
      applyFilters(users.data, searchTerm, cityFilter, countryFilter);
    }
  }, [users, searchTerm, cityFilter, countryFilter]);

  const applyFilters = (data, term, city, country) => {
    let filtered = [...data];

    // Apply search term filter
    if (term) {
      filtered = filtered.filter(
        (item) =>
          (item.username && item.username.toLowerCase().includes(term.toLowerCase())) ||
          (item.email && item.email.toLowerCase().includes(term.toLowerCase())) ||
          (item.shopName && item.shopName.toLowerCase().includes(term.toLowerCase()))
      );
    }

    // Apply city filter
    if (city) {
      filtered = filtered.filter(
        (item) =>
          item.addresses &&
          item.addresses[0]?.city &&
          item.addresses[0].city.toLowerCase().includes(city.toLowerCase())
      );
    }

    // Apply country filter
    if (country) {
      filtered = filtered.filter(
        (item) =>
          item.addresses &&
          item.addresses[0]?.country &&
          item.addresses[0].country.toLowerCase().includes(country.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
    
    // Calculate pagination
    const total = Math.ceil(filtered.length / limit);
    setTotalPages(total > 0 ? total : 1);
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        toast.success("User deleted successfully!");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (user, e) => {
    // Stop event propagation to prevent opening the modal when clicking edit
    e.stopPropagation();
    
    const userAddress = user?.addresses?.[0] || {};
    const initialFields = {
      userID: user?.userID || "",
      username: user?.username || "",
      email: user?.email || "",
      contactNo: user?.contactNo || "",
      city: userAddress.city || "",
      address: userAddress.address || "",
      postalCode: userAddress.postalCode || "",
      country: userAddress.country || "",
      shopName: user?.shopName || "",
    };
    setEditedFields(initialFields);
    setEditableRow(user._id);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        ...editedFields,
      });
      setEditableRow(null);
      toast.success("User updated successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const cancelEdit = () => {
    setEditableRow(null);
    setEditedFields({});
  };

  const handleFieldChange = (field, value) => {
    setEditedFields((prev) => ({ ...prev, [field]: value }));
  };

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

  const clearFilters = () => {
    setSearchTerm("");
    setCityFilter("");
    setCountryFilter("");
    setCurrentPage(1);
  };

  // Handle row click to show user details modal
  const handleRowClick = (user) => {
    if (editableRow === user._id) return; // Don't open modal if row is being edited
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  // Handle close of user details modal
  const handleCloseUserDetailsModal = () => {
    setShowUserDetailsModal(false);
    setSelectedUser(null);
  };

  const displayedUsers = filteredUsers.length > 0 ? filteredUsers : (users?.data || []);
  const calculatedTotalPages = totalPages > 0 ? totalPages : (users?.pagination?.totalPages || 1);

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4">
        {/* <AdminMenu /> */}
        <div className="w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {/* Header Section */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-gray-700 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
              <div>
                {/* <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Users</h2> */}
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage and track all system users
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <UserExport limit={limit} currentPage={currentPage} fileName="User_Data" />
                <UserImport />
              </div>
            </div>

            <div className="px-4 sm:px-6 py-4 sm:py-5">
              {/* Search and Filter Section - Made more responsive */}
              <div className="mb-6">
                <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
                  <div className="relative w-full md:w-64">
                    <input
                      type="text"
                      placeholder="Search by name, email or shop..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors w-full md:w-auto"
                  >
                    <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
                  </button>
                </div>

                {showFilters && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mt-4 border border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by City</label>
                        <input
                          type="text"
                          placeholder="Enter city..."
                          value={cityFilter}
                          onChange={(e) => setCityFilter(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Country</label>
                        <input
                          type="text"
                          placeholder="Enter country..."
                          value={countryFilter}
                          onChange={(e) => setCountryFilter(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-end sm:col-span-2 lg:col-span-1">
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
                  {/* Responsive Table */}
                  <div className="overflow-x-auto -mx-4 sm:-mx-6">
                    {displayedUsers.length > 0 ? (
                      <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6">
                        <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 md:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                              <tr>
                                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Shop Name</th>
                                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                <th scope="col" className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                                <th scope="col" className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">City</th>
                                <th scope="col" className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Country</th>
                                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                              {displayedUsers.map((user, i) => {
                                const userAddress = user.addresses[0] || {};
                                return (
                                  <tr
                                    key={user._id}
                                    className={`${editableRow !== user._id ? "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" : ""}`}
                                    onClick={editableRow !== user._id ? () => handleRowClick(user) : undefined}
                                  >
                                    {editableRow === user._id ? (
                                      <>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                          <input
                                            type="text"
                                            value={editedFields.userID || ""}
                                            onChange={(e) => handleFieldChange("userID", e.target.value)}
                                            className="w-full p-1 sm:p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                          />
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                          <input
                                            type="text"
                                            value={editedFields.username || ""}
                                            onChange={(e) => handleFieldChange("username", e.target.value)}
                                            className="w-full p-1 sm:p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                          />
                                        </td>
                                        <td className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                          <input
                                            type="text"
                                            value={editedFields.shopName || ""}
                                            onChange={(e) => handleFieldChange("shopName", e.target.value)}
                                            className="w-full p-1 sm:p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                          />
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                          <input
                                            type="email"
                                            value={editedFields.email || ""}
                                            onChange={(e) => handleFieldChange("email", e.target.value)}
                                            className="w-full p-1 sm:p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                          />
                                        </td>
                                        <td className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                          <input
                                            type="text"
                                            value={editedFields.contactNo || ""}
                                            onChange={(e) => handleFieldChange("contactNo", e.target.value)}
                                            className="w-full p-1 sm:p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                          />
                                        </td>
                                        <td className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                          <input
                                            type="text"
                                            value={editedFields.city || ""}
                                            onChange={(e) => handleFieldChange("city", e.target.value)}
                                            className="w-full p-1 sm:p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                          />
                                        </td>
                                        <td className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                          <input
                                            type="text"
                                            value={editedFields.country || ""}
                                            onChange={(e) => handleFieldChange("country", e.target.value)}
                                            className="w-full p-1 sm:p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                          />
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                          <div className="flex space-x-1 sm:space-x-2">
                                            <button
                                              onClick={() => updateHandler(user._id)}
                                              className="p-1 sm:p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                              title="Save"
                                            >
                                              <FaCheck size={14} />
                                            </button>
                                            <button
                                              onClick={cancelEdit}
                                              className="p-1 sm:p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                              title="Cancel"
                                            >
                                              <FaTimes size={14} />
                                            </button>
                                          </div>
                                        </td>
                                      </>
                                    ) : (
                                      <>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                          {(currentPage - 1) * limit + i + 1}
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                          {user.username || "N/A"}
                                        </td>
                                        <td className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                          {user.shopName || "N/A"}
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-blue-600 dark:text-blue-400 truncate max-w-[120px] sm:max-w-none">
                                          <a 
                                            href={`mailto:${user.email}`} 
                                            className="hover:underline"
                                            onClick={(e) => e.stopPropagation()} // Prevent row click when clicking email
                                          >
                                            {user.email || "N/A"}
                                          </a>
                                        </td>
                                        <td className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                          {user.contactNo || "N/A"}
                                        </td>
                                        <td className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                          {userAddress.city || "N/A"}
                                        </td>
                                        <td className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                          {userAddress.country || "N/A"}
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                          <div className="flex space-x-1 sm:space-x-2">
                                            <button
                                              onClick={(e) => toggleEdit(user, e)}
                                              className="p-1 sm:p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-md hover:bg-amber-200 dark:hover:bg-amber-900/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                              title="Edit User"
                                            >
                                              <FaEdit size={12} className="sm:hidden" />
                                              <FaEdit size={14} className="hidden sm:block" />
                                            </button>
                                            {!user.isAdmin && (
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation(); // Prevent row click when clicking delete
                                                  deleteHandler(user._id);
                                                }}
                                                className="p-1 sm:p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                title="Delete User"
                                              >
                                                <FaTrash size={12} className="sm:hidden" />
                                                <FaTrash size={14} className="hidden sm:block" />
                                              </button>
                                            )}
                                          </div>
                                        </td>
                                      </>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 sm:py-16">
                        <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No users found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No users found with the current filters.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Responsive Pagination */}
            {!isLoading && !error && displayedUsers.length > 0 && (
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                    Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, displayedUsers.length)} of {displayedUsers.length} users
                  </div>
                  
                  <div className="flex justify-center items-center space-x-1 sm:space-x-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="p-1 sm:p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Previous Page"
                    >
                      <FaChevronLeft size={12} className="sm:hidden" />
                      <FaChevronLeft size={14} className="hidden sm:block" />
                    </button>
                    
                    <div className="hidden sm:flex items-center space-x-1">
                      {Array.from(
                        { length: calculatedTotalPages > 5 ? 5 : calculatedTotalPages },
                        (_, index) => {
                          let pageNum;
                          if (calculatedTotalPages <= 5) {
                            pageNum = index + 1;
                          } else {
                            if (currentPage <= 3) {
                              pageNum = index + 1;
                            } else if (currentPage >= calculatedTotalPages - 2) {
                              pageNum = calculatedTotalPages - 4 + index;
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
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                              }`}
                              aria-label={`Go to page ${pageNum}`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                      
                      {calculatedTotalPages > 5 && currentPage < calculatedTotalPages - 2 && (
                        <>
                          <span className="text-gray-700 dark:text-gray-300">...</span>
                          <button
                            onClick={() => setCurrentPage(calculatedTotalPages)}
                            className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            aria-label={`Go to page ${calculatedTotalPages}`}
                          >
                            {calculatedTotalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    {/* Mobile Pagination Display */}
                    <div className="flex sm:hidden items-center">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {currentPage} / {calculatedTotalPages}
                      </span>
                    </div>
                    
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === calculatedTotalPages}
                      className="p-1 sm:p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Next Page"
                    >
                      <FaChevronRight size={12} className="sm:hidden" />
                      <FaChevronRight size={14} className="hidden sm:block" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* User Details Modal */}
            {showUserDetailsModal && selectedUser && (
              <UserDetailsModal 
                user={selectedUser} 
                onClose={handleCloseUserDetailsModal} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;