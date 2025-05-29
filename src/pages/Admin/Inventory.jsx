// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import moment from "moment";
// import { useSelector } from "react-redux";
// import {
//   useAllProductsQuery,
//   useDeleteProductMutation,
//   useUpdateProductMutation,
// } from "../../redux/api/productApiSlice";
// import AdminMenu from "./AdminMenu";
// import { BASE_URL } from "../../redux/constants";
// import { useFetchBrandsQuery } from "../../redux/api/brandApiSlice";
// import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
// import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
// import ExportProducts from "./ExportProducts";
// import ImportProducts from "./ImportProducts";

// const Inventory = () => {
//   // State Hooks
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit] = useState(50);
//   const [isEnable, setIsEnable] = useState({});
//   const [outOfStock, setOutOfStock] = useState({});
//   const [isLoader, setIsLoader] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Query Hooks
//   const { data: brandList } = useFetchBrandsQuery();
//   const { data: categoryList } = useFetchCategoriesQuery();
//   const {
//     data: products,
//     refetch,
//     isLoading,
//     isError,
//   } = useAllProductsQuery({ 
//     page: currentPage, 
//     limit,
//     search: searchTerm // Send search term to API
//   });

//   // Mutation Hooks
//   const [updateProduct] = useUpdateProductMutation();
//   const [deleteProduct] = useDeleteProductMutation();

//   // Selector and User Info
//   const { userInfo } = useSelector((state) => state.auth) || {};
//   const userId = userInfo?._id;

//   // Memoized Filtered Products
//   const filteredProducts = useMemo(() => {
//     if (!products?.data || !userInfo) return [];

//     // First filter by user role
//     const roleFilteredProducts = products.data.filter((product) => {
//       if (["Admin", "Seller"].includes(userInfo.role)) {
//         return product.createdBy?._id === userId;
//       }
//       if (["Accounts", "Inventory"].includes(userInfo.role)) {
//         return product.createdBy?.role === "Admin";
//       }
//       return true;
//     });

//     // Then filter by search term if one exists
//     if (searchTerm.trim() === "") {
//       return roleFilteredProducts;
//     } else {
//       return roleFilteredProducts.filter((product) =>
//         product.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
//   }, [products, userInfo, userId, searchTerm]);

//   // Refetch Effect
//   useEffect(() => {
//     refetch();
//   }, [currentPage, searchTerm, refetch]);

//   // Initialize Enable and Stock States
//   useEffect(() => {
//     if (!filteredProducts.length) return;

//     const initialEnableState = {};
//     const initialStockState = {};

//     filteredProducts.forEach((product) => {
//       initialEnableState[product._id] = product.isEnable;
//       initialStockState[product._id] = product.outOfStock;
//     });

//     setIsEnable(initialEnableState);
//     setOutOfStock(initialStockState);
//   }, [filteredProducts]);

//   // Search Handler
//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     // Reset to first page when searching
//     setCurrentPage(1);
//   };

//   // Toggle Product Enable Status
//   const toggleEnable = useCallback(
//     async (productId) => {
//       if (!["Admin", "Accounts", "Inventory"].includes(userInfo.role)) {
//         alert("You don't have permission to change product status");
//         return;
//       }

//       const newEnableStatus = !isEnable[productId];
//       setIsEnable((prev) => ({ ...prev, [productId]: newEnableStatus }));

//       try {
//         await updateProduct({
//           productId,
//           formData: { isEnable: newEnableStatus },
//         }).unwrap();
//       } catch (error) {
//         setIsEnable((prev) => ({ ...prev, [productId]: !newEnableStatus }));
//         console.error("Error updating product enable status", error);
//       }
//     },
//     [isEnable, updateProduct, userInfo.role]
//   );

//   // Toggle Stock Status
//   const toggleStockStatus = useCallback(
//     async (productId) => {
//       if (!["Admin", "Accounts", "Inventory"].includes(userInfo.role)) {
//         alert("You don't have permission to change stock status");
//         return;
//       }

//       const newStockStatus = !outOfStock[productId];
//       setOutOfStock((prev) => ({ ...prev, [productId]: newStockStatus }));

//       try {
//         await updateProduct({
//           productId,
//           formData: { outOfStock: newStockStatus },
//         }).unwrap();
//       } catch (error) {
//         setOutOfStock((prev) => ({ ...prev, [productId]: !newStockStatus }));
//         console.error("Error updating product stock status", error);
//       }
//     },
//     [outOfStock, updateProduct, userInfo.role]
//   );

