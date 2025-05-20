// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import {
//   useGetOrdersQuery,
//   useUpdateOrderStatusMutation,
//   useGetInvoiceProformaMutation,
//   useGetOrderDetailsQuery,
// } from "../../redux/api/orderApiSlice";
// import AdminMenu from "./AdminMenu";
// import Loader from "../../components/Loader";
// import Message from "../../components/Message";
// import { Link } from "react-router-dom";
// import { BASE_URL } from "../../redux/constants";
// import {
//   FaChevronLeft,
//   FaChevronRight,
//   FaHistory,
//   FaFileInvoice,
// } from "react-icons/fa";
// import { io } from "socket.io-client";
// import moment from "moment";
// import PrintOrderModal from "../Admin/PrintOrderModal";

// const OrderList = () => {
//   const { userInfo } = useSelector((state) => state.auth);
//   const [showPrintModal, setShowPrintModal] = useState(false);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit] = useState(15);
//   const socket = io(`${BASE_URL}`);
//   const [statusHistoryModal, setStatusHistoryModal] = useState(null);
//   const [orderData, setOrderData] = useState(null);

//   // Fetch orders with pagination
//   const {
//     data: ordersData,
//     refetch,
//     isLoading,
//     error,
//   } = useGetOrdersQuery({
//     page: currentPage,
//     limit,
//   });

//   const [localOrders, setLocalOrders] = useState([]);
//   const [updateOrderStatus] = useUpdateOrderStatusMutation();
//   const [getInvoiceProforma] = useGetInvoiceProformaMutation();

//   useEffect(() => {
//     if (ordersData) {
//       setLocalOrders(ordersData.data);
//     }
//   }, [ordersData]);

//   useEffect(() => {
//     socket.on("orderUpdated", (updatedOrder) => {
//       console.log("Order Updated via Socket:", updatedOrder);
//       setLocalOrders((prevOrder) =>
//         prevOrder.map((order) =>
//           order._id === updatedOrder._id ? updatedOrder : order
//         )
//       );
//     });
//     return () => {
//       socket.off("orderUpdated");
//     };
//   }, []);

//   // Filter orders for 'Seller' role
//   const filteredOrders =
//     localOrders && userInfo.role === "Seller"
//       ? localOrders.filter((order) => {
//           return order.orderItems?.some(
//             (item) => item.product?.createdBy === userInfo._id
//           );
//         })
//       : localOrders;

//   // Handle status change
//   const handleStatusChange = async (id, newStatus) => {
//     try {
//       const updatedOrders = localOrders.map((order) =>
//         order._id === id ? { ...order, status: newStatus } : order
//       );
//       setLocalOrders(updatedOrders);

//       await updateOrderStatus({ orderId: id, status: newStatus }).unwrap();
//       console.log("Status updated successfully!");
//     } catch (error) {
//       console.error("Error updating status:", error);
//       alert(error?.message || "An error occurred while updating the status.");
//     }
//   };

//   const statusOrder = [
//     "Awaited",
//     "Processing",
//     "Confirm",
//     "Delivered",
//     "Cancelled",
//   ];

//   const allowedTransitions = {
//     Awaited: ["Processing", "Confirm", "Cancelled","Delivered"],
//     Processing: ["Confirm", "Delivered", "Cancelled"],
//     Confirm: ["Delivered", "Cancelled"],
//     Delivered: ["Processing", "Cancelled"], // ✅ allow going back to Processing
//     Cancelled: [], // no change after cancelled
//   };
  

//   const getStatusClassName = (status) => {
//     switch (status) {
//       case "Processing":
//         return "bg-blue-500 text-white";
//       case "Confirm":
//         return "bg-green-500 text-white";
//       case "Delivered":
//         return "bg-indigo-500 text-white";
//       case "Cancelled":
//         return "bg-red-500 text-white";
//       default:
//         return "bg-yellow-500 text-white";
//     }
//   };

//   // Function to handle opening the document
//   const handleViewDocument = (documentFileName) => {
//     if (documentFileName) {
//       const documentUrl = `${BASE_URL}/${documentFileName}`;
//       window.open(documentUrl, "_blank");
//     } else {
//       alert("Document is missing or invalid.");
//     }
//   };

//   // Function to handle viewing invoice proforma
//   // const handleViewInvoice = async (orderId) => {
//   //   try {
//   //     const result = await getInvoiceProforma(orderId).unwrap();
//   //     if (result.invoicePath) {
//   //       const invoiceUrl = `${BASE_URL}/${result.invoicePath}`;
//   //       window.open(invoiceUrl, "_blank");
//   //     } else {
//   //       alert("Invoice proforma is not available for this order.");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching invoice:", error);
//   //     alert("Failed to retrieve invoice proforma.");
//   //   }
//   // };

//   // Function to display status history
//   const openStatusHistoryModal = (order) => {
//     setStatusHistoryModal(order);
//   };

//   const handleNextPage = () => {
//     if (currentPage < ordersData.pagination.totalPages) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//     }
//   };

//   useEffect(() => {
//     refetch();
//   }, [currentPage, refetch]);

//   // Helper function to format dates
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return moment(dateString).format("MMM DD, YYYY h:mm A");
//   };
//   const handlePrintOrder = (order) => {
//     setShowPrintModal(true);
//     setOrderData(order);
//   };

//   console.log(orderData, "orderid ");

//   return (
//     <>
//       <div className="flex flex-col items-center darktheme px-6 pb-6">
//         <section className="w-full darktheme bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-600 ">
//           <h1 className="text-2xl font-semibold mb-6 text-center text-customBlue">
//             Order List
//           </h1>
//           {showPrintModal && orderData && (
//             <PrintOrderModal
//               order={orderData}
//               onClose={() => setShowPrintModal(false)}
//             />
//           )}

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
//                       <th className="px-4 py-2 text-left font-medium">ITEMS</th>
//                       <th className="px-4 py-2 text-left font-medium">ID</th>
//                       <th className="px-4 py-2 text-left font-medium">CUSTOMER</th>
//                       <th className="px-4 py-2 text-left font-medium">DATE</th>
//                       <th className="px-4 py-2 text-left font-medium">TOTAL</th>
//                       {userInfo.role !== "Seller" && (
//                         <>
//                           <th className="px-4 py-2 text-left font-medium">
//                             Document
//                           </th>
//                           <th className="px-4 py-2 text-left font-medium">
//                             Invoice
//                           </th>
//                           <th className="px-4 py-2 text-left font-medium">
//                             Status
//                           </th>
//                           <th className="px-4 py-2 text-left font-medium">
//                             History
//                           </th>
//                         </>
//                       )}
//                       <th className="px-4 py-2 text-left font-medium">PAID</th>
//                       <th className="px-4 py-2 text-left font-medium">
//                         DELIVERED
//                       </th>
//                       <th className="px-4 py-2 text-left font-medium"> </th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {filteredOrders.map((order) => (
//                       <tr
//                         key={order._id}
//                         className="tablecontent transition-colors text-sm"
//                       >
//                         <td className="px-4 py-2">
//                           <div className="w-16 h-16 flex items-center justify-center">
//                             {order.orderItems.length > 0 &&
//                             order.orderItems[0].image ? (
//                               <img
//                                 src={BASE_URL + order.orderItems[0].image}
//                                 alt={order._id}
//                                 className="w-full h-full object-cover rounded-md"
//                               />
//                             ) : (
//                               <p className="text-gray-400 text-xs">No Image</p>
//                             )}
//                           </div>
//                         </td>

