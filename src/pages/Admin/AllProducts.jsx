// import { Link } from "react-router-dom";
// import moment from "moment";
// import { useAllProductsQuery } from "../../redux/api/productApiSlice";
// import AdminMenu from "./AdminMenu";
// import { useSelector } from "react-redux";
// import { useState, useEffect } from "react";
// import { BASE_URL } from "../../redux/constants";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const AllProducts = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit] = useState(50);
//   const {
//     data: products,
//     refetch,
//     isLoading,
//     isError,
//   } = useAllProductsQuery({ page: currentPage, limit });
//   const { userInfo } = useSelector((state) => state.auth);
//   const userId = userInfo._id;
//   console.log(userInfo.role, "rrrrrrrrrrrrrrrrrrrrrrrrr");

//   // State for filters
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [SellerSearch, setSellerSearch] = useState(""); // State for Seller search

//   const [SellerCity, setSellerCity] = useState(""); // State for Seller city filter

//   useEffect(() => {
//     refetch();
//   }, [currentPage, refetch]);

//   const handleDateFilter = () => {
//     // Start with products.data instead of products
//     let filtered = products?.data;

//     // Filter by date range
//     if (startDate && endDate) {
//       filtered = filtered.filter((product) => {
//         const createdDate = moment(product.createdAt);
//         return createdDate.isBetween(startDate, endDate, undefined, "[]");
//       });
//     }

//     // Filter by Seller name
//     if (SellerSearch) {
//       filtered = filtered.filter(
//         (product) =>
//           product.createdBy?.role === "Seller" &&
//           product.createdBy?.username
//             .toLowerCase()
//             .includes(SellerSearch.toLowerCase())
//       );
//     }

//     // Filter by Seller city
//     if (SellerCity) {
//       filtered = filtered.filter(
//         (product) =>
//           product.createdBy?.role === "Seller" &&
//           product.createdBy?.city
//             ?.toLowerCase()
//             .includes(SellerCity.toLowerCase())
//       );
//     }