//   // Delete Product Handler
//   const handleDelete = useCallback(
//     async (productId) => {
//       const confirmDelete = window.confirm(
//         "Are you sure you want to delete this product?"
//       );
//       if (!confirmDelete) return;

//       try {
//         await deleteProduct(productId).unwrap();
//         alert("Product deleted successfully!");
//         refetch(); // Refetch products after deletion
//       } catch (error) {
//         console.error("Error deleting product:", error);
//         alert("Failed to delete the product. Please try again.");
//       }
//     },
//     [deleteProduct, refetch]
//   );

//   // Pagination Handlers
//   const handleNextPage = useCallback(() => {
//     if (currentPage < products.pagination.totalPages) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   }, [currentPage, products?.pagination?.totalPages]);

//   const handlePrevPage = useCallback(() => {
//     if (currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//     }
//   }, [currentPage]);

//   // HTML Stripping Utility
//   const stripHtml = (html) => {
//     const doc = new DOMParser().parseFromString(html, "text/html");
//     return doc.body.textContent || "";
//   };

//   // Loader Component
//   const Loader = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-800"></div>
//     </div>
//   );

//   // Loading and Error States
//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error loading products</div>;

//   // Total Pages Calculation
//   const totalPages = products?.pagination?.totalPages || 1;

//   return (
//     <div className="flex flex-col items-center darktheme px-6">
//       <section className="w-full darktheme bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-600">
//         <h2 className="text-2xl font-bold text-center mb-8 text-customBlue">
//           {userInfo.username} Inventory ({filteredProducts.length})
//         </h2>

//         {/* Search and Export/Import Controls */}
//         <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
//           {/* Search Input */}
//           <div className="relative w-full md:w-96">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <FaSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               className="block w-full p-3 pl-10 text-sm border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-customBlue focus:border-customBlue"
//               placeholder="Search products by name..."
//               value={searchTerm}
//               onChange={handleSearch}
//             />
//           </div>

//           {/* Export/Import Buttons */}
//           <div className="flex flex-wrap gap-2">
//             <ExportProducts
//               filteredProducts={filteredProducts}
//               brandList={brandList}
//               categoryList={categoryList}
//             />
//             <ImportProducts
//               userInfo={userInfo}
//               setIsLoader={setIsLoader}
//               brandList={brandList}
//               categoryList={categoryList}
//             />
//             {isLoader && <Loader />}
//           </div>
//         </div>

//         <div className="flex flex-col items-center dark:bg-gray-900 bg-gray-100 mt-5 overflow-x-auto p-4 space-y-4 rounded-lg">
//           {filteredProducts.length > 0 ? (
//             filteredProducts.map((product) => (
//               <div
//                 key={product._id}
//                 className="flex flex-col sm:flex-row w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md"
//               >
//                 <div className="w-48 h-48 flex-shrink-0">
//                   <img
//                     src={BASE_URL + product.images[0]}
//                     alt={product.name}
//                     className="w-full h-full object-cover aspect-[186/116]"
//                   />
//                 </div>

//                 <div className="flex-1 p-4">
//                   <div className="flex flex-col sm:flex-row justify-between mb-2">
//                     <h5 className="text-lg sm:text-xl font-semibold">
//                       {product?.name}
//                     </h5>
//                     <p className="text-gray-400 text-xs mt-1 sm:mt-0">
//                       {moment(product.createdAt).format("MMMM Do YYYY")}
//                     </p>
//                   </div>

//                   <p className="text-gray-400 text-sm mb-4">
//                     {stripHtml(product?.description?.substring(0, 160))}...
//                   </p>

//                   <div className="flex flex-col gap-4 mt-4 md:flex-row md:items-center md:justify-between">
//                     <div className="flex gap-2 flex-wrap sm:flex-nowrap">
//                       <Link
//                         to={`/admin/product/update/${product._id}`}
//                         className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-customBlue rounded-lg hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customPurple focus:ring-opacity-50 whitespace-nowrap min-w-[150px]"
//                       >
//                         Update Product
//                         <svg
//                           className="w-3.5 h-3.5 ml-2"
//                           aria-hidden="true"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 14 10"
//                         >
//                           <path
//                             stroke="currentColor"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M1 5h12m0 0L9 1m4 4L9 9"
//                           />
//                         </svg>
//                       </Link>
//                       <button
//                         onClick={() => handleDelete(product._id)}
//                         className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-800 rounded-lg hover:bg-red-700"
//                       >
//                         Delete
//                       </button>
//                     </div>

