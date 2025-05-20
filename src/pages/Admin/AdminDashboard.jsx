// import { useState, useEffect } from "react";
// import {
//   Users,
//   ShoppingCart,
//   Package,
//   DollarSign,
//   TrendingUp,
//   TrendingDown,
//   Sun,
//   Moon,
//   SlidersHorizontal,
//   Tag,
//   Layers,
//   UserCheck,
//   Box,
//   MoreHorizontal,
//   X,
// } from "lucide-react";
// import { useNavigate } from "react-router";
// import { BASE_URL } from "../../redux/constants";
// import NotificationSidebar from "./NotificationSidebar";

// export default function AdminDashboard() {
//   // const [activeTab, setActiveTab] = useState("dashboard");
//   const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//   const adminId = userInfo?._id;

//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [dashboardData, setDashboardData] = useState({
//     todayOrdersCount: 0,
//     totalOrdersCount: 0,
//     activeCustomersCount: 0,
//     pendingOrdersCount: 0,
//     recentOrders: [],
//     topProducts: [],
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isOpen, setIsOpen] = useState(false);

//   // Separate filter states for each section
//   const [showOrderFilters, setShowOrderFilters] = useState(false);
//   const [showProductFilters, setShowProductFilters] = useState(false);

//   // Filter states for products
//   const [brandFilter, setBrandFilter] = useState("All");
//   const [categoryFilter, setCategoryFilter] = useState("All");
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("userInfo")) || {};
//   console.log(user);

//   // Extract unique brands and categories from the API response
//   const extractBrandOptions = () => {
//     const brands = dashboardData.topProducts
//       .filter((product) => product.brand && product.brand.name)
//       .map((product) => product.brand.name);

//     // Remove duplicates
//     const uniqueBrands = ["All", ...new Set(brands)];
//     return uniqueBrands;
//   };

//   const extractCategoryOptions = () => {
//     const categories = dashboardData.topProducts
//       .filter((product) => product.category && product.category.name)
//       .map((product) => product.category.name);