//     // Return an object with the same structure as products
//     return {
//       data: filtered,
//       pagination: products?.pagination,
//     };
//   };
//   const filteredProducts = handleDateFilter();

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (isError) {
//     return <div>Error loading products</div>;
//   }

//   const handleNextPage = () => {
//     if (currentPage < products?.pagination.totalPages) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//     }
//   };

//   const stripHtml = (html) => {
//     const doc = new DOMParser().parseFromString(html, "text/html");
//     return doc.body.textContent || "";
//   };

//   return (
//     <>
//       <div className="flex flex-col items-center darktheme px-6">
//         <section className="w-full  darktheme bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-600 ">
//           <div className="flex flex-col gap-4 mb-6">
//             <h2 className="text-2xl font-bold text-center mb-8 text-customBlue">
//               All Products ({products.data.length})
//             </h2>
//             {userInfo.role === "Admin" && (
//               <div className="w-full flex flex-wrap gap-4">
//                 <div className="flex flex-wrap gap-4 w-full sm:w-auto">
//                   <input
//                     type="date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     className="px-3 py-2 rounded-md w-full sm:w-auto"
//                   />
//                   <input
//                     type="date"
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                     className="px-3 py-2 rounded-md w-full sm:w-auto"
//                   />
//                 </div>

//                 <div className="flex-grow w-full sm:w-auto">
//                   <input
//                     type="text"
//                     placeholder="Search by Seller Name"
//                     value={SellerSearch}
//                     onChange={(e) => setSellerSearch(e.target.value)}
//                     className="w-full px-4 py-2 rounded-md border border-gray-300"
//                   />
//                 </div>

//                 <div className="flex-grow w-full sm:w-auto">
//                   <input
//                     type="text"
//                     placeholder="Search by Seller City"
//                     value={SellerCity}
//                     onChange={(e) => setSellerCity(e.target.value)}
//                     className="w-full px-4 py-2 rounded-md border border-gray-300"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="flex flex-col items-center dark:bg-gray-900 bg-gray-100 mt-5 overflow-x-auto p-4">
//             {filteredProducts.data.map((product) => (
//               <Link
//                 key={product._id}
//                 to={`/product/${product._id}`}
//                 className="block mb-6 w-full px-2"
//               >
//                 <div className="flex flex-col sm:flex-row overflow-hidden sm:gap-4">
//                   <img
//                     src={BASE_URL + product.images[0]}
//                     alt={product.name}
//                     className="w-full sm:w-[15rem] object-cover aspect-[186/116]sm:h-auto"
//                   />

//                   <div className="p-4 flex flex-col justify-between sm:ml-4 sm:w-full md:w-3/4">
//                     <div className="flex justify-between items-start mb-3">
//                       <h5 className="text-xl font-semibold dark:text-white text-gray-800 truncate">
//                         {product?.name}
//                       </h5>
//                       <p className="text-gray-400 dark:text-white text-xs">
//                         {moment(product.createdAt).format("MMMM Do YYYY")}
//                       </p>
//                     </div>

//                     <p className="dark:text-gray-300 text-gray-600 text-sm mb-4 line-clamp-3">
//                       {stripHtml(product?.description)?.substring(0, 160)}...
//                     </p>

//                     <div className="flex justify-between items-center mt-auto">
//                       {(userInfo.role === "Admin" ||
//                         userInfo.role === "Accounts" ||
//                         userInfo.role === "Inventory") && (
//                           <Link
//                             to={`/admin/product/update/${product._id}`}
//                             className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-customBlue rounded-lg hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-opacity-50"
//                           >
//                             Update Product
//                             <svg
//                               className="w-3.5 h-3.5 ml-2"
//                               aria-hidden="true"
//                               xmlns="http://www.w3.org/2000/svg"
//                               fill="none"
//                               viewBox="0 0 14 10"
//                             >
//                               <path
//                                 stroke="currentColor"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M1 5h12m0 0L9 1m4 4L9 9"
//                               />
//                             </svg>
//                           </Link>
//                         )}

//                       <p className="text-lg font-semibold text-gray-900">
//                         &#8377;{product.mrp}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>

//           <div className="flex justify-center items-center mt-6 space-x-3 mb-4 ">
//             <button
//               onClick={handlePrevPage}
//               disabled={currentPage === 1}
//               className="px-4 py-2 pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
//               aria-label="Previous Page"
//             >
//               <FaChevronLeft />
//             </button>
//             <div className="flex items-center space-x-2 max-w-[70%] overflow-x-auto scrollbar-hide">
//               {Array.from({ length: products.pagination.totalPages }, (_, index) => (
//                 <button
//                   key={index + 1}
//                   onClick={() => setCurrentPage(index + 1)}
//                   className={`px-4 py-2 rounded-full font-semibold text-sm transition duration-300 ease-in-out ${currentPage === index + 1
//                     ? "bg-gradient-to-r from-customBlue to-customBlue/80 text-white shadow-lg hover:scale-105"
//                     : "pagination text-white hover:bg-customBlue/80"
//                     }`}
//                   aria-label={`Go to page ${index + 1}`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>

//             <button
//               onClick={handleNextPage}
//               disabled={currentPage === products.pagination.totalPages}
//               className="px-4 py-2 pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
//               aria-label="Next Page"
//             >
//               <FaChevronRight />
//             </button>
//           </div>
//           <div className="md:w-1/4 p-3 mt-2">
//             <AdminMenu />
//           </div>
//         </section>
//       </div>
//     </>
//   );
// };

// export default AllProducts;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { FaChevronLeft, FaChevronRight, FaSearch, FaFilter } from "react-icons/fa";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../redux/constants";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const AllProducts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const {
    data: products,
    refetch,
    isLoading,
    isError,
  } = useAllProductsQuery({ page: currentPage, limit });
  const { userInfo } = useSelector((state) => state.auth);

  
  // State for filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sellerSearch, setSellerSearch] = useState("");
  const [sellerCity, setSellerCity] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);