//                     <div className="flex items-center sm:justify-end md:w-24">
//                       <p className="text-lg font-semibold">
//                         &#8377; {product.mrp}
//                       </p>
//                     </div>

//                     <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
//                       <div className="flex items-center justify-between sm:justify-start gap-2">
//                         <span className="font-medium text-sm whitespace-nowrap">
//                           Enable Product
//                         </span>
//                         <button
//                           type="button"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             toggleEnable(product._id);
//                           }}
//                           className={`relative inline-flex items-center w-32 h-6 rounded-full transition-colors duration-300 ${
//                             isEnable[product._id] ? "bg-green-500" : "bg-gray-400"
//                           }`}
//                         >
//                           <span className="absolute left-8 text-xs font-semibold text-white">
//                             {isEnable[product._id] ? "Enabled" : "Disabled"}
//                           </span>
//                           <span
//                             className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
//                               isEnable[product._id] ? "right-1" : "left-1"
//                             }`}
//                           />
//                         </button>
//                       </div>

//                       <div className="flex items-center justify-between sm:justify-start gap-2">
//                         <span className="font-medium text-sm whitespace-nowrap">
//                           Stock Status
//                         </span>
//                         <button
//                           type="button"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             toggleStockStatus(product._id);
//                           }}
//                           className={`relative inline-flex items-center w-32 h-6 rounded-full transition-colors duration-300 ${
//                             outOfStock[product._id]
//                               ? "bg-red-500"
//                               : "bg-green-500"
//                           }`}
//                         >
//                           <span className="absolute left-8 text-xs font-semibold text-white">
//                             {outOfStock[product._id] ? "Out Stock" : "In Stock"}
//                           </span>
//                           <span
//                             className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
//                               outOfStock[product._id] ? "right-1" : "left-1"
//                             }`}
//                           />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="w-full text-center py-8">
//               <p className="text-lg text-gray-400">
//                 {searchTerm ? "No products match your search." : "No products found."}
//               </p>
//             </div>
//           )}
//         </div>

//         {filteredProducts.length > 0 && (
//           <div className="flex justify-center items-center mt-6 space-x-3 mb-4">
//             <button
//               onClick={handlePrevPage}
//               disabled={currentPage === 1}
//               className="px-4 py-2 pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
//               aria-label="Previous Page"
//             >
//               <FaChevronLeft />
//             </button>

//             <div className="flex items-center space-x-2 max-w-[70%] overflow-x-auto scrollbar-hide">
//               {Array.from(
//                 { length: products.pagination.totalPages },
//                 (_, index) => (
//                   <button
//                     key={index + 1}
//                     onClick={() => setCurrentPage(index + 1)}
//                     className={`px-4 py-2 rounded-full font-semibold text-sm transition duration-300 ease-in-out ${
//                       currentPage === index + 1
//                         ? "bg-gradient-to-r from-customBlue to-customBlue/80 text-white shadow-lg hover:scale-105"
//                         : "pagination text-white hover:bg-customBlue/80"
//                     }`}
//                     aria-label={`Go to page ${index + 1}`}
//                   >
//                     {index + 1}
//                   </button>
//                 )
//               )}
//             </div>

//             <button
//               onClick={handleNextPage}
//               disabled={currentPage >= totalPages}
//               className="px-4 py-2 pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
//               aria-label="Next Page"
//             >
//               <FaChevronRight />
//             </button>
//           </div>
//         )}

//         <div className="w-full lg:w-1/4 p-3 mt-4">
//           <AdminMenu />
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Inventory;

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";
import {
  useAllProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import { BASE_URL } from "../../redux/constants";
import { useFetchBrandsQuery } from "../../redux/api/brandApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { FaChevronLeft, FaChevronRight, FaSearch, FaFilter } from "react-icons/fa";
import ExportProducts from "./ExportProducts";
import ImportProducts from "./ImportProducts";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useFetchSubCategoriesQuery } from "../../redux/api/subCategoryApiSlice";
import SubCategoryList from "./SubCategoryList";