//                         <td className="px-4 py-2">{order.orderId}</td>
//                         <td className="px-4 py-2">
//                           {order.user ? order.user.username : "N/A"}
//                         </td>
//                         <td className="px-4 py-2">
//                           {order.createdAt
//                             ? order.createdAt.substring(0, 10)
//                             : "N/A"}
//                         </td>
//                         <td className="px-4 py-2">
//                           &#8377; {order.totalPrice}
//                         </td>
//                         {userInfo.role !== "Seller" && (
//                           <>
//                             <td className="px-4 py-2">
//                               <button
//                                 className="text-blue-500 underline text-xs"
//                                 onClick={() =>
//                                   handleViewDocument(order.document)
//                                 }
//                               >
//                                 View Document
//                               </button>
//                             </td>
//                             <td className="px-4 py-2">
//                               <button
//                                 className="flex items-center space-x-1 text-green-500 underline text-xs"
//                                 onClick={() => {
//                                   handlePrintOrder(order);
//                                 }}
//                               >
//                                 <FaFileInvoice />
//                                 <span>View Invoice</span>
//                               </button>
//                             </td>
//                             <td className="px-4 py-2">
//                               <select
//                                 value={order.status}
//                                 onChange={(e) =>
//                                   handleStatusChange(order._id, e.target.value)
//                                 }
//                                 className={`px-4 py-2 rounded-full text-xs font-semibold capitalize inline-block ${getStatusClassName(
//                                   order.status
//                                 )}`}
//                               >
//                                 {statusOrder.map((status) => (
//                                   <option
//                                     key={status}
//                                     value={status}
//                                     disabled={
//                                       status !== order.status &&
//                                       !allowedTransitions[
//                                         order.status
//                                       ]?.includes(status)
//                                     }
//                                   >
//                                     {status}
//                                   </option>
//                                 ))}
//                               </select>
//                             </td>

//                             <td className="px-4 py-2">
//                               <button
//                                 onClick={() => openStatusHistoryModal(order)}
//                                 className="flex items-center space-x-1 text-indigo-500 hover:text-indigo-700"
//                               >
//                                 <FaHistory className="text-xs" />
//                                 <span className="text-xs">View</span>
//                               </button>
//                             </td>
//                           </>
//                         )}

//                         <td className="px-4 py-2">
//                           {order.statusHistory?.[order.statusHistory.length - 1]
//                             ?.status === "Confirm" ? (
//                             <p className="p-1 text-center bg-green-400 w-[5rem] rounded-full text-xs">
//                               Completed
//                             </p>
//                           ) : (
//                             <p className="p-1 text-center bg-red-400 w-[5rem] rounded-full text-xs">
//                               Pending
//                             </p>
//                           )}
//                         </td>
//                         <td className="px-4 py-2">
//                           {order.statusHistory?.[order.statusHistory.length - 1]
//                             ?.status === "Delivered" ? (
//                             <p className="p-1 text-center bg-green-400 w-[5rem] rounded-full text-xs">
//                               Completed
//                             </p>
//                           ) : (
//                             <p className="p-1 text-center bg-red-400 w-[5rem] rounded-full text-xs">
//                               Pending
//                             </p>
//                           )}
//                         </td>

//                         <td className="px-4 py-2">
//                           <Link to={`/order/${order._id}`}>
//                             <button className="text-xs">More</button>
//                           </Link>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 <div className="flex justify-center items-center mt-6 space-x-3">
//                   <button
//                     onClick={handlePrevPage}
//                     disabled={currentPage === 1}
//                     className="px-4 py-2 aspect-square pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
//                     aria-label="Previous Page"
//                   >
//                     <FaChevronLeft />
//                   </button>
//                   <div className="flex items-center space-x-2">
//                     {ordersData &&
//                       ordersData.pagination &&
//                       Array.from(
//                         { length: ordersData.pagination.totalPages },
//                         (_, index) => (
//                           <button
//                             key={index + 1}
//                             onClick={() => setCurrentPage(index + 1)}
//                             className={`px-4 py-2 aspect-square rounded-full font-semibold text-sm transition duration-300 ease-in-out ${
//                               currentPage === index + 1
//                                 ? "text-customBlue shadow hover:scale-105"
//                                 : "pagination text-white hover:bg-customBlue/80"
//                             }`}
//                             aria-label={`Go to page ${index + 1}`}
//                           >
//                             {index + 1}
//                           </button>
//                         )
//                       )}
//                   </div>
//                   <button
//                     onClick={handleNextPage}
//                     disabled={
//                       !ordersData ||
//                       !ordersData.pagination ||
//                       currentPage === ordersData.pagination.totalPages
//                     }
//                     className="px-4 py-2 aspect-square pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
//                     aria-label="Next Page"
//                   >
//                     <FaChevronRight />
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </section>
//       </div>

