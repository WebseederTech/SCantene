// import { Link } from "react-router-dom";
// import moment from "moment";
// import {
//   useLowStockProductsQuery,
//   useUpdateStockMutation,
// } from "../../redux/api/productApiSlice";
// import AdminMenu from "./AdminMenu";
// import { useState } from "react";
// import { BASE_URL } from "../../redux/constants";
// import { toast } from "react-toastify";


// const LowStock = () => {
//   const {
//     data: products = [],
//     isLoading,
//     isError,
//   } = useLowStockProductsQuery(); // Fetch low stock products
//   const [updateStock] = useUpdateStockMutation(); // Mutation for updating stock
//   const [stockValues, setStockValues] = useState({});

//   const handleStockChange = (id, value) => {
//     setStockValues({ ...stockValues, [id]: value }); // Update stock value in state
//   };

//   // const handleUpdateStock = async (id) => {
//   //   const newStock = stockValues[id];
//   //   if (newStock != null) {
//   //     try {
//   //       await updateStock({ id, countInStock: parseInt(newStock, 10) }); // Ensure countInStock is sent as a number
//   //       setStockValues({ ...stockValues, [id]: "" }); // Clear input after update
//   //     } catch (error) {
//   //       console.error("Error updating stock:", error);
//   //     }
//   //   }
//   // };

//   const handleUpdateStock = async (id) => {
//     const newStock = stockValues[id];
//     if (newStock != null) {
//       try {
//         await updateStock({ id, countInStock: parseInt(newStock, 10) });
//         toast.success("Stock updated successfully!"); // ✅ Success toast
//         setStockValues({ ...stockValues, [id]: "" });
//       } catch (error) {
//         toast.error("Error updating stock."); // ❌ Error toast
//         console.error("Error updating stock:", error);
//       }
//     }
//   };
  

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error loading low stock products</div>;

//   return (
//     <div className="flex flex-col items-center darktheme px-6">
//       <section className="w-full  darktheme bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-600 ">
//         <h2 className="text-2xl font-bold text-center mb-8 text-customBlue">
//           Low Stock Products ({products?.length || 0})
//         </h2>

//         {products.length === 0 ? (
//           <div className="text-center mt-4 text-red-500">Product not found</div>
//         ) : (
//           <div className="flex flex-col items-center dark:bg-gray-900 bg-gray-100 mt-5 overflow-x-auto p-4 rounded-lg">
//             {products.map((product) => (
//               <div
//                 key={product._id}
//                 className="block mb-6 w-full px-2"
//               >
//                 <div className="flex flex-col sm:flex-row overflow-hidden sm:gap-4">
//                   <img
//                     src={BASE_URL + product.images[0]}
//                     alt={product.name}
//                     className="w-[15rem] object-cover"
//                   />
//                   <div className="p-4 flex flex-col justify-between sm:ml-4 sm:w-full md:w-3/4">
//                     <div className="flex justify-between items-start mb-3">
//                       <h5 className="text-xl font-semibold mb-2">
//                         {product?.name}
//                       </h5>
//                       <p className="text-gray-400 text-xs">
//                         {moment(product.createdAt).format("MMMM Do YYYY")}
//                       </p>
//                     </div>
//                     <p className="text-gray-400 xl:w-[40rem] lg:w-[35rem] md:w-[30rem] sm:w-[20rem] text-sm mb-4">
//                       {product?.description?.substring(0, 160)}...
//                     </p>
//                     <div className="flex justify-between items-center mt-auto">
//                       <div className="flex items-center">
//                         <input
//                           type="number"
//                           placeholder="New stock count"
//                           value={stockValues[product._id] || ""}
//                           onChange={(e) =>
//                             handleStockChange(product._id, e.target.value)
//                           }
//                           className="w-[8rem] p-1 mr-2 border rounded text-gray-700"
//                         />
//                         <button
//                           onClick={() => handleUpdateStock(product._id)}
//                           className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-customBlue rounded-lg hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-opacity-50"
//                         >
//                           Update
//                           <svg
//                             className="w-3.5 h-3.5 ml-2"
//                             aria-hidden="true"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 14 10"
//                           >
//                             <path
//                               stroke="currentColor"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M1 5h12m0 0L9 1m4 4L9 9"
//                             />
//                           </svg>
//                         </button>
//                       </div>
//                       <p className="text-lg font-semibold">
//                         &#8377;{product.mrp}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="md:w-1/4 p-3 mt-2">
//           <AdminMenu />
//         </div>
//       </section>
//     </div>
//   );
// };

