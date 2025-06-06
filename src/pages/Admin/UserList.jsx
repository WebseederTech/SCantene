// import { useEffect, useState } from "react";
// import {
//   FaTrash,
//   FaEdit,
//   FaCheck,
//   FaChevronLeft,
//   FaChevronRight,
//   FaSearch,
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
// import { Link } from "react-router-dom";

// const UserList = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit] = useState(100);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchField, setSearchField] = useState("username");

//   const {
//     data: users,
//     refetch,
//     isLoading,
//     error,
//   } = useGetOnlyBuyersQuery({
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

//   const filteredUsers = users?.data?.filter((user) => {
//     if (searchField === "shopName") {
//       return user.shopName?.toLowerCase().includes(searchTerm.toLowerCase());
//     } else if (searchField === "city") {
//       return user.addresses[0]?.city
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase());
//     }
//     return user.username?.toLowerCase().includes(searchTerm.toLowerCase());
//   });

//   return (
//     <div className="flex flex-col items-center darktheme px-6 pb-6">
//       <section className="w-full  darktheme rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-600 ">
//         <AdminMenu />
//         <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
//           Users
//         </h1>
//         <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start w-full">
//           <button
//             onClick={() => navigate("/admin/add-user")}
//             className="mb-4 sm:mb-0 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-opacity-50 w-full sm:w-auto"
//           >
//             Add User
//           </button>
//           <div className="flex items-center bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
//           <select
//               value={searchField}
//               onChange={(e) => setSearchField(e.target.value)}
//               className="border rounded p-2 text-black rounded-lg"
//             >
//               <option value="username">Username</option>
//               <option value="shopName">Shop Name</option>
//               <option value="city">City</option>
//             </select>
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="flex-grow px-4 py-2 text-gray-900 dark:text-white bg-transparent focus:outline-none"
//               />
//             <FaSearch className="text-gray-500" />
//           </div>
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
//                   {filteredUsers?.map((user, i) => {
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
//                             <td className="px-6 py-4">{i + 1 || "N/A"}</td>
//                             <td className="px-6 py-4 text-blue-300 underline underline-offset-4">
//                               <Link to={"/admin/user-activity/" + user._id}>
//                                 {user.username || "N/A"}
//                               </Link>
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
//                       className={`px-4 py-2 aspect-square rounded-full font-semibold text-sm transition duration-300 ease-in-out ${
//                         currentPage === index + 1
//                           ? "text-customBlue shadow hover:scale-105"
//                           : "pagination text-white hover:bg-customBlue/80"
//                       }`}
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

// export default UserList;


import { useEffect, useState } from "react";
import {
  FaTrash,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaFilter,
  FaCheck,
} from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetOnlyBuyersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import UserExport from "./UserExport";
import UserImport from "./UserImport";
import AdminMenu from "./AdminMenu";
import { Link } from "react-router-dom";

