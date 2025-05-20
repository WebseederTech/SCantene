// import React, { useState, useEffect } from "react";
// import { FaChevronLeft, FaChevronRight, FaSearch, FaFilter } from "react-icons/fa";
// import Message from "../../components/Message";
// import Loader from "../../components/Loader";
// import axios from "axios";
// import AdminMenu from "./AdminMenu";
// import { BASE_URL } from "../../redux/constants";

// const SearchHistory = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit] = useState(10);
//   const [searchHistory, setSearchHistory] = useState([]);
//   const [filteredHistory, setFilteredHistory] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [totalPages, setTotalPages] = useState(1);

//   // Filter states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [dateFilter, setDateFilter] = useState("");
//   const [userNameFilter, setuserNameFilter] = useState("");
//   const [showFilters, setShowFilters] = useState(false);

//   const fetchSearchHistory = async () => {
//     setIsLoading(true);
//     try {
//       const { data } = await axios.get(`${BASE_URL}/api/search/search-history`);
//       setSearchHistory(data);
//       applyFilters(data, searchTerm, dateFilter, userNameFilter);
//       setIsLoading(false);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSearchHistory();
//   }, []);

//   useEffect(() => {
//     applyFilters(searchHistory, searchTerm, dateFilter, userNameFilter);
//   }, [searchTerm, dateFilter, userNameFilter, currentPage]);

//   const applyFilters = (data, term, date, username) => {
//     let filtered = [...data];

//     // Apply search term filter
//     if (term) {
//       filtered = filtered.filter(
//         (item) =>
//           item.query.toLowerCase().includes(term.toLowerCase()) ||
//           (item.user?.username && item.user.username.toLowerCase().includes(term.toLowerCase())) ||
//           (item.user?.username && item.user.username.toLowerCase().includes(term.toLowerCase()))
//       );
//     }

//     // Apply date filter
//     if (date) {
//       const filterDate = new Date(date);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.createdAt);
//         return (
//           itemDate.getDate() === filterDate.getDate() &&
//           itemDate.getMonth() === filterDate.getMonth() &&
//           itemDate.getFullYear() === filterDate.getFullYear()
//         );
//       });
//     }

//     // Apply email filter
//     if (username) {
//       filtered = filtered.filter(
//         (item) =>
//           item.user?.username && item.user.username.toLowerCase().includes(username.toLowerCase())
//       );
//     }

//     // Calculate pagination
//     const total = Math.ceil(filtered.length / limit);
//     setTotalPages(total > 0 ? total : 1);

//     // Slice for current page
//     const startIndex = (currentPage - 1) * limit;
//     const endIndex = startIndex + limit;

//     setFilteredHistory(filtered.slice(startIndex, endIndex));
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
//     setDateFilter("");
//     setuserNameFilter("");
//     setCurrentPage(1);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     }).format(date);
//   };

//   return (
//     <div className="flex flex-col items-center darktheme px-6 pb-6">
//       <section className="w-full  darktheme bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-600 ">
//         <AdminMenu />
//         <h1 className="text-2xl font-semibold mb-6 text-center text-customBlue">
//           Search History
//         </h1>

//         {/* Search and Filter Section */}
//         <div className="mb-6">
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
//             <div className="relative w-full sm:w-64">
//               <input
//                 type="text"
//                 placeholder="Search by query or email..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full p-2 pl-10 pr-4 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-customBlue"
//               />
//               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             </div>

//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center gap-2 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
//             >
//               <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
//             </button>
//           </div>