//       {/* Status History Modal */}
//       {statusHistoryModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-600">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold text-customBlue">
//                 Order Status History
//               </h3>
//               <button
//                 onClick={() => setStatusHistoryModal(null)}
//                 className="text-gray-400 hover:text-white"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="mb-4">
//               <p className="text-sm mb-1">
//                 <span className="font-medium">Order ID:</span>{" "}
//                 {statusHistoryModal.orderId}
//               </p>
//               <p className="text-sm">
//                 <span className="font-medium">Current Status:</span>{" "}
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClassName(
//                     statusHistoryModal.status
//                   )}`}
//                 >
//                   {statusHistoryModal.status}
//                 </span>
//               </p>
//             </div>
//             <div className="space-y-2 max-h-80 overflow-y-auto">
//               {/* Show specific timestamps for different statuses */}
//               <div className="border-t border-gray-600 pt-2">
//                 <h4 className="font-medium mb-2 text-white">Key Timestamps</h4>
//                 <div className="space-y-2 text-sm">
//                   <p>
//                     <span className="font-medium">Created:</span>{" "}
//                     {formatDate(statusHistoryModal.createdAt)}
//                   </p>
//                   {statusHistoryModal.processingAt && (
//                     <p>
//                       <span className="font-medium">Processing Started:</span>{" "}
//                       {formatDate(statusHistoryModal.processingAt)}
//                     </p>
//                   )}
//                   {statusHistoryModal.confirmedAt && (
//                     <p>
//                       <span className="font-medium">Confirmed:</span>{" "}
//                       {formatDate(statusHistoryModal.confirmedAt)}
//                     </p>
//                   )}
//                   {statusHistoryModal.deliveredAt && (
//                     <p>
//                       <span className="font-medium">Delivered:</span>{" "}
//                       {formatDate(statusHistoryModal.deliveredAt)}
//                     </p>
//                   )}
//                   {statusHistoryModal.paidAt && (
//                     <p>
//                       <span className="font-medium">Paid:</span>{" "}
//                       {formatDate(statusHistoryModal.paidAt)}
//                     </p>
//                   )}
//                   {statusHistoryModal.invoiceGeneratedAt && (
//                     <p>
//                       <span className="font-medium">Invoice Generated:</span>{" "}
//                       {formatDate(statusHistoryModal.invoiceGeneratedAt)}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Status History Timeline */}
//               {statusHistoryModal.statusHistory &&
//               statusHistoryModal.statusHistory.length > 0 ? (
//                 <div className="border-t border-gray-600 pt-4 mt-4">
//                   <h4 className="font-medium mb-2 text-white">
//                     Status History
//                   </h4>
//                   <div className="relative pl-8 border-l-2 border-gray-600 space-y-6">
//                     {statusHistoryModal.statusHistory.map((history, index) => (
//                       <div key={index} className="relative">
//                         <div className="absolute -left-[27px] w-5 h-5 rounded-full bg-customBlue"></div>
//                         <div className="mb-1">
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClassName(
//                               history.status
//                             )}`}
//                           >
//                             {history.status}
//                           </span>
//                         </div>
//                         <p className="text-xs text-gray-400">
//                           {formatDate(history.date)}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-gray-400 text-sm">No history available</p>
//               )}
//             </div>
//             <div className="flex justify-end mt-6">
//               <button
//                 onClick={() => setStatusHistoryModal(null)}
//                 className="bg-customBlue text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default OrderList;

// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import {
//   useGetOrdersQuery,
//   useUpdateOrderStatusMutation,
//   useGetInvoiceProformaMutation,
//   useGetOrderDetailsQuery,
// } from "../../redux/api/orderApiSlice";
// import AdminMenu from "./AdminMenu";
// import Loader from "../../components/Loader";
// import Message from "../../components/Message";
// import { Link } from "react-router-dom";
// import { BASE_URL } from "../../redux/constants";
// import {
//   FaChevronLeft,
//   FaChevronRight,
//   FaHistory,
//   FaFileInvoice,
//   FaSearch,
//   FaFilter,
// } from "react-icons/fa";
// import { io } from "socket.io-client";
// import moment from "moment";
// import PrintOrderModal from "../Admin/PrintOrderModal";

// const OrderList = () => {
//   const { userInfo } = useSelector((state) => state.auth);
//   const [showPrintModal, setShowPrintModal] = useState(false);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit] = useState(15);
//   const socket = io(`${BASE_URL}`);
//   const [statusHistoryModal, setStatusHistoryModal] = useState(null);
//   const [orderData, setOrderData] = useState(null);

//   // Filter states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [dateFilter, setDateFilter] = useState("");
//   const [customerFilter, setCustomerFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [showFilters, setShowFilters] = useState(false);

//   // Fetch orders with pagination
//   const {
//     data: ordersData,
//     refetch,
//     isLoading,
//     error,
//   } = useGetOrdersQuery({
//     page: currentPage,
//     limit,
//   });

//   const [localOrders, setLocalOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [updateOrderStatus] = useUpdateOrderStatusMutation();
//   const [getInvoiceProforma] = useGetInvoiceProformaMutation();

//   useEffect(() => {
//     if (ordersData) {
//       setLocalOrders(ordersData.data);
//     }
//   }, [ordersData]);

//   useEffect(() => {
//     socket.on("orderUpdated", (updatedOrder) => {
//       console.log("Order Updated via Socket:", updatedOrder);
//       setLocalOrders((prevOrder) =>
//         prevOrder.map((order) =>
//           order._id === updatedOrder._id ? updatedOrder : order
//         )
//       );
//     });
//     return () => {
//       socket.off("orderUpdated");
//     };
//   }, []);

//   // Filter orders based on search and filters
//   useEffect(() => {
//     let filtered = [...localOrders];
    
//     // Filter for 'Seller' role
//     if (userInfo.role === "Seller") {
//       filtered = filtered.filter((order) => {
//         return order.orderItems?.some(
//           (item) => item.product?.createdBy === userInfo._id
//         );
//       });
//     }

//     // Apply search term filter
//     if (searchTerm) {
//       filtered = filtered.filter(
//         (order) =>
//           order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           (order.user?.username && order.user.username.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//     }

//     // Apply date filter
//     if (dateFilter) {
//       const filterDate = new Date(dateFilter);
//       filtered = filtered.filter((order) => {
//         const orderDate = new Date(order.createdAt);
//         return (
//           orderDate.getDate() === filterDate.getDate() &&
//           orderDate.getMonth() === filterDate.getMonth() &&
//           orderDate.getFullYear() === filterDate.getFullYear()
//         );
//       });
//     }

//     // Apply customer filter
//     if (customerFilter) {
//       filtered = filtered.filter(
//         (order) =>
//           order.user?.username && order.user.username.toLowerCase().includes(customerFilter.toLowerCase())
//       );
//     }

//     // Apply status filter
//     if (statusFilter) {
//       filtered = filtered.filter(
//         (order) => order.status.toLowerCase() === statusFilter.toLowerCase()
//       );
//     }

//     setFilteredOrders(filtered);
//   }, [localOrders, searchTerm, dateFilter, customerFilter, statusFilter, userInfo]);

//   // Handle status change
//   const handleStatusChange = async (id, newStatus) => {
//     try {
//       const updatedOrders = localOrders.map((order) =>
//         order._id === id ? { ...order, status: newStatus } : order
//       );
//       setLocalOrders(updatedOrders);

//       await updateOrderStatus({ orderId: id, status: newStatus }).unwrap();
//       console.log("Status updated successfully!");
//     } catch (error) {
//       console.error("Error updating status:", error);
//       alert(error?.message || "An error occurred while updating the status.");
//     }
//   };

//   const statusOrder = [
//     "Awaited",
//     "Processing",
//     "Confirm",
//     "Delivered",
//     "Cancelled",
//   ];

//   const allowedTransitions = {
//     Awaited: ["Processing", "Confirm", "Cancelled", "Delivered"],
//     Processing: ["Confirm", "Delivered", "Cancelled"],
//     Confirm: ["Delivered", "Cancelled"],
//     Delivered: ["Processing", "Cancelled"],
//     Cancelled: [],
//   };

//   const getStatusClassName = (status) => {
//     switch (status) {
//       case "Processing":
//         return "bg-blue-500 text-white";
//       case "Confirm":
//         return "bg-green-500 text-white";
//       case "Delivered":
//         return "bg-indigo-500 text-white";
//       case "Cancelled":
//         return "bg-red-500 text-white";
//       default:
//         return "bg-yellow-500 text-white";
//     }
//   };

//   // Function to handle opening the document
//   const handleViewDocument = (documentFileName) => {
//     if (documentFileName) {
//       const documentUrl = `${BASE_URL}/${documentFileName}`;
//       window.open(documentUrl, "_blank");
//     } else {
//       alert("Document is missing or invalid.");
//     }
//   };

//   // Function to display status history
//   const openStatusHistoryModal = (order) => {
//     setStatusHistoryModal(order);
//   };

//   const handleNextPage = () => {
//     if (currentPage < ordersData.pagination.totalPages) {
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
//     setCustomerFilter("");
//     setStatusFilter("");
//   };

//   useEffect(() => {
//     refetch();
//   }, [currentPage, refetch]);

//   // Helper function to format dates
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return moment(dateString).format("MMM DD, YYYY h:mm A");
//   };
  
//   const handlePrintOrder = (order) => {
//     setShowPrintModal(true);
//     setOrderData(order);
//   };

//   return (
//     <div className="min-h-screen">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* <AdminMenu /> */}
//         <div className="w-full">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
//             <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
//               {/* <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Order List</h2> */}
//               <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//                 Manage and track all customer orders
//               </p>
//             </div>

//             <div className="px-6 py-5">
//               {/* Search and Filter Section */}
//               <div className="mb-6">
//                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//                   <div className="relative w-full sm:w-64">
//                     <input
//                       type="text"
//                       placeholder="Search by order ID or customer..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="w-full p-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   </div>

//                   <button
//                     onClick={() => setShowFilters(!showFilters)}
//                     className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//                   >
//                     <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
//                   </button>
//                 </div>

//                 {showFilters && (
//                   <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mt-4 border border-gray-200 dark:border-gray-600">
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Customer</label>
//                         <input
//                           type="text"
//                           placeholder="Enter customer name..."
//                           value={customerFilter}
//                           onChange={(e) => setCustomerFilter(e.target.value)}
//                           className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Date</label>
//                         <input
//                           type="date"
//                           value={dateFilter}
//                           onChange={(e) => setDateFilter(e.target.value)}
//                           className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Status</label>
//                         <select
//                           value={statusFilter}
//                           onChange={(e) => setStatusFilter(e.target.value)}
//                           className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                           <option value="">All Statuses</option>
//                           {statusOrder.map((status) => (
//                             <option key={status} value={status}>
//                               {status}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                       <div className="flex items-end">
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
//                   <div className="overflow-x-auto">
//                     {filteredOrders.length > 0 ? (
//                       <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                         <thead className="bg-gray-50 dark:bg-gray-700">
//                           <tr>
//                             <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ITEMS</th>
//                             <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
//                             <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">CUSTOMER</th>
//                             <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DATE</th>
//                             <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">TOTAL</th>
//                             {userInfo.role !== "Seller" && (
//                               <>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Document</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Invoice</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">History</th>
//                               </>
//                             )}
//                             <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PAID</th>
//                             <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DELIVERED</th>
//                             <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"> </th>
//                           </tr>
//                         </thead>

//                         <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                           {filteredOrders.map((order) => (
//                             <tr
//                               key={order._id}
//                               className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                             >
//                               <td className="px-4 py-4 whitespace-nowrap">
//                                 <div className="w-16 h-16 flex items-center justify-center">
//                                   {order.orderItems.length > 0 &&
//                                   order.orderItems[0].image ? (
//                                     <img
//                                       src={BASE_URL + order.orderItems[0].image}
//                                       alt={order._id}
//                                       className="w-full h-full object-cover rounded-md"
//                                     />
//                                   ) : (
//                                     <p className="text-gray-400 text-xs">No Image</p>
//                                   )}
//                                 </div>
//                               </td>

//                               <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
//                                 {order.orderId}
//                               </td>
//                               <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
//                                 {order.user ? order.user.username : "N/A"}
//                               </td>
//                               <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
//                                 {order.createdAt
//                                   ? order.createdAt.substring(0, 10)
//                                   : "N/A"}
//                               </td>
//                               <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300">
//                                 &#8377; {order.totalPrice}
//                               </td>
//                               {userInfo.role !== "Seller" && (
//                                 <>
//                                   <td className="px-4 py-4 whitespace-nowrap text-sm">
//                                     <button
//                                       className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium"
//                                       onClick={() =>
//                                         handleViewDocument(order.document)
//                                       }
//                                     >
//                                       View Document
//                                     </button>
//                                   </td>
//                                   <td className="px-4 py-4 whitespace-nowrap text-sm">
//                                     <button
//                                       className="flex items-center space-x-1 text-green-600 dark:text-green-400 hover:underline text-xs font-medium"
//                                       onClick={() => {
//                                         handlePrintOrder(order);
//                                       }}
//                                     >
//                                       <FaFileInvoice />
//                                       <span>View Invoice</span>
//                                     </button>
//                                   </td>
//                                   <td className="px-4 py-4 whitespace-nowrap text-sm">
//                                     <select
//                                       value={order.status}
//                                       onChange={(e) =>
//                                         handleStatusChange(order._id, e.target.value)
//                                       }
//                                       className={`px-4 py-2 rounded-full text-xs font-semibold capitalize inline-block ${getStatusClassName(
//                                         order.status
//                                       )}`}
//                                     >
//                                       {statusOrder.map((status) => (
//                                         <option
//                                           key={status}
//                                           value={status}
//                                           disabled={
//                                             status !== order.status &&
//                                             !allowedTransitions[
//                                               order.status
//                                             ]?.includes(status)
//                                           }
//                                         >
//                                           {status}
//                                         </option>
//                                       ))}
//                                     </select>
//                                   </td>

//                                   <td className="px-4 py-4 whitespace-nowrap text-sm">
//                                     <button
//                                       onClick={() => openStatusHistoryModal(order)}
//                                       className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
//                                     >
//                                       <FaHistory className="text-xs" />
//                                       <span className="text-xs">View</span>
//                                     </button>
//                                   </td>
//                                 </>
//                               )}

//                               <td className="px-4 py-4 whitespace-nowrap text-sm">
//                                 {order.statusHistory?.[order.statusHistory.length - 1]
//                                   ?.status === "Confirm" ? (
//                                   <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
//                                     Completed
//                                   </span>
//                                 ) : (
//                                   <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
//                                     Pending
//                                   </span>
//                                 )}
//                               </td>
//                               <td className="px-4 py-4 whitespace-nowrap text-sm">
//                                 {order.statusHistory?.[order.statusHistory.length - 1]
//                                   ?.status === "Delivered" ? (
//                                   <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
//                                     Completed
//                                   </span>
//                                 ) : (
//                                   <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
//                                     Pending
//                                   </span>
//                                 )}
//                               </td>

//                               <td className="px-4 py-4 whitespace-nowrap text-sm">
//                                 <Link to={`/order/${order._id}`}>
//                                   <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
//                                     Details
//                                   </button>
//                                 </Link>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     ) : (
//                       <div className="text-center py-16">
//                         <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                         </svg>
//                         <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No orders found</h3>
//                         <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No orders match your current filters.</p>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               )}
//             </div>
            
//             {!isLoading && !error && filteredOrders.length > 0 && ordersData && (
//               <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
//                 <div className="flex justify-center items-center space-x-2">
//                   <button
//                     onClick={handlePrevPage}
//                     disabled={currentPage === 1}
//                     className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                     aria-label="Previous Page"
//                   >
//                     <FaChevronLeft size={14} />
//                   </button>
                  
//                   <div className="flex items-center space-x-1">
//                     {ordersData.pagination && Array.from(
//                       { length: Math.min(5, ordersData.pagination.totalPages) },
//                       (_, index) => {
//                         let pageNum;
//                         if (ordersData.pagination.totalPages <= 5) {
//                           pageNum = index + 1;
//                         } else {
//                           if (currentPage <= 3) {
//                             pageNum = index + 1;
//                           } else if (currentPage >= ordersData.pagination.totalPages - 2) {
//                             pageNum = ordersData.pagination.totalPages - 4 + index;
//                           } else {
//                             pageNum = currentPage - 2 + index;
//                           }
//                         }

//                         return (
//                           <button
//                             key={pageNum}
//                             onClick={() => setCurrentPage(pageNum)}
//                             className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
//                               currentPage === pageNum
//                                 ? "bg-blue-600 text-white"
//                                 : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
//                             }`}
//                             aria-label={`Go to page ${pageNum}`}
//                           >
//                             {pageNum}
//                           </button>
//                         );
//                       }
//                     )}
                    
//                     {ordersData.pagination && ordersData.pagination.totalPages > 5 && currentPage < ordersData.pagination.totalPages - 2 && (
//                       <>
//                         <span className="text-gray-700 dark:text-gray-300">...</span>
//                         <button
//                           onClick={() => setCurrentPage(ordersData.pagination.totalPages)}
//                           className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
//                           aria-label={`Go to page ${ordersData.pagination.totalPages}`}
//                         >
//                           {ordersData.pagination.totalPages}
//                         </button>
//                       </>
//                     )}
//                   </div>
                  
//                   <button
//                     onClick={handleNextPage}
//                     disabled={!ordersData.pagination || currentPage === ordersData.pagination.totalPages}
//                     className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                     aria-label="Next Page"
//                   >
//                     <FaChevronRight size={14} />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Print Order Modal */}
//       {showPrintModal && orderData && (
//         <PrintOrderModal
//           order={orderData}
//           onClose={() => setShowPrintModal(false)}
//         />
//       )}

//       {/* Status History Modal */}
//       {statusHistoryModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-200 dark:border-gray-700">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold text-gray-800 dark:text-blue-400">
//                 Order Status History
//               </h3>
//               <button
//                 onClick={() => setStatusHistoryModal(null)}
//                 className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="mb-4">
//               <p className="text-sm mb-1 text-gray-700 dark:text-gray-300">
//                 <span className="font-medium">Order ID:</span>{" "}
//                 {statusHistoryModal.orderId}
//               </p>
//               <p className="text-sm text-gray-700 dark:text-gray-300">
//                 <span className="font-medium">Current Status:</span>{" "}
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClassName(
//                     statusHistoryModal.status
//                   )}`}
//                 >
//                   {statusHistoryModal.status}
//                 </span>
//               </p>
//             </div>
//             <div className="space-y-2 max-h-80 overflow-y-auto">
//               {/* Show specific timestamps for different statuses */}
//               <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
//                 <h4 className="font-medium mb-2 text-gray-800 dark:text-white">Key Timestamps</h4>
//                 <div className="space-y-2 text-sm">
//                   <p className="text-gray-700 dark:text-gray-300">
//                     <span className="font-medium">Created:</span>{" "}
//                     {formatDate(statusHistoryModal.createdAt)}
//                   </p>
//                   {statusHistoryModal.processingAt && (
//                     <p className="text-gray-700 dark:text-gray-300">
//                       <span className="font-medium">Processing Started:</span>{" "}
//                       {formatDate(statusHistoryModal.processingAt)}
//                     </p>
//                   )}
//                   {statusHistoryModal.confirmedAt && (
//                     <p className="text-gray-700 dark:text-gray-300">
//                       <span className="font-medium">Confirmed:</span>{" "}
//                       {formatDate(statusHistoryModal.confirmedAt)}
//                     </p>
//                   )}
//                   {statusHistoryModal.deliveredAt && (
//                     <p className="text-gray-700 dark:text-gray-300">
//                       <span className="font-medium">Delivered:</span>{" "}
//                     </p>
//                   )}
//                    {statusHistoryModal.paidAt && (
//                     <p className="text-gray-700 dark:text-gray-300">
//                       <span className="font-medium">Paid:</span>{" "}
//                       {formatDate(statusHistoryModal.paidAt)}
//                     </p>
//                   )}
//                   {statusHistoryModal.invoiceGeneratedAt && (
//                     <p className="text-gray-700 dark:text-gray-300">
//                       <span className="font-medium">Invoice Generated:</span>{" "}
//                       {formatDate(statusHistoryModal.invoiceGeneratedAt)}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Status History Timeline */}
//               {statusHistoryModal.statusHistory &&
//               statusHistoryModal.statusHistory.length > 0 ? (
//                 <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
//                   <h4 className="font-medium mb-2 text-gray-800 dark:text-white">
//                     Status History
//                   </h4>
//                   <div className="relative pl-8 border-l-2 border-gray-300 dark:border-gray-600 space-y-6">
//                     {statusHistoryModal.statusHistory.map((history, index) => (
//                       <div key={index} className="relative">
//                         <div className="absolute -left-[27px] w-5 h-5 rounded-full bg-blue-500"></div>
//                         <div className="mb-1">
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClassName(
//                               history.status
//                             )}`}
//                           >
//                             {history.status}
//                           </span>
//                         </div>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">
//                           {formatDate(history.date)}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-gray-500 dark:text-gray-400 text-sm">No history available</p>
//               )}
//             </div>
//             <div className="flex justify-end mt-6">
//               <button
//                 onClick={() => setStatusHistoryModal(null)}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderList;



import { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaHistory,
  FaFileInvoice,
  FaSearch,
  FaFilter,
  FaTimes,
  FaShoppingBag,
  FaUser,
  FaCalendarAlt,
  FaCreditCard,
  FaTruck,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import moment from "moment";

// Dummy data for orders
const dummyOrders = [
  {
    _id: "order123",
    orderId: "ORD-2025-001",
    user: { username: "John Doe", email: "john@example.com", phone: "555-123-4567" },
    createdAt: "2025-05-01T10:30:00Z",
    totalPrice: 2499.99,
    status: "Delivered",
    document: "docs/order-2025-001.pdf",
    paidAt: "2025-05-01T10:35:00Z",
    deliveredAt: "2025-05-03T14:20:00Z",
    processingAt: "2025-05-01T11:00:00Z",
    confirmedAt: "2025-05-02T09:15:00Z",
    invoiceGeneratedAt: "2025-05-01T10:40:00Z",
    shippingAddress: {
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA"
    },
    paymentMethod: "Credit Card",
    statusHistory: [
      { status: "Awaited", date: "2025-05-01T10:30:00Z" },
      { status: "Processing", date: "2025-05-01T11:00:00Z" },
      { status: "Confirm", date: "2025-05-02T09:15:00Z" },
      { status: "Delivered", date: "2025-05-03T14:20:00Z" }
    ],
    orderItems: [
      {
        _id: "item1",
        name: "Premium Bluetooth Headphones",
        price: 1299.99,
        quantity: 1,
        image: "/images/headphones.jpg",
        product: { createdBy: "seller1" }
      },
      {
        _id: "item2",
        name: "Wireless Keyboard",
        price: 1200.00,
        quantity: 1,
        image: "/images/keyboard.jpg",
        product: { createdBy: "seller2" }
      }
    ]
  },
  {
    _id: "order124",
    orderId: "ORD-2025-002",
    user: { username: "Jane Smith", email: "jane@example.com", phone: "555-987-6543" },
    createdAt: "2025-05-02T15:45:00Z",
    totalPrice: 5999.50,
    status: "Processing",
    document: "docs/order-2025-002.pdf",
    paidAt: "2025-05-02T15:50:00Z",
    processingAt: "2025-05-02T16:30:00Z",
    shippingAddress: {
      address: "456 Park Avenue",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      country: "USA"
    },
    paymentMethod: "PayPal",
    statusHistory: [
      { status: "Awaited", date: "2025-05-02T15:45:00Z" },
      { status: "Processing", date: "2025-05-02T16:30:00Z" }
    ],
    orderItems: [
      {
        _id: "item3",
        name: "4K Smart TV",
        price: 5999.50,
        quantity: 1,
        image: "/images/tv.jpg",
        product: { createdBy: "seller3" }
      }
    ]
  },
  {
    _id: "order125",
    orderId: "ORD-2025-003",
    user: { username: "Robert Johnson", email: "robert@example.com", phone: "555-333-4444" },
    createdAt: "2025-05-03T09:20:00Z",
    totalPrice: 3499.95,
    status: "Confirm",
    document: "docs/order-2025-003.pdf",
    paidAt: "2025-05-03T09:25:00Z",
    processingAt: "2025-05-03T10:00:00Z",
    confirmedAt: "2025-05-04T11:30:00Z",
    invoiceGeneratedAt: "2025-05-03T09:30:00Z",
    shippingAddress: {
      address: "789 Oak Drive",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "USA"
    },
    paymentMethod: "Credit Card",
    statusHistory: [
      { status: "Awaited", date: "2025-05-03T09:20:00Z" },
      { status: "Processing", date: "2025-05-03T10:00:00Z" },
      { status: "Confirm", date: "2025-05-04T11:30:00Z" }
    ],
    orderItems: [
      {
        _id: "item4",
        name: "Gaming Laptop",
        price: 3499.95,
        quantity: 1,
        image: "/images/laptop.jpg",
        product: { createdBy: "seller1" }
      }
    ]
  },
  {
    _id: "order126",
    orderId: "ORD-2025-004",
    user: { username: "Emily White", email: "emily@example.com", phone: "555-222-1111" },
    createdAt: "2025-05-04T14:15:00Z",
    totalPrice: 799.99,
    status: "Awaited",
    document: "docs/order-2025-004.pdf",
    shippingAddress: {
      address: "321 Maple Street",
      city: "Seattle",
      state: "WA",
      postalCode: "98101",
      country: "USA"
    },
    paymentMethod: "Bank Transfer",
    statusHistory: [
      { status: "Awaited", date: "2025-05-04T14:15:00Z" }
    ],
    orderItems: [
      {
        _id: "item5",
        name: "Fitness Smartwatch",
        price: 799.99,
        quantity: 1,
        image: "/images/smartwatch.jpg",
        product: { createdBy: "seller2" }
      }
    ]
  },
  {
    _id: "order127",
    orderId: "ORD-2025-005",
    user: { username: "Michael Green", email: "michael@example.com", phone: "555-777-8888" },
    createdAt: "2025-05-05T11:10:00Z",
    totalPrice: 4249.97,
    status: "Cancelled",
    document: "docs/order-2025-005.pdf",
    paidAt: "2025-05-05T11:15:00Z",
    processingAt: "2025-05-05T12:00:00Z",
    shippingAddress: {
      address: "567 Pine Road",
      city: "Boston",
      state: "MA",
      postalCode: "02108",
      country: "USA"
    },
    paymentMethod: "Credit Card",
    statusHistory: [
      { status: "Awaited", date: "2025-05-05T11:10:00Z" },
      { status: "Processing", date: "2025-05-05T12:00:00Z" },
      { status: "Cancelled", date: "2025-05-06T09:45:00Z" }
    ],
    orderItems: [
      {
        _id: "item6",
        name: "Digital Camera",
        price: 1499.99,
        quantity: 1,
        image: "/images/camera.jpg",
        product: { createdBy: "seller3" }
      },
      {
        _id: "item7",
        name: "Camera Lens",
        price: 899.99,
        quantity: 1,
        image: "/images/lens.jpg",
        product: { createdBy: "seller3" }
      },
      {
        _id: "item8",
        name: "Camera Tripod",
        price: 1849.99,
        quantity: 1,
        image: "/images/tripod.jpg",
        product: { createdBy: "seller1" }
      }
    ]
  }
];

// Mock user info
const userInfo = {
  _id: "user123",
  username: "admin",
  role: "Admin"
};

const OrderList = () => {
  // State for orders and filters
  const [localOrders, setLocalOrders] = useState(dummyOrders);
  const [filteredOrders, setFilteredOrders] = useState(dummyOrders);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [statusHistoryModal, setStatusHistoryModal] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status options
  const statusOrder = [
    "Awaited",
    "Processing",
    "Confirm",
    "Delivered",
    "Cancelled",
  ];

  const allowedTransitions = {
    Awaited: ["Processing", "Confirm", "Cancelled", "Delivered"],
    Processing: ["Confirm", "Delivered", "Cancelled"],
    Confirm: ["Delivered", "Cancelled"],
    Delivered: ["Processing", "Cancelled"],
    Cancelled: [],
  };

  // Apply filters to orders
  useEffect(() => {
    let filtered = [...localOrders];
    
    // Filter for 'Seller' role
    if (userInfo.role === "Seller") {
      filtered = filtered.filter((order) => {
        return order.orderItems?.some(
          (item) => item.product?.createdBy === userInfo._id
        );
      });
    }

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.user?.username && order.user.username.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getDate() === filterDate.getDate() &&
          orderDate.getMonth() === filterDate.getMonth() &&
          orderDate.getFullYear() === filterDate.getFullYear()
        );
      });
    }

    // Apply customer filter
    if (customerFilter) {
      filtered = filtered.filter(
        (order) =>
          order.user?.username && order.user.username.toLowerCase().includes(customerFilter.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(
        (order) => order.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredOrders(filtered);
    // Set total pages based on filtered results
    setTotalPages(Math.ceil(filtered.length / limit));
  }, [localOrders, searchTerm, dateFilter, customerFilter, statusFilter, userInfo, limit]);

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      // Update status locally
      const updatedOrders = localOrders.map((order) => {
        if (order._id === id) {
          // Create new status history entry
          const newStatusHistory = [
            ...(order.statusHistory || []),
            { status: newStatus, date: new Date().toISOString() }
          ];
          
          // Update timestamps based on status
          const updatedOrder = { 
            ...order, 
            status: newStatus,
            statusHistory: newStatusHistory
          };
          
          // Update specific timestamps based on status
          if (newStatus === "Processing" && !order.processingAt) {
            updatedOrder.processingAt = new Date().toISOString();
          } else if (newStatus === "Confirm" && !order.confirmedAt) {
            updatedOrder.confirmedAt = new Date().toISOString();
          } else if (newStatus === "Delivered" && !order.deliveredAt) {
            updatedOrder.deliveredAt = new Date().toISOString();
          }
          
          return updatedOrder;
        }
        return order;
      });
      
      setLocalOrders(updatedOrders);
      console.log("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error?.message || "An error occurred while updating the status.");
    }
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case "Processing":
        return "bg-blue-500 text-white";
      case "Confirm":
        return "bg-green-500 text-white";
      case "Delivered":
        return "bg-indigo-500 text-white";
      case "Cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-yellow-500 text-white";
    }
  };

  // Function to open document in new tab (simulated)
  const handleViewDocument = (documentFileName) => {
    if (documentFileName) {
      alert(`Document would open in new tab: ${documentFileName}`);
    } else {
      alert("Document is missing or invalid.");
    }
  };

  // Function to display status history
  const openStatusHistoryModal = (order) => {
    setStatusHistoryModal(order);
  };

  // Function to open order details modal
  const openOrderDetailsModal = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
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

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setDateFilter("");
    setCustomerFilter("");
    setStatusFilter("");
  };

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return moment(dateString).format("MMM DD, YYYY h:mm A");
  };
  
  const handlePrintOrder = (order) => {
    setShowPrintModal(true);
    setSelectedOrder(order);
  };

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * limit;
  const indexOfFirstOrder = indexOfLastOrder - limit;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Order Management</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage and track all customer orders
              </p>
            </div>

            <div className="px-6 py-5">
              {/* Search and Filter Section */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search by order ID or customer..."
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Customer</label>
                        <input
                          type="text"
                          placeholder="Enter customer name..."
                          value={customerFilter}
                          onChange={(e) => setCustomerFilter(e.target.value)}
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Status</label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Statuses</option>
                          {statusOrder.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
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

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-md text-red-700 dark:text-red-400">
                  {error?.data?.message || error.error || "An error occurred"}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    {currentOrders.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ITEMS</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">CUSTOMER</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DATE</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">TOTAL</th>
                            {userInfo.role !== "Seller" && (
                              <>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Document</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Invoice</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">History</th>
                              </>
                            )}
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PAID</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DELIVERED</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"> </th>
                          </tr>
                        </thead>

                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {currentOrders.map((order) => (
                            <tr
                              key={order._id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="w-16 h-16 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md">
                                  {order.orderItems.length > 0 &&
                                  order.orderItems[0].image ? (
                                    <img
                                      src={order.orderItems[0].image}
                                      alt={order._id}
                                      className="w-full h-full object-cover rounded-md"
                                    />
                                  ) : (
                                    <FaShoppingBag className="text-gray-400 text-xl" />
                                  )}
                                </div>
                              </td>

                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {order.orderId}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {order.user ? order.user.username : "N/A"}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {order.createdAt
                                  ? moment(order.createdAt).format("YYYY-MM-DD")
                                  : "N/A"}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300">
                                &#8377; {order.totalPrice}
                              </td>
                              {userInfo.role !== "Seller" && (
                                <>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                                    <button
                                      className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium"
                                      onClick={() =>
                                        handleViewDocument(order.document)
                                      }
                                    >
                                      View Document
                                    </button>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                                    <button
                                      className="flex items-center space-x-1 text-green-600 dark:text-green-400 hover:underline text-xs font-medium"
                                      onClick={() => {
                                        handlePrintOrder(order);
                                      }}
                                    >
                                      <FaFileInvoice />
                                      <span>View Invoice</span>
                                    </button>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                                    <select
                                      value={order.status}
                                      onChange={(e) =>
                                        handleStatusChange(order._id, e.target.value)
                                      }
                                      className={`px-4 py-2 rounded-full text-xs font-semibold capitalize inline-block ${getStatusClassName(
                                        order.status
                                      )}`}
                                    >
                                      {statusOrder.map((status) => (
                                        <option
                                          key={status}
                                          value={status}
                                          disabled={
                                            status !== order.status &&
                                            !allowedTransitions[
                                              order.status
                                            ]?.includes(status)
                                          }
                                        >
                                          {status}
                                        </option>
                                      ))}
                                    </select>
                                  </td>

                                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                                    <button
                                      onClick={() => openStatusHistoryModal(order)}
                                      className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                                    >
                                      <FaHistory className="text-xs" />
                                      <span className="text-xs">View</span>
                                    </button>
                                  </td>
                                </>
                              )}

                              <td className="px-4 py-4 whitespace-nowrap text-sm">
                                {order.paidAt ? (
                                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                    Completed
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm">
                                {order.deliveredAt ? (
                                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                    Completed
                                  </span>
                                ) : (
                                 <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm">
                                <button
                                  onClick={() => openOrderDetailsModal(order)}
                                  className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium"
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                        No orders found matching the filters
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {indexOfFirstOrder + 1} to{" "}
                      {indexOfLastOrder > filteredOrders.length
                        ? filteredOrders.length
                        : indexOfLastOrder}{" "}
                      of {filteredOrders.length} orders
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${
                          currentPage === 1
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        <FaChevronLeft size={14} />
                      </button>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Page {currentPage} of {totalPages}
                      </div>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md ${
                          currentPage === totalPages
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        <FaChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status History Modal */}
      {statusHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order Status History - {statusHistoryModal.orderId}
              </h3>
              <button
                onClick={() => setStatusHistoryModal(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <FaTimes />
              </button>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              {statusHistoryModal.statusHistory && 
               statusHistoryModal.statusHistory.length > 0 ? (
                <div className="space-y-4">
                  {statusHistoryModal.statusHistory.map((history, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusClassName(
                          history.status
                        )}`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-800 dark:text-white">
                            {history.status}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(history.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No status history available
                </p>
              )}
            </div>
            <div className="mt-6">
              <button
                onClick={() => setStatusHistoryModal(null)}
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Invoice Modal */}
      {showPrintModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Invoice - {selectedOrder.orderId}
              </h3>
              <button
                onClick={() => {
                  setShowPrintModal(false);
                  setSelectedOrder(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <FaTimes />
              </button>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">INVOICE</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Invoice #{selectedOrder.orderId}</p>
                    <p className="text-gray-500 dark:text-gray-400">
                      Invoice Date: {formatDate(selectedOrder.invoiceGeneratedAt || selectedOrder.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">E-Commerce Store</h2>
                    <p className="text-gray-600 dark:text-gray-400">123 E-Commerce Street</p>
                    <p className="text-gray-600 dark:text-gray-400">New York, NY 10001</p>
                    <p className="text-gray-600 dark:text-gray-400">support@ecommerce.com</p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-gray-600 dark:text-gray-400 font-semibold">Bill To:</h3>
                    <p className="text-gray-800 dark:text-gray-200 font-medium mt-2">{selectedOrder.user?.username}</p>
                    <p className="text-gray-600 dark:text-gray-400">{selectedOrder.user?.email}</p>
                    <p className="text-gray-600 dark:text-gray-400">{selectedOrder.user?.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-600 dark:text-gray-400 font-semibold">Ship To:</h3>
                    <p className="text-gray-800 dark:text-gray-200 font-medium mt-2">{selectedOrder.shippingAddress?.address}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">{selectedOrder.shippingAddress?.country}</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-gray-600 dark:text-gray-400 font-semibold mb-4">Order Items:</h3>
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unit Price</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {selectedOrder.orderItems.map((item) => (
                        <tr key={item._id}>
                          <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{item.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 text-right">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 text-right">&#8377; {item.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 text-right">&#8377; {(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200 text-right">Total:</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200 text-right">&#8377; {selectedOrder.totalPrice.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mt-8">
                  <h3 className="text-gray-600 dark:text-gray-400 font-semibold mb-2">Payment Information:</h3>
                  <p className="text-gray-600 dark:text-gray-400">Payment Method: {selectedOrder.paymentMethod}</p>
                  <p className="text-gray-600 dark:text-gray-400">Payment Status: {selectedOrder.paidAt ? "Paid" : "Pending"}</p>
                  {selectedOrder.paidAt && (
                    <p className="text-gray-600 dark:text-gray-400">Payment Date: {formatDate(selectedOrder.paidAt)}</p>
                  )}
                </div>

                <div className="mt-8">
                  <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Thank you for your business. If you have any questions, please contact customer support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowPrintModal(false);
                  setSelectedOrder(null);
                }}
                className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => alert("Print functionality would be implemented here")}
                className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order Details - {selectedOrder.orderId}
              </h3>
              <button
                onClick={() => {
                  setShowOrderDetailsModal(false);
                  setSelectedOrder(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <FaTimes />
              </button>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Order Information
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Order ID:</span>
                      <span className="text-gray-800 dark:text-white font-medium">{selectedOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Date Placed:</span>
                      <span className="text-gray-800 dark:text-white">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusClassName(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total Amount:</span>
                      <span className="text-gray-800 dark:text-white font-semibold">&#8377; {selectedOrder.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Payment Method:</span>
                      <span className="text-gray-800 dark:text-white">{selectedOrder.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Customer Information
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                    <div className="flex items-center">
                      <FaUser className="text-gray-400 mr-2" />
                      <span className="text-gray-800 dark:text-white">{selectedOrder.user?.username}</span>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-400 mr-2" />
                      <span className="text-gray-800 dark:text-white">{selectedOrder.user?.email}</span>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="text-gray-400 mr-2" />
                      <span className="text-gray-800 dark:text-white">{selectedOrder.user?.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Shipping Address
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="text-gray-400 mr-2 mt-1" />
                      <div>
                        <p className="text-gray-800 dark:text-white">{selectedOrder.shippingAddress?.address}</p>
                        <p className="text-gray-800 dark:text-white">
                          {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}
                        </p>
                        <p className="text-gray-800 dark:text-white">{selectedOrder.shippingAddress?.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Timeline
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">Order Placed:</span>
                      </div>
                      <span className="text-gray-800 dark:text-white">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    {selectedOrder.paidAt && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <FaCreditCard className="text-gray-400 mr-2" />
                          <span className="text-gray-600 dark:text-gray-300">Payment Confirmed:</span>
                        </div>
                        <span className="text-gray-800 dark:text-white">{formatDate(selectedOrder.paidAt)}</span>
                      </div>
                    )}
                    {selectedOrder.processingAt && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <FaShoppingBag className="text-gray-400 mr-2" />
                          <span className="text-gray-600 dark:text-gray-300">Processing Started:</span>
                        </div>
                        <span className="text-gray-800 dark:text-white">{formatDate(selectedOrder.processingAt)}</span>
                      </div>
                    )}
                    {selectedOrder.confirmedAt && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {/* <FaCheck className="text-gray-400 mr-2" /> */}
                          <span className="text-gray-600 dark:text-gray-300">Order Confirmed:</span>
                        </div>
                        <span className="text-gray-800 dark:text-white">{formatDate(selectedOrder.confirmedAt)}</span>
                      </div>
                    )}
                    {selectedOrder.deliveredAt && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <FaTruck className="text-gray-400 mr-2" />
                          <span className="text-gray-600 dark:text-gray-300">Order Delivered:</span>
                        </div>
                        <span className="text-gray-800 dark:text-white">{formatDate(selectedOrder.deliveredAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Order Items
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {selectedOrder.orderItems.map((item) => (
                        <tr key={item._id}>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-600 rounded-md mr-3 flex-shrink-0 overflow-hidden">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center">
                                    <FaShoppingBag className="text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800 dark:text-white">{item.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white text-right">&#8377; {item.price.toFixed(2)}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white text-right">{item.quantity}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white text-right">&#8377; {(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200 text-right">Total:</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200 text-right">&#8377; {selectedOrder.totalPrice.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowOrderDetailsModal(false);
                  setSelectedOrder(null);
                }}
                className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;