const Inventory = () => {
  // State Hooks
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(50);
  const [isEnable, setIsEnable] = useState({});
  const [outOfStock, setOutOfStock] = useState({});
  const [isLoader, setIsLoader] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  // Query Hooks
  const { data: brandList } = useFetchBrandsQuery();
  const { data: categoryList } = useFetchCategoriesQuery();
    const { data: subCategories = [] } = useFetchSubCategoriesQuery();
  const {
    data: products,
    refetch,
    isLoading,
    isError,
  } = useAllProductsQuery({ 
    page: currentPage, 
    limit,
    search: searchTerm
  });

  // Mutation Hooks
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // Selector and User Info
  const { userInfo } = useSelector((state) => state.auth) || {};
  const userId = userInfo?._id;

  // Memoized Filtered Products
  const filteredProducts = useMemo(() => {
    if (!products?.data || !userInfo) return [];

    // First filter by user role
    let roleFilteredProducts = products.data.filter((product) => {
      if (["Admin", "Seller"].includes(userInfo.role)) {
        return product.createdBy?._id === userId;
      }
      if (["Accounts", "Inventory"].includes(userInfo.role)) {
        return product.createdBy?.role === "Admin";
      }
      return true;
    });

    // Apply brand filter if selected
    if (brandFilter) {
      roleFilteredProducts = roleFilteredProducts.filter(
        product => product.brand?._id === brandFilter
      );
    }

    // Apply category filter if selected
    if (categoryFilter) {
      roleFilteredProducts = roleFilteredProducts.filter(
        product => product.category?._id === categoryFilter
      );
    }

        // Apply subCategory filter if selected
    if (subCategoryFilter) {
      roleFilteredProducts = roleFilteredProducts.filter(
        product => product.subCategory?._id === subCategoryFilter
      );
    }

    // Apply stock filter if selected
    if (stockFilter) {
      roleFilteredProducts = roleFilteredProducts.filter(
        product => stockFilter === "in-stock" ? !product.outOfStock : product.outOfStock
      );
    }

    return roleFilteredProducts;
  }, [products, userInfo, userId, brandFilter, categoryFilter,subCategoryFilter, stockFilter]);

  // Refetch Effect
  useEffect(() => {
    refetch();
  }, [currentPage, searchTerm, refetch]);

  // Initialize Enable and Stock States
  useEffect(() => {
    if (!filteredProducts.length) return;

    const initialEnableState = {};
    const initialStockState = {};

    filteredProducts.forEach((product) => {
      initialEnableState[product._id] = product.isEnable;
      initialStockState[product._id] = product.outOfStock;
    });

    setIsEnable(initialEnableState);
    setOutOfStock(initialStockState);
  }, [filteredProducts]);

  // Search Handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Clear Filters
  const clearFilters = () => {
    setSearchTerm("");
    setBrandFilter("");
    setCategoryFilter("");
    setSubCategoryFilter("");
    setStockFilter("");
    setCurrentPage(1);
  };

  // Toggle Product Enable Status
  const toggleEnable = useCallback(
    async (productId) => {
      if (!["Admin", "Accounts", "Inventory"].includes(userInfo.role)) {
        alert("You don't have permission to change product status");
        return;
      }

      const newEnableStatus = !isEnable[productId];
      setIsEnable((prev) => ({ ...prev, [productId]: newEnableStatus }));

      try {
        await updateProduct({
          productId,
          formData: { isEnable: newEnableStatus },
        }).unwrap();
      } catch (error) {
        setIsEnable((prev) => ({ ...prev, [productId]: !newEnableStatus }));
        console.error("Error updating product enable status", error);
      }
    },
    [isEnable, updateProduct, userInfo.role]
  );

  // Toggle Stock Status
  const toggleStockStatus = useCallback(
    async (productId) => {
      if (!["Admin", "Accounts", "Inventory"].includes(userInfo.role)) {
        alert("You don't have permission to change stock status");
        return;
      }

      const newStockStatus = !outOfStock[productId];
      setOutOfStock((prev) => ({ ...prev, [productId]: newStockStatus }));

      try {
        await updateProduct({
          productId,
          formData: { outOfStock: newStockStatus },
        }).unwrap();
      } catch (error) {
        setOutOfStock((prev) => ({ ...prev, [productId]: !newStockStatus }));
        console.error("Error updating product stock status", error);
      }
    },
    [outOfStock, updateProduct, userInfo.role]
  );

  // Delete Product Handler
  const handleDelete = useCallback(
    async (productId) => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!confirmDelete) return;

      try {
        await deleteProduct(productId).unwrap();
        alert("Product deleted successfully!");
        refetch();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete the product. Please try again.");
      }
    },
    [deleteProduct, refetch]
  );

  // Pagination Handlers
  const handleNextPage = useCallback(() => {
    if (currentPage < products?.pagination?.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, products?.pagination?.totalPages]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  // HTML Stripping Utility
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Format Date
  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  // Loading and Error States
  if (isLoading) return <Loader />;
  if (isError) return <Message variant="danger">Error loading products</Message>;

  // Total Pages Calculation
  const totalPages = products?.pagination?.totalPages || 1;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4">
       
        
        <div className="w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {/* <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Inventory Management
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your products, update stock status, and optimize inventory ({filteredProducts.length} products)
              </p>
            </div>
             */}
            <div className="px-6 py-5">
              {/* Search and Filter Section */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="relative w-full md:w-64">
                    <input
                      type="text"
                      placeholder="Search products by name..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="w-full p-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
                    </button>
                    <ExportProducts
                      filteredProducts={filteredProducts}
                      brandList={brandList}
                      categoryList={categoryList}
                    />
                    <ImportProducts
                      userInfo={userInfo}
                      setIsLoader={setIsLoader}
                      brandList={brandList}
                      categoryList={categoryList}
                    />
                  </div>
                </div>

                {showFilters && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mt-4 border border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Filter by Brand
                        </label>
                        <select
                          value={brandFilter}
                          onChange={(e) => setBrandFilter(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Brands</option>
                          {brandList?.map((brand) => (
                            <option key={brand._id} value={brand._id}>
                              {brand.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Filter by Category
                        </label>
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Categories</option>
                          {categoryList?.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                                            <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Filter by Sub-Category
                        </label>
                        <select
                          value={subCategoryFilter}
                          onChange={(e) => setSubCategoryFilter(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Sub-Categories</option>
                          {subCategories?.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Stock Status
                        </label>
                        <select
                          value={stockFilter}
                          onChange={(e) => setStockFilter(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Stock Status</option>
                          <option value="in-stock">In Stock</option>
                          <option value="out-of-stock">Out of Stock</option>
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

              {isLoader ? (
                <div className="flex justify-center py-12">
                  <Loader />
                </div>
              ) : (
                <>
                  <div className="flex flex-col space-y-4">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <div
                          key={product._id}
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-48 h-48 flex-shrink-0">
                              <img
                                src={BASE_URL + product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1 p-4 md:p-6">
                              <div className="flex flex-col md:flex-row justify-between mb-3">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 md:mt-0">
                                  {formatDate(product.createdAt)}
                                </p>
                              </div>

                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                                {stripHtml(product.description?.substring(0, 180))}...
                              </p>

                              <div className="flex flex-wrap gap-4 mb-4">
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                                    Price:
                                  </span>
                                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                    ₹{product.mrp}
                                  </span>
                                </div>

                                {product.brand && (
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                                      Brand:
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white">
                                      {product.brand.name}
                                    </span>
                                  </div>
                                )}

                                {product.category && (
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                                      Category:
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white">
                                      {product.category.name}
                                    </span>
                                  </div>
                                )}

                                  {product.subCategory && (
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                                      Sub-Category:
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white">
                                      {product.subCategory.name}
                                    </span>
                                  </div>
                                )}

                              </div>
                              

                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex flex-wrap gap-2">
                                  <Link
                                    to={`/admin/product/update/${product._id}`}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    Update Product
                                  </Link>
                                  <button
                                    onClick={() => handleDelete(product._id)}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                  >
                                    Delete
                                  </button>
                                </div>

                                <div className="flex items-center gap-4">
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                                      Status:
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => toggleEnable(product._id)}
                                      className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                        isEnable[product._id]
                                          ? "bg-green-500"
                                          : "bg-gray-400"
                                      }`}
                                    >
                                      <span
                                        className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                                          isEnable[product._id]
                                            ? "translate-x-7"
                                            : "translate-x-1"
                                        }`}
                                      />
                                    </button>
                                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                      {isEnable[product._id] ? "Enabled" : "Disabled"}
                                    </span>
                                  </div>

                                  <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                                      Stock:
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => toggleStockStatus(product._id)}
                                      className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                        outOfStock[product._id]
                                          ? "bg-red-500"
                                          : "bg-green-500"
                                      }`}
                                    >
                                      <span
                                        className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                                          outOfStock[product._id]
                                            ? "translate-x-7"
                                            : "translate-x-1"
                                        }`}
                                      />
                                    </button>
                                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                      {outOfStock[product._id] ? "Out of Stock" : "In Stock"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No products found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {searchTerm || brandFilter || categoryFilter || stockFilter 
                            ? "No products match your search criteria."
                            : "Get started by creating a new product."}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {!isLoading && filteredProducts.length > 0 && (
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

export default Inventory;