const UserList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("username");
  const [showFilters, setShowFilters] = useState(false);
  const [cityFilter, setCityFilter] = useState("");
  const [shopNameFilter, setShopNameFilter] = useState("");

  const {
    data: users,
    refetch,
    isLoading,
    error,
  } = useGetOnlyBuyersQuery({
    page: currentPage,
    limit,
  });

  const { userInfo } = useSelector((state) => state.auth);
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const navigate = useNavigate();

  const [editableRow, setEditableRow] = useState(null);
  const [editedFields, setEditedFields] = useState({});

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteUser(id);
        toast.success("User deleted successfully!");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (user) => {
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
    if (currentPage < users.pagination.totalPages) {
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
    setSearchField("username");
    setCityFilter("");
    setShopNameFilter("");
  };

  const filteredUsers = users?.data?.filter((user) => {
    // Apply main search filter
    let mainSearchMatch = true;
    if (searchTerm) {
      if (searchField === "username") {
        mainSearchMatch = user.username?.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchField === "shopName") {
        mainSearchMatch = user.shopName?.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchField === "city") {
        mainSearchMatch = user.addresses[0]?.city?.toLowerCase().includes(searchTerm.toLowerCase());
      }
    }

    // Apply additional filters
    let cityMatch = true;
    if (cityFilter) {
      cityMatch = user.addresses[0]?.city?.toLowerCase().includes(cityFilter.toLowerCase());
    }

    let shopNameMatch = true;
    if (shopNameFilter) {
      shopNameMatch = user.shopName?.toLowerCase().includes(shopNameFilter.toLowerCase());
    }

    return mainSearchMatch && cityMatch && shopNameMatch;
  });

  const totalPages = users?.pagination?.totalPages || 1;

  return (
    <div className="min-h-screen">
      <div className="max-w-[1240px] mx-auto px-4">
        {/* <AdminMenu /> */}
        <div className="w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              {/* <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Users</h2> */}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage and view user information
              </p>
            </div>
            
            <div className="px-6 py-5">
              {/* Search and Filter Section */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={searchField}
                      onChange={(e) => setSearchField(e.target.value)}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="username">Username</option>
                      <option value="shopName">Shop Name</option>
                      <option value="city">City</option>
                    </select>
                    
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
                    </button>
                    
                    <button
                      onClick={() => navigate("/admin/add-user")}
                      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                    >
                      Add User
                    </button>
                  </div>
                </div>

                {showFilters && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mt-4 border border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Shop Name</label>
                        <input
                          type="text"
                          placeholder="Enter shop name..."
                          value={shopNameFilter}
                          onChange={(e) => setShopNameFilter(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="grid grid-cols-2 gap-2 w-full">
                          <button
                            onClick={clearFilters}
                            className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium"
                          >
                            Clear Filters
                          </button>
                          <div className="flex gap-2">
                            <UserExport
                              limit={limit}
                              currentPage={currentPage}
                              fileName="User_Data"
                            />
                            <UserImport />
                          </div>
                        </div>
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
                  <div className="overflow-x-auto">
                    {filteredUsers?.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Shop Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact No</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">City</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Address</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Postal Code</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Country</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredUsers?.map((user, i) => {
                            const userAddress = user.addresses[0] || {};
                            return (
                              <tr
                                key={user._id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                {editableRow === user._id ? (
                                  <>
                                    <td className="px-6 py-4">
                                      <input
                                        type="text"
                                        value={editedFields.userID || ""}
                                        onChange={(e) =>
                                          handleFieldChange("userID", e.target.value)
                                        }
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </td>
                                    <td className="px-6 py-4">
                                      <input
                                        type="text"
                                        value={editedFields.username || ""}
                                        onChange={(e) =>
                                          handleFieldChange("username", e.target.value)
                                        }
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </td>
                                    <td className="px-6 py-4">
                                      <input
                                        type="text"
                                        value={editedFields.shopName || ""}
                                        onChange={(e) =>
                                          handleFieldChange("shopName", e.target.value)
                                        }
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </td>
                                    <td className="px-6 py-4">
                                      <input
                                        type="email"
                                        value={editedFields.email || ""}
                                        onChange={(e) =>
                                          handleFieldChange("email", e.target.value)
                                        }
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </td>
                                    <td className="px-6 py-4">
                                      <input
                                        type="text"
                                        value={editedFields.contactNo || ""}
                                        onChange={(e) =>
                                          handleFieldChange("contactNo", e.target.value)
                                        }
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </td>
                                    <td className="px-6 py-4">
                                      <input
                                        type="text"
                                        value={editedFields.city || ""}
                                        onChange={(e) =>
                                          handleFieldChange("city", e.target.value)
                                        }
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </td>
                                    <td className="px-6 py-4">
                                      <input
                                        type="text"
                                        value={editedFields.address || ""}
                                        onChange={(e) =>
                                          handleFieldChange("address", e.target.value)
                                        }
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </td>
                                    <td className="px-6 py-4">
                                      <input
                                        type="text"
                                        value={editedFields.postalCode || ""}
                                        onChange={(e) =>
                                          handleFieldChange(
                                            "postalCode",
                                            e.target.value
                                          )
                                        }
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </td>
                                    <td className="px-6 py-4">
                                      <input
                                        type="text"
                                        value={editedFields.country || ""}
                                        onChange={(e) =>
                                          handleFieldChange("country", e.target.value)
                                        }
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex justify-center gap-2">
                                        <button
                                          onClick={() => updateHandler(user._id)}
                                          className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                                          title="Save"
                                        >
                                          <FaCheck size={14} />
                                        </button>
                                        <button
                                          onClick={cancelEdit}
                                          className="bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500"
                                          title="Cancel"
                                        >
                                          <FaTrash size={14} />
                                        </button>
                                      </div>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                      {(currentPage - 1) * limit + i + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      <Link 
                                        to={"/admin/user-activity/" + user._id}
                                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                      >
                                        {user.username || "N/A"}
                                      </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                      {user.shopName || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                      <a 
                                        href={`mailto:${user.email}`} 
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                      >
                                        {user.email}
                                      </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                      {user.contactNo || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                      {userAddress.city || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                      {userAddress.address || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                      {userAddress.postalCode || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                      {userAddress.country || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                      <div className="flex justify-center gap-2">
                                        <button
                                          onClick={() => toggleEdit(user)}
                                          className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors"
                                          title="Edit"
                                        >
                                          <FaEdit size={16} />
                                        </button>
                                        {!user.isAdmin && (
                                          <button
                                            onClick={() => deleteHandler(user._id)}
                                            className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 p-2 rounded-full transition-colors"
                                            title="Delete"
                                          >
                                            <FaTrash size={16} />
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
                    ) : (
                      <div className="text-center py-16">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No users found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No users found with the current filters.</p>
                        <div className="mt-6">
                          <button
                            onClick={() => navigate("/admin/add-user")}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Add a new user
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {!isLoading && !error && filteredUsers?.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;