//           {showFilters && (
//             <div className="bg-gray-800 p-4 rounded-lg mb-4 animate-fadeIn">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-1">Filter by User name</label>
//                   <input
//                     type="text"
//                     placeholder="Enter User name..."
//                     value={userNameFilter}
//                     onChange={(e) => setuserNameFilter(e.target.value)}
//                     className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-customBlue"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-1">Filter by Date</label>
//                   <input
//                     type="date"
//                     value={dateFilter}
//                     onChange={(e) => setDateFilter(e.target.value)}
//                     className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-customBlue"
//                   />
//                 </div>
//                 <div className="flex items-end">
//                   <button
//                     onClick={clearFilters}
//                     className="w-full p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                   >
//                     Clear Filters
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {isLoading ? (
//           <Loader />
//         ) : error ? (
//           <Message variant="danger">{error}</Message>
//         ) : (
//           <>
//             <div className="overflow-x-auto mt-4 rounded-lg text-sm">
//               <table className="table-auto w-full text-white">
//                 <thead>
//                   <tr className="tableheading">
//                     <th className="px-6 py-4 text-left font-medium">#</th>
//                     <th className="px-6 py-4 text-left font-medium">Customer</th>
//                     <th className="px-6 py-4 text-left font-medium">Email</th>
//                     <th className="px-6 py-4 text-left font-medium">Search Query</th>
//                     <th className="px-6 py-4 text-left font-medium">Results</th>
//                     <th className="px-6 py-4 text-left font-medium">Date & Time</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredHistory.length > 0 ? (
//                     filteredHistory.map((item, i) => (
//                       <tr
//                         key={item._id}
//                         className="tablecontent transition-colors"
//                       >
//                         <td className="px-6 py-4">
//                           {(currentPage - 1) * limit + i + 1}
//                         </td>
//                         <td className="px-6 py-4">{item.user?.username || "Anonymous"}</td>
//                         <td className="px-6 py-4">
//                           {item.user?.email ? (
//                             <a href={`mailto:${item.user.email}`}>{item.user.email}</a>
//                           ) : (
//                             "N/A"
//                           )}
//                         </td>
//                         <td className="px-6 py-4 font-medium text-customBlue">{item.query}</td>
//                         <td className="px-6 py-4">{item.searchCount}</td>
//                         <td className="px-6 py-4">{formatDate(item.createdAt)}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr className="tablecontent">
//                       <td colSpan="6" className="px-6 py-4 text-center">
//                         No search history found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {filteredHistory.length > 0 && (
//               <div className="flex justify-center items-center mt-6 space-x-3">
//                 <button
//                   onClick={handlePrevPage}
//                   disabled={currentPage === 1}
//                   className="px-4 py-2 aspect-square pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
//                   aria-label="Previous Page"
//                 >
//                   <FaChevronLeft />
//                 </button>
//                 <div className="flex items-center space-x-2">
//                   {Array.from(
//                     { length: totalPages > 5 ? 5 : totalPages },
//                     (_, index) => {
//                       let pageNum;
//                       if (totalPages <= 5) {
//                         pageNum = index + 1;
//                       } else {
//                         if (currentPage <= 3) {
//                           pageNum = index + 1;
//                         } else if (currentPage >= totalPages - 2) {
//                           pageNum = totalPages - 4 + index;
//                         } else {
//                           pageNum = currentPage - 2 + index;
//                         }
//                       }

//                       return (
//                         <button
//                           key={pageNum}
//                           onClick={() => setCurrentPage(pageNum)}
//                           className={`px-4 py-2 aspect-square rounded-full font-semibold text-sm transition duration-300 ease-in-out ${currentPage === pageNum
//                             ? "shadow text-customBlue hover:scale-105"
//                             : "pagination text-white hover:bg-customBlue/80"
//                             }`}
//                           aria-label={`Go to page ${pageNum}`}
//                         >
//                           {pageNum}
//                         </button>
//                       );
//                     }
//                   )}
//                   {totalPages > 5 && currentPage < totalPages - 2 && (
//                     <>
//                       <span className="text-white">...</span>
//                       <button
//                         onClick={() => setCurrentPage(totalPages)}
//                         className="px-4 py-2 aspect-square rounded-full font-semibold text-sm transition duration-300 ease-in-out pagination text-white hover:bg-customBlue/80"
//                         aria-label={`Go to page ${totalPages}`}
//                       >
//                         {totalPages}
//                       </button>
//                     </>
//                   )}
//                 </div>
//                 <button
//                   onClick={handleNextPage}
//                   disabled={currentPage === totalPages}
//                   className="px-4 py-2 aspect-square pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
//                   aria-label="Next Page"
//                 >
//                   <FaChevronRight />
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </section>
//     </div>
//   );
// };

// export default SearchHistory;


import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaSearch, FaFilter } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import axios from "axios";
import AdminMenu from "./AdminMenu";
import { BASE_URL } from "../../redux/constants";

const SearchHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [searchHistory, setSearchHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [userNameFilter, setuserNameFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchSearchHistory = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/api/search/search-history`);
      setSearchHistory(data);
      applyFilters(data, searchTerm, dateFilter, userNameFilter);
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  useEffect(() => {
    applyFilters(searchHistory, searchTerm, dateFilter, userNameFilter);
  }, [searchTerm, dateFilter, userNameFilter, currentPage]);

  const applyFilters = (data, term, date, username) => {
    let filtered = [...data];

    // Apply search term filter
    if (term) {
      filtered = filtered.filter(
        (item) =>
          item.query.toLowerCase().includes(term.toLowerCase()) ||
          (item.user?.username && item.user.username.toLowerCase().includes(term.toLowerCase())) ||
          (item.user?.username && item.user.username.toLowerCase().includes(term.toLowerCase()))
      );
    }

    // Apply date filter
    if (date) {
      const filterDate = new Date(date);
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return (
          itemDate.getDate() === filterDate.getDate() &&
          itemDate.getMonth() === filterDate.getMonth() &&
          itemDate.getFullYear() === filterDate.getFullYear()
        );
      });
    }

    // Apply email filter
    if (username) {
      filtered = filtered.filter(
        (item) =>
          item.user?.username && item.user.username.toLowerCase().includes(username.toLowerCase())
      );
    }

    // Calculate pagination
    const total = Math.ceil(filtered.length / limit);
    setTotalPages(total > 0 ? total : 1);

    // Slice for current page
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    setFilteredHistory(filtered.slice(startIndex, endIndex));
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
    setDateFilter("");
    setuserNameFilter("");
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto p-4">
        {/* <AdminMenu /> */}
        <div className="w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {/* <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Search History</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View and analyze customer search patterns
              </p>
            </div> */}
            
            <div className="px-6 py-5">
              {/* Search and Filter Section */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search by query or username..."
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Username</label>
                        <input
                          type="text"
                          placeholder="Enter username..."
                          value={userNameFilter}
                          onChange={(e) => setuserNameFilter(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Date</label>
                        <input
                          type="date"
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
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

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader />
                </div>
              ) : error ? (
                <Message variant="danger">{error}</Message>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    {filteredHistory.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Search Query</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Results</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date & Time</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredHistory.map((item, i) => (
                            <tr
                              key={item._id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {(currentPage - 1) * limit + i + 1}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {item.user?.username || "Anonymous"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {item.user?.email ? (
                                  <a href={`mailto:${item.user.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                    {item.user.email}
                                  </a>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                                {item.query}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {item.searchCount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {formatDate(item.createdAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-16">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No search history</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No search history found with the current filters.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {!isLoading && !error && filteredHistory.length > 0 && (
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

export default SearchHistory;