// export default LowStock;


import React, { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { FaChevronLeft, FaChevronRight, FaSearch, FaFilter } from "react-icons/fa";
import {
  useLowStockProductsQuery,
  useUpdateStockMutation,
} from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import { BASE_URL } from "../../redux/constants";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const LowStock = () => {
  const {
    data: products = [],
    isLoading,
    isError,
  } = useLowStockProductsQuery();
  const [updateStock] = useUpdateStockMutation();
  const [stockValues, setStockValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleStockChange = (id, value) => {
    setStockValues({ ...stockValues, [id]: value });
  };

  const handleUpdateStock = async (id) => {
    const newStock = stockValues[id];
    if (newStock != null) {
      try {
        await updateStock({ id, countInStock: parseInt(newStock, 10) });
        toast.success("Stock updated successfully!");
        setStockValues({ ...stockValues, [id]: "" });
      } catch (error) {
        toast.error("Error updating stock.");
        console.error("Error updating stock:", error);
      }
    }
  };

  // Filter and sort products
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === "price") {
      return sortOrder === "asc" 
        ? a.mrp - b.mrp
        : b.mrp - a.mrp;
    } else {
      // Default: sort by date
      return sortOrder === "asc" 
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + limit);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("date");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  );
  
  if (isError) return (
    <div className="min-h-screen flex items-center justify-center">
      <Message variant="danger">Error loading low stock products</Message>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4">
        {/* <AdminMenu /> */}
        
        <div className="w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Low Stock Products ({products.length})
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage products that need immediate restocking
              </p>
            </div>
            
            <div className="px-6 py-5">
              {/* Search and Filter Section */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search by product name..."
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="date">Date Created</option>
                          <option value="name">Product Name</option>
                          <option value="price">Price</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort Order</label>
                        <select
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="desc">Descending</option>
                          <option value="asc">Ascending</option>
                        </select>
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

              {paginatedProducts.length === 0 ? (
                <div className="text-center py-16">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No products found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {paginatedProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 h-48 overflow-hidden">
                          <img
                            src={BASE_URL + product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4 flex flex-col">
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
                              {product.name}
                            </h5>
                            <div className="text-gray-500 dark:text-gray-400 text-sm">
                              {moment(product.createdAt).format("MMMM Do YYYY")}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow mb-4">
                            {product.description?.substring(0, 150)}
                            {product.description?.length > 150 ? "..." : ""}
                          </p>
                          
                          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-auto">
                            <div className="flex items-center w-full sm:w-auto">
                              <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md overflow-hidden">
                                <input
                                  type="number"
                                  placeholder="New stock"
                                  value={stockValues[product._id] || ""}
                                  onChange={(e) => handleStockChange(product._id, e.target.value)}
                                  className="w-full p-2 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 dark:text-gray-200"
                                  min="0"
                                />
                                <button
                                  onClick={() => handleUpdateStock(product._id)}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                                >
                                  Update
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 w-full sm:w-auto justify-between sm:justify-end">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">Current Stock:</span>
                                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-xs font-medium">
                                  {product.countInStock}
                                </span>
                              </div>
                              
                              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                ₹{product.mrp.toLocaleString('en-IN')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {sortedProducts.length > 0 && (
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

export default LowStock;