//     // Remove duplicates
//     const uniqueCategories = ["All", ...new Set(categories)];
//     return uniqueCategories;
//   };

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(
//           `${BASE_URL}/api/dashboard/admin-dashboard`
//         );

//         if (!response.ok) {
//           throw new Error(`API error: ${response.status}`);
//         }

//         const data = await response.json();
//         setDashboardData(data);
//         setError(null);
//       } catch (err) {
//         setError(`Failed to fetch dashboard data: ${err.message}`);
//         console.error("Error fetching dashboard data:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   // Toggle dark mode
//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode);
//     document.documentElement.classList.toggle("dark");
//   };

//   // Format date to more readable format
//   const formatDate = (dateString) => {
//     const options = { year: "numeric", month: "short", day: "numeric" };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   // Format price to currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   // Get status class based on order status
//   const getStatusClass = (status) => {
//     switch (status) {
//       case "Delivered":
//         return isDarkMode
//           ? "bg-green-900 text-green-300"
//           : "bg-green-100 text-green-800";
//       case "Processing":
//         return isDarkMode
//           ? "bg-blue-900 text-blue-300"
//           : "bg-blue-100 text-blue-800";
//       case "Shipped":
//         return isDarkMode
//           ? "bg-indigo-900 text-indigo-300"
//           : "bg-indigo-100 text-indigo-800";
//       case "Awaited":
//         return isDarkMode
//           ? "bg-yellow-900 text-yellow-300"
//           : "bg-yellow-100 text-yellow-800";
//       case "Cancelled":
//         return isDarkMode
//           ? "bg-red-900 text-red-300"
//           : "bg-red-100 text-red-800";
//       default:
//         return isDarkMode
//           ? "bg-gray-800 text-gray-300"
//           : "bg-gray-100 text-gray-800";
//     }
//   };

//   // Create stats array from API data
//   const stats = [
//     {
//       title: "Today's Orders",
//       value: dashboardData.todayOrdersCount,
//       change: "+0%",
//       icon: <DollarSign />,
//       trend: "neutral",
//       bgColor: isDarkMode ? "bg-indigo-900" : "bg-indigo-500",
//     },
//     {
//       title: "Total Orders",
//       value: dashboardData.totalOrdersCount,
//       change: "+8.3%",
//       icon: <ShoppingCart />,
//       trend: "up",
//       bgColor: isDarkMode ? "bg-blue-900" : "bg-blue-500",
//     },
//     {
//       title: "Active Customers",
//       value: dashboardData.activeCustomersCount,
//       change: "+5.7%",
//       icon: <Users />,
//       trend: "up",
//       bgColor: isDarkMode ? "bg-purple-900" : "bg-purple-500",
//     },
//     {
//       title: "Total Customers",
//       value: dashboardData.totalCustomersCount,
//       change: "+4.2%",
//       icon: <UserCheck />,
//       trend: "up",
//       bgColor: isDarkMode ? "bg-green-900" : "bg-green-500",
//     },
//     {
//       title: "Total Products",
//       value: dashboardData.totalProductsCount,
//       change: "+6.1%",
//       icon: <Box />,
//       trend: "up",
//       bgColor: isDarkMode ? "bg-orange-900" : "bg-orange-500",
//     },
//     {
//       title: "Total Categories",
//       value: dashboardData.totalCategoriesCount,
//       change: "+3.9%",
//       icon: <Layers />,
//       trend: "up",
//       bgColor: isDarkMode ? "bg-yellow-900" : "bg-yellow-500",
//     },
//     {
//       title: "Total Brands",
//       value: dashboardData.totalBrandsCount,
//       change: "+2.5%",
//       icon: <Tag />,
//       trend: "up",
//       bgColor: isDarkMode ? "bg-teal-900" : "bg-teal-500",
//     },
//     {
//       title: "Pending Orders",
//       value: dashboardData.pendingOrdersCount,
//       change: "0%",
//       icon: <Package />,
//       trend: "neutral",
//       bgColor: isDarkMode ? "bg-pink-900" : "bg-pink-500",
//     },
//   ];
//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div
//       className={`flex flex-col h-screen ${
//         isDarkMode ? "darktheme text-gray-200" : "bg-gray-50 text-gray-800"
//       }`}
//     >
//       {/* Header */}
//       <header
//         className={`${
//           isDarkMode ? "bg-gray-800 shadow-md" : "bg-white shadow"
//         } sticky top-0 z-10`}
//       >
//         <div className="flex items-center justify-between px-4 py-4 md:px-6">
//           <div className="flex items-center">
//             <h1
//               className={`text-lg md:text-xl font-semibold ${
//                 isDarkMode ? "text-gray-200" : "text-gray-800"
//               }`}
//             >
//               Dashboard
//             </h1>
//           </div>

//           <div className="flex items-center space-x-2 md:space-x-4">
//             <div className="relative hidden sm:block">
//               {/* <input
//                 type="text"
//                 placeholder="Search..."
//                 className={`pl-10 pr-4 py-2 text-sm border ${
//                   isDarkMode
//                     ? "bg-gray-700 border-gray-600 text-gray-200"
//                     : "bg-white border-gray-300 text-gray-800"
//                 } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-32 md:w-auto`}
//               />
//               <Search
//                 className={`h-4 w-4 ${
//                   isDarkMode ? "text-gray-400" : "text-gray-400"
//                 } absolute left-3 top-2.5`}
//               /> */}
//             </div>

//             <NotificationSidebar adminId={adminId} />

//             <button
//               onClick={toggleTheme}
//               className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//             >
//               {isDarkMode ? (
//                 <Sun className="h-5 w-5 md:h-6 md:w-6 text-yellow-300" />
//               ) : (
//                 <Moon className="h-5 w-5 md:h-6 md:w-6 text-gray-500" />
//               )}
//             </button>
//             <div className="flex items-center space-x-1 md:space-x-2 cursor-pointer group relative">
//               <div
//                 className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium shadow"
//                 onClick={() => navigate("/profile")}
//               >
//                 {user?.username?.charAt(0).toUpperCase()}
//               </div>

//               <span
//                 className={`hidden md:inline-block text-sm font-medium ${
//                   isDarkMode ? "text-gray-300" : "text-gray-700"
//                 }`}
//                 onClick={() => navigate("/profile")}

//               >
//                 Admin
//               </span>
//               {/* <ChevronDown
//                 className={`h-4 w-4 ${
//                   isDarkMode ? "text-gray-400" : "text-gray-500"
//                 }`}
//               /> */}
//               {/* Notification Sidebar */}
//               {isOpen && (
//                 <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 shadow-lg z-50 overflow-y-auto">
//                   {/* Header */}
//                   <div className="flex justify-between items-center p-4 border-b">
//                     <h2 className="text-lg font-medium">Notifications</h2>
//                     <div className="flex space-x-2">
//                       <button>
//                         <MoreHorizontal className="h-5 w-5 text-gray-500" />
//                       </button>
//                       <button onClick={toggleSidebar}>
//                         <X className="h-5 w-5 text-gray-500" />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Navigation tabs */}
//                   <div className="flex border-b">
//                     <button className="flex-1 py-2 px-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
//                       All
//                     </button>
//                     <button className="flex-1 py-2 px-4 text-sm font-medium text-gray-500">
//                       Unread
//                     </button>
//                   </div>

//                   {/* Notification Categories */}
//                   <div className="p-4 border-b">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center">
//                         <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
//                         <span className="text-sm font-medium">
//                           Announcements
//                         </span>
//                       </div>
//                       <span className="text-xs text-gray-500">19 Aug, 21</span>
//                     </div>

//                     <div className="ml-6 mb-4">
//                       <p className="text-sm mb-1">
//                         Isaac Morgan posted an announcement
//                       </p>
//                       <p className="text-sm font-medium mb-1">
//                         Review lecture on the 22nd February
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         on your course{" "}
//                         <span className="font-medium">
//                           User Experience Design Essentials
//                         </span>
//                       </p>
//                     </div>

//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center">
//                         <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
//                         <span className="text-sm font-medium">Quiz</span>
//                       </div>
//                       <span className="text-xs text-gray-500">19 Aug, 21</span>
//                     </div>

//                     <div className="ml-6 mb-4">
//                       <p className="text-sm mb-1">
//                         Isaac Morgan posted results for Quiz 1
//                       </p>
//                       <p className="text-sm font-medium mb-1">
//                         Basics of usability
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         on your course{" "}
//                         <span className="font-medium">
//                           User Experience Design Essentials
//                         </span>
//                       </p>
//                     </div>

//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center">
//                         <span className="w-4 h-4 bg-purple-500 rounded-full mr-2"></span>
//                         <span className="text-sm font-medium">Q&A</span>
//                       </div>
//                       <span className="text-xs text-gray-500">
//                         18 hours ago
//                       </span>
//                     </div>

//                     <div className="ml-6 mb-4">
//                       <p className="text-sm mb-1">
//                         David Hart posted a question
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         on your course{" "}
//                         <span className="font-medium">
//                           Advanced PHP: How to become a PHP Expert in a month
//                         </span>
//                       </p>
//                     </div>

//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center">
//                         <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
//                         <span className="text-sm font-medium">Comment</span>
//                       </div>
//                       <span className="text-xs text-gray-500">
//                         23 hours ago
//                       </span>
//                     </div>

//                     <div className="ml-6">
//                       <p className="text-sm mb-1">Melanie Quinn commented</p>
//                       <p className="text-xs text-gray-500">
//                         on your course{" "}
//                         <span className="font-medium">
//                           User Experience Design Essentials
//                         </span>
//                       </p>
//                     </div>
//                   </div>

//                   {/* More categories */}
//                   <div className="p-4">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center">
//                         <span className="w-6 h-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center text-xs">
//                           G
//                         </span>
//                         <span className="text-sm font-medium">General</span>
//                       </div>
//                       <span className="text-xs text-gray-500">19 Aug, 21</span>
//                     </div>

//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center">
//                         <span className="w-6 h-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center text-xs">
//                           E
//                         </span>
//                         <span className="text-sm font-medium">Enrollments</span>
//                       </div>
//                       <span className="text-xs text-gray-500">12 Aug, 21</span>
//                     </div>

//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center">
//                         <span className="w-6 h-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center text-xs">
//                           I
//                         </span>
//                         <span className="text-sm font-medium">
//                           Instructorship
//                         </span>
//                       </div>
//                       <span className="text-xs text-gray-500">07 Aug, 21</span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Overlay when sidebar is open */}
//               {isOpen && (
//                 <div
//                   className="fixed inset-0 bg-black bg-opacity-20 z-40"
//                   onClick={toggleSidebar}
//                 ></div>
//               )}

//               {/* Dropdown menu */}
//               {/* <div className="absolute hidden group-hover:flex flex-col right-0 top-full mt-2 min-w-max rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 pointer-events-auto">
//                 <a
//                   href="#"
//                   className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
//                 >
//                   <Link
//                     to="/profile"
//                     className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
//                   >
//                     <CgProfile className="mr-2 h-4 w-4" /> Profile
//                   </Link>
//                 </a>
//                 <a
//                   href="#"
//                   className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
//                 >
//                   <Link
//                     to="/profile"
//                     className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
//                   >
//                     <LogOut className="mr-2 h-4 w-4" /> Logout
//                   </Link>
//                 </a>
//               </div> */}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Dashboard Content */}
//       <main className="flex-1 overflow-auto p-4 md:p-6">
//         {isLoading ? (
//           <div className="flex items-center justify-center h-64">
//             <div
//               className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${
//                 isDarkMode ? "border-gray-300" : "border-indigo-500"
//               }`}
//             ></div>
//           </div>
//         ) : error ? (
//           <div
//             className={`p-4 rounded-lg ${
//               isDarkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800"
//             } mb-6`}
//           >
//             {error}
//           </div>
//         ) : (
//           <>
//             {/* Stats Cards with Animation */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
//               {stats.map((stat, index) => (
//                 <div
//                   key={index}
//                   className={`${
//                     isDarkMode ? "bg-gray-800" : "bg-white"
//                   } rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
//                 >
//                   <div className="flex items-center p-4 md:p-6">
//                     <div
//                       className={`${stat.bgColor} rounded-lg p-2 md:p-3 mr-3 md:mr-4 text-white shadow-md flex-shrink-0`}
//                     >
//                       {stat.icon}
//                     </div>
//                     <div>
//                       <p
//                         className={`text-xs md:text-sm ${
//                           isDarkMode ? "text-gray-400" : "text-gray-500"
//                         }`}
//                       >
//                         {stat.title}
//                       </p>
//                       <h3
//                         className={`text-lg md:text-2xl font-bold mt-1 ${
//                           isDarkMode ? "text-gray-100" : "text-gray-800"
//                         }`}
//                       >
//                         {stat.title === "Today's Orders"
//                           ? stat.value
//                           : stat.value.toLocaleString()}
//                       </h3>
//                       <div className="flex items-center mt-1">
//                         {stat.trend === "up" ? (
//                           <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-1" />
//                         ) : stat.trend === "down" ? (
//                           <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-red-500 mr-1" />
//                         ) : (
//                           <span className="h-3 w-3 md:h-4 md:w-4 inline-block mr-1" />
//                         )}
//                         <span
//                           className={
//                             stat.trend === "up"
//                               ? "text-green-500 text-xs md:text-sm"
//                               : stat.trend === "down"
//                               ? "text-red-500 text-xs md:text-sm"
//                               : `text-xs md:text-sm ${
//                                   isDarkMode ? "text-gray-400" : "text-gray-500"
//                                 }`
//                           }
//                         >
//                           {stat.change}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Tables */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Recent Orders Table */}
//               <div
//                 className={`${
//                   isDarkMode ? "bg-gray-800" : "bg-white"
//                 } rounded-lg shadow-lg overflow-hidden`}
//               >
//                 <div
//                   className={`flex flex-wrap items-center justify-between p-4 md:p-6 border-b ${
//                     isDarkMode ? "border-gray-700" : "border-gray-100"
//                   }`}
//                 >
//                   <h2
//                     className={`text-base md:text-lg font-semibold ${
//                       isDarkMode ? "text-gray-200" : "text-gray-800"
//                     } mb-2 sm:mb-0`}
//                   >
//                     Recent Orders
//                   </h2>
//                   <div className="flex items-center space-x-2">
//                     <button
//                       onClick={() => setShowOrderFilters(!showOrderFilters)}
//                       className={`flex items-center space-x-1 text-xs md:text-sm ${
//                         isDarkMode
//                           ? "bg-gray-700 hover:bg-gray-600"
//                           : "bg-gray-100 hover:bg-gray-200"
//                       } rounded-lg px-2 py-1 md:px-3 md:py-1.5 transition-colors`}
//                     >
//                       <SlidersHorizontal className="h-3 w-3 md:h-4 md:w-4" />
//                       <span>Filters</span>
//                     </button>
//                     <a
//                       href="#"
//                       className="text-indigo-500 hover:text-indigo-600 text-xs md:text-sm font-medium transition-colors"
//                       onClick={() => navigate("/admin/orderlist")}
//                     >
//                       View All
//                     </a>
//                   </div>
//                 </div>

//                 {/* Orders Filters Section */}
//                 {showOrderFilters && (
//                   <div
//                     className={`p-3 md:p-4 ${
//                       isDarkMode ? "bg-gray-700" : "bg-gray-50"
//                     } border-b ${
//                       isDarkMode ? "border-gray-600" : "border-gray-200"
//                     }`}
//                   >
//                     <div className="flex flex-wrap gap-2 md:gap-4">
//                       <div className="flex flex-col space-y-1">
//                         <label
//                           className={`text-xs font-medium ${
//                             isDarkMode ? "text-gray-300" : "text-gray-600"
//                           }`}
//                         >
//                           Status
//                         </label>
//                         <select
//                           className={`rounded-md border ${
//                             isDarkMode
//                               ? "bg-gray-800 border-gray-600 text-gray-200"
//                               : "bg-white border-gray-300 text-gray-700"
//                           } px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
//                         >
//                           <option>All Statuses</option>
//                           <option>Delivered</option>
//                           <option>Processing</option>
//                           <option>Shipped</option>
//                           <option>Awaited</option>
//                           <option>Cancelled</option>
//                         </select>
//                       </div>
//                       <div className="flex flex-col space-y-1">
//                         <label
//                           className={`text-xs font-medium ${
//                             isDarkMode ? "text-gray-300" : "text-gray-600"
//                           }`}
//                         >
//                           Date Range
//                         </label>
//                         <select
//                           className={`rounded-md border ${
//                             isDarkMode
//                               ? "bg-gray-800 border-gray-600 text-gray-200"
//                               : "bg-white border-gray-300 text-gray-700"
//                           } px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
//                         >
//                           <option>Last 7 days</option>
//                           <option>Last 30 days</option>
//                           <option>Last 90 days</option>
//                           <option>Custom range</option>
//                         </select>
//                       </div>
//                       <div className="flex flex-col space-y-1">
//                         <label
//                           className={`text-xs font-medium ${
//                             isDarkMode ? "text-gray-300" : "text-gray-600"
//                           }`}
//                         >
//                           Amount
//                         </label>
//                         <select
//                           className={`rounded-md border ${
//                             isDarkMode
//                               ? "bg-gray-800 border-gray-600 text-gray-200"
//                               : "bg-white border-gray-300 text-gray-700"
//                           } px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
//                         >
//                           <option>Any amount</option>
//                           <option>Under ₹1,000</option>
//                           <option>₹1,000 - ₹5,000</option>
//                           <option>₹5,000 - ₹10,000</option>
//                           <option>Over ₹10,000</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead
//                       className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}
//                     >
//                       <tr>
//                         <th
//                           className={`px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium ${
//                             isDarkMode ? "text-gray-300" : "text-gray-500"
//                           } uppercase tracking-wider`}
//                         >
//                           Order ID
//                         </th>
//                         <th
//                           className={`px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium ${
//                             isDarkMode ? "text-gray-300" : "text-gray-500"
//                           } uppercase tracking-wider`}
//                         >
//                           Customer
//                         </th>
//                         <th
//                           className={`px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium ${
//                             isDarkMode ? "text-gray-300" : "text-gray-500"
//                           } uppercase tracking-wider`}
//                         >
//                           Date
//                         </th>
//                         <th
//                           className={`px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium ${
//                             isDarkMode ? "text-gray-300" : "text-gray-500"
//                           } uppercase tracking-wider`}
//                         >
//                           Amount
//                         </th>
//                         <th
//                           className={`px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium ${
//                             isDarkMode ? "text-gray-300" : "text-gray-500"
//                           } uppercase tracking-wider`}
//                         >
//                           Status
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody
//                       className={`divide-y ${
//                         isDarkMode ? "divide-gray-700" : "divide-gray-200"
//                       }`}
//                     >
//                       {dashboardData.recentOrders.slice(0, 5).map((order) => (
//                         <tr
//                           key={order._id}
//                           className={`hover:${
//                             isDarkMode ? "bg-gray-700" : "bg-gray-50"
//                           } transition-colors`}
//                         >
//                           <td
//                             className={`px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-indigo-500 hover:text-indigo-600 transition-colors`}
//                           >
//                             <a href="#">{order.orderId}</a>
//                           </td>
//                           <td
//                             className={`px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm ${
//                               isDarkMode ? "text-gray-300" : "text-gray-800"
//                             }`}
//                           >
//                             {order.user.email.split("@")[0]}
//                           </td>
//                           <td
//                             className={`px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm ${
//                               isDarkMode ? "text-gray-400" : "text-gray-500"
//                             }`}
//                           >
//                             {formatDate(order.createdAt)}
//                           </td>
//                           <td
//                             className={`px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium ${
//                               isDarkMode ? "text-gray-300" : "text-gray-800"
//                             }`}
//                           >
//                             {formatCurrency(order.totalPrice)}
//                           </td>
//                           <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
//                             <span
//                               className={`px-2 md:px-3 py-0.5 md:py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
//                                 order.status
//                               )}`}
//                             >
//                               {order.status}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* Top Products Table with Brand/Category Filters */}
//               <div
//                 className={`${
//                   isDarkMode ? "bg-gray-800" : "bg-white"
//                 } rounded-lg shadow-lg overflow-hidden`}
//               >
//                 <div
//                   className={`flex flex-wrap items-center justify-between p-4 md:p-6 border-b ${
//                     isDarkMode ? "border-gray-700" : "border-gray-100"
//                   }`}
//                 >
//                   <h2
//                     className={`text-base md:text-lg font-semibold ${
//                       isDarkMode ? "text-gray-200" : "text-gray-800"
//                     } mb-2 sm:mb-0`}
//                   >
//                     Top Products
//                   </h2>
//                   <div className="flex items-center space-x-2">
//                     <button
//                       onClick={() => setShowProductFilters(!showProductFilters)}
//                       className={`flex items-center space-x-1 text-xs md:text-sm ${
//                         isDarkMode
//                           ? "bg-gray-700 hover:bg-gray-600"
//                           : "bg-gray-100 hover:bg-gray-200"
//                       } rounded-lg px-2 py-1 md:px-3 md:py-1.5 transition-colors`}
//                     >
//                       <SlidersHorizontal className="h-3 w-3 md:h-4 md:w-4" />
//                       <span>Filters</span>
//                     </button>
//                     <a
//                       href="#"
//                       className="text-indigo-500 hover:text-indigo-600 text-xs md:text-sm font-medium transition-colors"
//                       onClick={() => navigate("/admin/admin-inventory")}
//                     >
//                       View All
//                     </a>
//                   </div>
//                 </div>

//                 {/* Products Filters */}
//                 {showProductFilters && (
//                   <div
//                     className={`p-3 md:p-4 ${
//                       isDarkMode ? "bg-gray-700" : "bg-gray-50"
//                     } border-b ${
//                       isDarkMode ? "border-gray-600" : "border-gray-200"
//                     }`}
//                   >
//                     <div className="flex flex-wrap gap-2 md:gap-4">
//                       {/* Brand Filter */}
//                       <div className="flex flex-col space-y-1">
//                         <label
//                           className={`text-xs font-medium ${
//                             isDarkMode ? "text-gray-300" : "text-gray-600"
//                           }`}
//                         >
//                           Brand
//                         </label>
//                         <select
//                           value={brandFilter}
//                           onChange={(e) => setBrandFilter(e.target.value)}
//                           className={`rounded-md border ${
//                             isDarkMode
//                               ? "bg-gray-800 border-gray-600 text-gray-200"
//                               : "bg-white border-gray-300 text-gray-700"
//                           } px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
//                         >
//                           {extractBrandOptions().map((brand) => (
//                             <option key={brand} value={brand}>
//                               {brand}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       {/* Category Filter */}
//                       <div className="flex flex-col space-y-1">
//                         <label
//                           className={`text-xs font-medium ${
//                             isDarkMode ? "text-gray-300" : "text-gray-600"
//                           }`}
//                         >
//                           Category
//                         </label>
//                         <select
//                           value={categoryFilter}
//                           onChange={(e) => setCategoryFilter(e.target.value)}
//                           className={`rounded-md border ${
//                             isDarkMode
//                               ? "bg-gray-800 border-gray-600 text-gray-200"
//                               : "bg-white border-gray-300 text-gray-700"
//                           } px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
//                         >
//                           {extractCategoryOptions().map((category) => (
//                             <option key={category} value={category}>
//                               {category}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       {/* Time Period Filter */}
//                       <div className="flex flex-col space-y-1">
//                         <label
//                           className={`text-xs font-medium ${
//                             isDarkMode ? "text-gray-300" : "text-gray-600"
//                           }`}
//                         >
//                           Time Period
//                         </label>
//                         <select
//                           className={`rounded-md border ${
//                             isDarkMode
//                               ? "bg-gray-800 border-gray-600 text-gray-200"
//                               : "bg-white border-gray-300 text-gray-700"
//                           } px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
//                         >
//                           <option>This Month</option>
//                           <option>Last Month</option>
//                           <option>Last 3 Months</option>
//                           <option>Last 6 Months</option>
//                           <option>All Time</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead
//                       className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}
//                     >
//                       <tr>
//                         <th
//                           className={`px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium ${
//                             isDarkMode ? "text-gray-300" : "text-gray-500"
//                           } uppercase tracking-wider`}
//                         >
//                           Product
//                         </th>
//                         <th
//                           className={`px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium ${
//                             isDarkMode ? "text-gray-300" : "text-gray-500"
//                           } uppercase tracking-wider`}
//                         >
//                           Brand
//                         </th>
//                         <th
//                           className={`px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium ${
//                             isDarkMode ? "text-gray-300" : "text-gray-500"
//                           } uppercase tracking-wider`}
//                         >
//                           Category
//                         </th>
//                         <th
//                           className={`px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium ${
//                             isDarkMode ? "text-gray-300" : "text-gray-500"
//                           } uppercase tracking-wider`}
//                         >
//                           Units Sold
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody
//                       className={`divide-y ${
//                         isDarkMode ? "divide-gray-700" : "divide-gray-200"
//                       }`}
//                     >
//                       {dashboardData.topProducts
//                         .filter((product) => {
//                           // Apply brand filter
//                           const brandMatch =
//                             brandFilter === "All" ||
//                             (product.brand &&
//                               product.brand.name === brandFilter);

//                           // Apply category filter
//                           const categoryMatch =
//                             categoryFilter === "All" ||
//                             (product.category &&
//                               product.category.name === categoryFilter);

//                           return brandMatch && categoryMatch;
//                         })
//                         .map((product) => (
//                           <tr
//                             key={product._id}
//                             className={`hover:${
//                               isDarkMode ? "bg-gray-700" : "bg-gray-50"
//                             } transition-colors`}
//                           >
//                             <td
//                               className={`px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium ${
//                                 isDarkMode ? "text-gray-300" : "text-gray-800"
//                               }`}
//                             >
//                               <a
//                                 href="#"
//                                 className="hover:text-indigo-500 transition-colors"
//                               >
//                                 {product.name}
//                               </a>
//                             </td>
//                             <td
//                               className={`px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm ${
//                                 isDarkMode ? "text-gray-400" : "text-gray-500"
//                               }`}
//                             >
//                               {product.brand && product.brand.name
//                                 ? product.brand.name
//                                 : "-"}
//                             </td>
//                             <td
//                               className={`px-6 py-4 whitespace-nowrap text-sm ${
//                                 isDarkMode ? "text-gray-400" : "text-gray-500"
//                               }`}
//                             >
//                               {product.category && product.category.name
//                                 ? product.category.name
//                                 : "-"}
//                             </td>
//                             <td
//                               className={`px-6 py-4 whitespace-nowrap text-sm ${
//                                 isDarkMode ? "text-gray-300" : "text-gray-800"
//                               } font-medium`}
//                             >
//                               {product.totalSold}
//                             </td>
//                           </tr>
//                         ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </main>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import {
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Sun,
  Moon,
  SlidersHorizontal,
  Tag,
  Layers,
  UserCheck,
  Box,
  MoreHorizontal,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";
import { BASE_URL } from "../../redux/constants";
import NotificationSidebar from "./NotificationSidebar";
import Loader from "../../components/Loader";

export default function AdminDashboard() {
  // const [activeTab, setActiveTab] = useState("dashboard");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const adminId = userInfo?._id;

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    todayOrdersCount: 0,
    totalOrdersCount: 0,
    activeCustomersCount: 0,
    pendingOrdersCount: 0,
    recentOrders: [],
    topProducts: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Separate filter states for each section
  const [showOrderFilters, setShowOrderFilters] = useState(false);
  const [showProductFilters, setShowProductFilters] = useState(false);

  // Filter states for products
  const [brandFilter, setBrandFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo")) || {};
  console.log(user);

  // Extract unique brands and categories from the API response
  const extractBrandOptions = () => {
    const brands = dashboardData.topProducts
      .filter((product) => product.brand && product.brand.name)
      .map((product) => product.brand.name);

    // Remove duplicates
    const uniqueBrands = ["All", ...new Set(brands)];
    return uniqueBrands;
  };

  const extractCategoryOptions = () => {
    const categories = dashboardData.topProducts
      .filter((product) => product.category && product.category.name)
      .map((product) => product.category.name);

    // Remove duplicates
    const uniqueCategories = ["All", ...new Set(categories)];
    return uniqueCategories;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${BASE_URL}/api/dashboard/admin-dashboard`
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError(`Failed to fetch dashboard data: ${err.message}`);
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Toggle dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Format date to more readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format price to currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get status class based on order status
  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return isDarkMode
          ? "bg-green-900 text-green-300"
          : "bg-green-100 text-green-800";
      case "Processing":
        return isDarkMode
          ? "bg-blue-900 text-blue-300"
          : "bg-blue-100 text-blue-800";
      case "Shipped":
        return isDarkMode
          ? "bg-indigo-900 text-indigo-300"
          : "bg-indigo-100 text-indigo-800";
      case "Awaited":
        return isDarkMode
          ? "bg-yellow-900 text-yellow-300"
          : "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return isDarkMode
          ? "bg-red-900 text-red-300"
          : "bg-red-100 text-red-800";
      default:
        return isDarkMode
          ? "bg-gray-800 text-gray-300"
          : "bg-gray-100 text-gray-800";
    }
  };

  // Create stats array from API data
  const stats = [
    {
      title: "Today's Orders",
      value: dashboardData.todayOrdersCount,
      change: "+0%",
      icon: <DollarSign />,
      trend: "neutral",
      bgColor: isDarkMode ? "bg-indigo-900" : "bg-indigo-500",
    },
    {
      title: "Total Orders",
      value: dashboardData.totalOrdersCount,
      change: "+8.3%",
      icon: <ShoppingCart />,
      trend: "up",
      bgColor: isDarkMode ? "bg-blue-900" : "bg-blue-500",
    },
    {
      title: "Active Customers",
      value: dashboardData.activeCustomersCount,
      change: "+5.7%",
      icon: <Users />,
      trend: "up",
      bgColor: isDarkMode ? "bg-purple-900" : "bg-purple-500",
    },
    {
      title: "Total Customers",
      value: dashboardData.totalCustomersCount,
      change: "+4.2%",
      icon: <UserCheck />,
      trend: "up",
      bgColor: isDarkMode ? "bg-green-900" : "bg-green-500",
    },
    {
      title: "Total Products",
      value: dashboardData.totalProductsCount,
      change: "+6.1%",
      icon: <Box />,
      trend: "up",
      bgColor: isDarkMode ? "bg-orange-900" : "bg-orange-500",
    },
    {
      title: "Total Categories",
      value: dashboardData.totalCategoriesCount,
      change: "+3.9%",
      icon: <Layers />,
      trend: "up",
      bgColor: isDarkMode ? "bg-yellow-900" : "bg-yellow-500",
    },
    {
      title: "Total Brands",
      value: dashboardData.totalBrandsCount,
      change: "+2.5%",
      icon: <Tag />,
      trend: "up",
      bgColor: isDarkMode ? "bg-teal-900" : "bg-teal-500",
    },
    {
      title: "Pending Orders",
      value: dashboardData.pendingOrdersCount,
      change: "0%",
      icon: <Package />,
      trend: "neutral",
      bgColor: isDarkMode ? "bg-pink-900" : "bg-pink-500",
    },
  ];
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        isDarkMode ? "darktheme text-gray-200" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Header */}
      {/* <header
        className={`${
          isDarkMode ? "bg-gray-800 shadow-md" : "bg-white shadow"
        } sticky top-0 z-10`}
      >
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center">
            <h1
              className={`text-lg md:text-xl font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative hidden sm:block">
            
            </div>

            <NotificationSidebar adminId={adminId} />

            <button
              onClick={toggleTheme}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 md:h-6 md:w-6 text-yellow-300" />
              ) : (
                <Moon className="h-5 w-5 md:h-6 md:w-6 text-gray-500" />
              )}
            </button>
            <div className="flex items-center space-x-1 md:space-x-2 cursor-pointer group relative">
              <div
                className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium shadow"
                onClick={() => navigate("/profile")}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </div>

              <span
                className={`hidden md:inline-block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
                onClick={() => navigate("/profile")}

              >
                Admin
              </span>
           
              {isOpen && (
                <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 shadow-lg z-50 overflow-y-auto">
              
                  <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-medium">Notifications</h2>
                    <div className="flex space-x-2">
                      <button>
                        <MoreHorizontal className="h-5 w-5 text-gray-500" />
                      </button>
                      <button onClick={toggleSidebar}>
                        <X className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </div>

                
                  <div className="flex border-b">
                    <button className="flex-1 py-2 px-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                      All
                    </button>
                    <button className="flex-1 py-2 px-4 text-sm font-medium text-gray-500">
                      Unread
                    </button>
                  </div>

            
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                        <span className="text-sm font-medium">
                          Announcements
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">19 Aug, 21</span>
                    </div>

                    <div className="ml-6 mb-4">
                      <p className="text-sm mb-1">
                        Isaac Morgan posted an announcement
                      </p>
                      <p className="text-sm font-medium mb-1">
                        Review lecture on the 22nd February
                      </p>
                      <p className="text-xs text-gray-500">
                        on your course{" "}
                        <span className="font-medium">
                          User Experience Design Essentials
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm font-medium">Quiz</span>
                      </div>
                      <span className="text-xs text-gray-500">19 Aug, 21</span>
                    </div>

                    <div className="ml-6 mb-4">
                      <p className="text-sm mb-1">
                        Isaac Morgan posted results for Quiz 1
                      </p>
                      <p className="text-sm font-medium mb-1">
                        Basics of usability
                      </p>
                      <p className="text-xs text-gray-500">
                        on your course{" "}
                        <span className="font-medium">
                          User Experience Design Essentials
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-purple-500 rounded-full mr-2"></span>
                        <span className="text-sm font-medium">Q&A</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        18 hours ago
                      </span>
                    </div>

                    <div className="ml-6 mb-4">
                      <p className="text-sm mb-1">
                        David Hart posted a question
                      </p>
                      <p className="text-xs text-gray-500">
                        on your course{" "}
                        <span className="font-medium">
                          Advanced PHP: How to become a PHP Expert in a month
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
                        <span className="text-sm font-medium">Comment</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        23 hours ago
                      </span>
                    </div>

                    <div className="ml-6">
                      <p className="text-sm mb-1">Melanie Quinn commented</p>
                      <p className="text-xs text-gray-500">
                        on your course{" "}
                        <span className="font-medium">
                          User Experience Design Essentials
                        </span>
                      </p>
                    </div>
                  </div>

             
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center text-xs">
                          G
                        </span>
                        <span className="text-sm font-medium">General</span>
                      </div>
                      <span className="text-xs text-gray-500">19 Aug, 21</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center text-xs">
                          E
                        </span>
                        <span className="text-sm font-medium">Enrollments</span>
                      </div>
                      <span className="text-xs text-gray-500">12 Aug, 21</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center text-xs">
                          I
                        </span>
                        <span className="text-sm font-medium">
                          Instructorship
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">07 Aug, 21</span>
                    </div>
                  </div>
                </div>
              )}

            
              {isOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-20 z-40"
                  onClick={toggleSidebar}
                ></div>
              )}
            </div>
          </div>
        </div>
      </header> */}

      {/* Dashboard Content */}
      <main className="flex-1 overflow-auto p-4 md:p-6">
        {isLoading ? (
          // <div className="flex items-center justify-center h-64">
          //   <div
          //     className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${
          //       isDarkMode ? "border-gray-300" : "border-indigo-500"
          //     }`}
          //   ></div>
          // </div>
          <Loader/>
        ) : error ? (
          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800"
            } mb-6`}
          >
            {error}
          </div>
        ) : (
          <>
            {/* Stats Cards with Animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
                >
                  <div className="flex items-center p-4 md:p-6">
                    <div
                      className={`${stat.bgColor} rounded-lg p-2 md:p-3 mr-3 md:mr-4 text-white shadow-md flex-shrink-0`}
                    >
                      {stat.icon}
                    </div>
                    <div>
                      <p
                        className={`text-xs md:text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {stat.title}
                      </p>
                      <h3
                        className={`text-lg md:text-2xl font-bold mt-1 ${
                          isDarkMode ? "text-gray-100" : "text-gray-800"
                        }`}
                      >
                        {stat.title === "Today's Orders"
                          ? stat.value
                          : stat.value.toLocaleString()}
                      </h3>
                      <div className="flex items-center mt-1">
                        {stat.trend === "up" ? (
                          <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-1" />
                        ) : stat.trend === "down" ? (
                          <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-red-500 mr-1" />
                        ) : (
                          <span className="h-3 w-3 md:h-4 md:w-4 inline-block mr-1" />
                        )}
                        <span
                          className={
                            stat.trend === "up"
                              ? "text-green-500 text-xs md:text-sm"
                              : stat.trend === "down"
                              ? "text-red-500 text-xs md:text-sm"
                              : `text-xs md:text-sm ${
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`
                          }
                        >
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders Table */}
              <div
                className={`${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } rounded-lg shadow-lg overflow-hidden`}
              >
                <div
                  className={`flex flex-wrap items-center justify-between p-4 md:p-6 border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-100"
                  }`}
                >
                  <h2
                    className={`text-base md:text-lg font-semibold ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    } mb-2 sm:mb-0`}
                  >
                    Recent Orders
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowOrderFilters(!showOrderFilters)}
                      className={`flex items-center space-x-1 text-xs md:text-sm ${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-100 hover:bg-gray-200"
                      } rounded-lg px-2 py-1 md:px-3 md:py-1.5 transition-colors`}
                    >
                      <SlidersHorizontal className="h-3 w-3 md:h-4 md:w-4" />
                      <span>Filters</span>
                    </button>
                    <a
                      href="#"
                      className="text-indigo-500 hover:text-indigo-600 text-xs md:text-sm font-medium transition-colors"
                      onClick={() => navigate("/admin/orderlist")}
                    >
                      View All
                    </a>
                  </div>
                </div>

                {/* Orders Filters Section */}
                {showOrderFilters && (
                  <div
                    className={`p-3 md:p-4 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-50"
                    } border-b ${
                      isDarkMode ? "border-gray-600" : "border-gray-200"
                    }`}
                  >
                    <div className="flex flex-wrap gap-2 md:gap-4">
                      <div className="flex flex-col space-y-1">
                        <label
                          className={`text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Status
                        </label>
                        <select
                          className={`rounded-md border ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-600 text-gray-200"
                              : "bg-white border-gray-300 text-gray-700"
                          } px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        >
                          <option>All Statuses</option>
                          <option>Delivered</option>
                          <option>Processing</option>
                          <option>Shipped</option>
                          <option>Awaited</option>
                          <option>Cancelled</option>
                        </select>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label
                          className={`text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Date Range
                        </label>
                        <select
                          className={`rounded-md border ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-600 text-gray-200"
                              : "bg-white border-gray-300 text-gray-700"
                          } px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        >
                          <option>Last 7 days</option>
                          <option>Last 30 days</option>
                          <option>Last 90 days</option>
                          <option>Custom range</option>
                        </select>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label
                          className={`text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Amount
                        </label>
                        <select
                          className={`rounded-md border ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-600 text-gray-200"
                              : "bg-white border-gray-300 text-gray-700"
                          } px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        >
                          <option>Any amount</option>
                          <option>Under ₹1,000</option>
                          <option>₹1,000 - ₹5,000</option>
                          <option>₹5,000 - ₹10,000</option>
                          <option>Over ₹10,000</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead
                      className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}
                    >
                      <tr>
                        <th
                          className={`px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } uppercase tracking-wider`}
                        >
                          Order ID
                        </th>
                        <th
                          className={`px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } uppercase tracking-wider`}
                        >
                          Customer
                        </th>
                        <th
                          className={`px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } uppercase tracking-wider`}
                        >
                          Date
                        </th>
                        <th
                          className={`px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } uppercase tracking-wider`}
                        >
                          Amount
                        </th>
                        <th
                          className={`px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } uppercase tracking-wider`}
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        isDarkMode ? "divide-gray-700" : "divide-gray-200"
                      }`}
                    >
                      {dashboardData.recentOrders.slice(0, 5).map((order) => (
                        <tr
                          key={order._id}
                          className={`hover:${
                            isDarkMode ? "bg-gray-700" : "bg-gray-50"
                          } transition-colors`}
                        >
                          <td
                            className={`px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-indigo-500 hover:text-indigo-600 transition-colors`}
                          >
                            <a href="#">{order.orderId}</a>
                          </td>
                          <td
                            className={`px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm ${
                              isDarkMode ? "text-gray-300" : "text-gray-800"
                            }`}
                          >
                            {order.user.email.split("@")[0]}
                          </td>
                          <td
                            className={`px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {formatDate(order.createdAt)}
                          </td>
                          <td
                            className={`px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium ${
                              isDarkMode ? "text-gray-300" : "text-gray-800"
                            }`}
                          >
                            {formatCurrency(order.totalPrice)}
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                            <span
                              className={`px-2 md:px-3 py-0.5 md:py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Products Table with Brand/Category Filters */}
              <div
                className={`${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } rounded-lg shadow-lg overflow-hidden`}
              >
                <div
                  className={`flex flex-wrap items-center justify-between p-4 md:p-6 border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-100"
                  }`}
                >
                  <h2
                    className={`text-base md:text-lg font-semibold ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    } mb-2 sm:mb-0`}
                  >
                    Top Products
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowProductFilters(!showProductFilters)}
                      className={`flex items-center space-x-1 text-xs md:text-sm ${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-100 hover:bg-gray-200"
                      } rounded-lg px-2 py-1 md:px-3 md:py-1.5 transition-colors`}
                    >
                      <SlidersHorizontal className="h-3 w-3 md:h-4 md:w-4" />
                      <span>Filters</span>
                    </button>
                    <a
                      href="#"
                      className="text-indigo-500 hover:text-indigo-600 text-xs md:text-sm font-medium transition-colors"
                      onClick={() => navigate("/admin/admin-inventory")}
                    >
                      View All
                    </a>
                  </div>
                </div>

                {/* Products Filters */}
                {showProductFilters && (
                  <div
                    className={`p-3 md:p-4 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-50"
                    } border-b ${
                      isDarkMode ? "border-gray-600" : "border-gray-200"
                    }`}
                  >
                    <div className="flex flex-wrap gap-2 md:gap-4">
                      {/* Brand Filter */}
                      <div className="flex flex-col space-y-1">
                        <label
                          className={`text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Brand
                        </label>
                        <select
                          value={brandFilter}
                          onChange={(e) => setBrandFilter(e.target.value)}
                          className={`rounded-md border ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-600 text-gray-200"
                              : "bg-white border-gray-300 text-gray-700"
                          } px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        >
                          {extractBrandOptions().map((brand) => (
                            <option key={brand} value={brand}>
                              {brand}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Category Filter */}
                      <div className="flex flex-col space-y-1">
                        <label
                          className={`text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Category
                        </label>
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className={`rounded-md border ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-600 text-gray-200"
                              : "bg-white border-gray-300 text-gray-700"
                          } px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        >
                          {extractCategoryOptions().map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Time Period Filter */}
                      <div className="flex flex-col space-y-1">
                        <label
                          className={`text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Time Period
                        </label>
                        <select
                          className={`rounded-md border ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-600 text-gray-200"
                              : "bg-white border-gray-300 text-gray-700"
                          } px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        >
                          <option>This Month</option>
                          <option>Last Month</option>
                          <option>Last 3 Months</option>
                          <option>Last 6 Months</option>
                          <option>All Time</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead
                      className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}
                    >
                      <tr>
                        <th
                          className={`px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } uppercase tracking-wider`}
                        >
                          Product
                        </th>
                        <th
                          className={`px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } uppercase tracking-wider`}
                        >
                          Brand
                        </th>
                        <th
                          className={`px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } uppercase tracking-wider`}
                        >
                          Category
                        </th>
                        <th
                          className={`px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } uppercase tracking-wider`}
                        >
                          Units Sold
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        isDarkMode ? "divide-gray-700" : "divide-gray-200"
                      }`}
                    >
                      {dashboardData.topProducts
                        .filter((product) => {
                          // Apply brand filter
                          const brandMatch =
                            brandFilter === "All" ||
                            (product.brand &&
                              product.brand.name === brandFilter);

                          // Apply category filter
                          const categoryMatch =
                            categoryFilter === "All" ||
                            (product.category &&
                              product.category.name === categoryFilter);

                          return brandMatch && categoryMatch;
                        })
                        .map((product) => (
                          <tr
                            key={product._id}
                            className={`hover:${
                              isDarkMode ? "bg-gray-700" : "bg-gray-50"
                            } transition-colors`}
                          >
                            <td
                              className={`px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium ${
                                isDarkMode ? "text-gray-300" : "text-gray-800"
                              }`}
                            >
                              <a
                                href="#"
                                className="hover:text-indigo-500 transition-colors"
                              >
                                {product.name}
                              </a>
                            </td>
                            <td
                              className={`px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {product.brand && product.brand.name
                                ? product.brand.name
                                : "-"}
                            </td>
                            <td
                              className={`px-6 py-4 whitespace-nowrap text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {product.category && product.category.name
                                ? product.category.name
                                : "-"}
                            </td>
                            <td
                              className={`px-6 py-4 whitespace-nowrap text-sm ${
                                isDarkMode ? "text-gray-300" : "text-gray-800"
                              } font-medium`}
                            >
                              {product.totalSold}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