const handleDateFilter = () => {
  if (!products?.data) return { data: [], pagination: { totalPages: 1 } };

  let filtered = [...products.data];

  // Apply filters on current page data only
  if (productSearch) {
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(productSearch.toLowerCase())
    );
  }
  if (startDate && endDate) {
    filtered = filtered.filter(product => {
      const createdDate = moment(product.createdAt);
      return createdDate.isBetween(startDate, endDate, undefined, "[]");
    });
  }
  if (sellerSearch) {
    filtered = filtered.filter(product =>
      product.createdBy?.username?.toLowerCase().includes(sellerSearch.toLowerCase())
    );
  }
  if (sellerCity) {
    filtered = filtered.filter(product =>
      product.createdBy?.city?.toLowerCase().includes(sellerCity.toLowerCase())
    );
  }

  // **Do not modify totalPages here, keep it from backend**
  return {
    data: filtered,
    pagination: products.pagination
  };
};

  const filteredProducts = handleDateFilter();

  const handleNextPage = () => {
    if (currentPage < filteredProducts.pagination.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSellerSearch("");
    setSellerCity("");
    setProductSearch("");
    setCurrentPage(1);
  };

  const stripHtml = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const formatDate = (dateString) => {
    return moment(dateString).format("MMM D, YYYY");
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4">
        {/* <AdminMenu /> */}
        <div className="w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-5">
              {/* Search and Filter Section */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seller Name</label>
                        <input
                          type="text"
                          placeholder="Search by seller..."
                          value={sellerSearch}
                          onChange={(e) => setSellerSearch(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seller City</label>
                        <input
                          type="text"
                          placeholder="Filter by city..."
                          value={sellerCity}
                          onChange={(e) => setSellerCity(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-4">
                        <button
                          onClick={clearFilters}
                          className="w-full sm:w-auto p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium"
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
              ) : isError ? (
                <Message variant="danger">Error loading products</Message>
              ) : (
                <>
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Products ({filteredProducts.data.length})
                      </h2>
                    </div>

                    {filteredProducts.data.length > 0 ? (
                      <div className="space-y-4">
                        {filteredProducts.data.map((product) => (
                          <div 
                            key={product._id}
                            className="flex flex-col sm:flex-row border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <div className="w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                              <img
                                src={`${BASE_URL}${product.images[0]}`}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 p-4 flex flex-col">
                              <div className="flex justify-between items-start">
                                <Link to={`/product/${product._id}`} className="hover:underline">
                                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{product.name}</h3>
                                </Link>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(product.createdAt)}</span>
                              </div>
                              
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                                {stripHtml(product.description).substring(0, 150)}...
                              </p>
                              
                              <div className="mt-auto pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                  ₹{product.mrp}
                                </div>
                                <div className="flex gap-2">
                                  <Link
                                    to={`/product/${product._id}`}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    View Details
                                  </Link>
                                  {(userInfo.role === "Admin" || userInfo.role === "Accounts" || userInfo.role === "Inventory") && (
                                    <Link
                                      to={`/admin/product/update/${product._id}`}
                                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                      Update
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No products found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No products match the current filters.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {!isLoading && !isError && filteredProducts.data.length > 0 && (
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
                  {console.log("totalPages",filteredProducts.pagination)}
                    
                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: filteredProducts.pagination.totalPages > 5 ? 5 : filteredProducts.pagination.totalPages },
                      (_, index) => {
                        let pageNum;
                        if (filteredProducts.pagination.totalPages <= 5) {
                          pageNum = index + 1;
                        } else {
                          if (currentPage <= 3) {
                            pageNum = index + 1;
                          } else if (currentPage >= filteredProducts.pagination.totalPages - 2) {
                            pageNum = filteredProducts.pagination.totalPages - 4 + index;
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
                    )} {console.log("totalPages",filteredProducts.pagination)}
                    
                    {filteredProducts.pagination.totalPages > 5 && currentPage < filteredProducts.pagination.totalPages - 2 && (
                      <>
                        <span className="text-gray-700 dark:text-gray-300">...</span>
                        <button
                          onClick={() => setCurrentPage(filteredProducts.pagination.totalPages)}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          aria-label={`Go to page ${filteredProducts.pagination.totalPages}`}
                        >
                          {filteredProducts.pagination.totalPages}
                        </button>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === filteredProducts.pagination.totalPages}
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

export default AllProducts;