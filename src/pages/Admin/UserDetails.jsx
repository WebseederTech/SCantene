import { useState, useEffect } from "react";
import { FaTimesCircle } from "react-icons/fa";

const UserDetailsModal = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState("orders");
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    lastOrder: "1 month(s) ago",
    totalSpent: "₹13858.20",
    averageOrder: "₹2771.64",
    totalOrders: 5,
    orderHistory: [
      {
        invoiceNumber: "MKNIND2",
        invoiceDate: "2025-03-26",
        paymentStatus: "Pending",
        fulfillment: "Cancelled",
        orderTotal: "₹2056.25"
      },
      {
        invoiceNumber: "MKNIND3",
        invoiceDate: "2025-03-26",
        paymentStatus: "Pending",
        fulfillment: "Pending",
        orderTotal: "₹3950.00"
      },
      {
        invoiceNumber: "MKNIND4",
        invoiceDate: "2025-03-26",
        paymentStatus: "Pending",
        fulfillment: "Cancelled",
        orderTotal: "₹3520.00"
      },
      {
        invoiceNumber: "MKNIND6",
        invoiceDate: "2025-03-27",
        paymentStatus: "Confirmed",
        fulfillment: "Cancelled",
        orderTotal: "₹2261.00"
      },
      {
        invoiceNumber: "MKNIND9",
        invoiceDate: "2025-03-27",
        paymentStatus: "Confirmed",
        fulfillment: "Confirmed",
        orderTotal: "₹2070.95"
      }
    ]
  });

  // In a real application, you would fetch this data from an API
  useEffect(() => {
    // Simulating data loading
    setIsLoading(true);
    
    // Mock API call - would be replaced with actual API call
    setTimeout(() => {
      // Get order data based on user
      setIsLoading(false);
    }, 500);
  }, [user]);

  if (!user) return null;

  const userAddress = user.addresses?.[0] || {};

  const renderTabContent = () => {
    switch(activeTab) {
      case "orders":
        return (
          <div className="space-y-6">
            {/* Order summary stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Order</h3>
                <p className="mt-2 text-xl font-semibold text-gray-800 dark:text-white">{orderData.lastOrder}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</h3>
                <p className="mt-2 text-xl font-semibold text-gray-800 dark:text-white">{orderData.totalSpent}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Order</h3>
                <p className="mt-2 text-xl font-semibold text-gray-800 dark:text-white">{orderData.averageOrder}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</h3>
                <p className="mt-2 text-xl font-semibold text-gray-800 dark:text-white">{orderData.totalOrders} Order(s)</p>
              </div>
            </div>

            {/* Order history table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Order History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Invoice Number</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Invoice Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fulfillment</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {orderData.orderHistory.map((order) => (
                      <tr key={order.invoiceNumber} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{order.invoiceNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{order.invoiceDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${order.paymentStatus === "Confirmed" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${order.fulfillment === "Confirmed" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : order.fulfillment === "Cancelled"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>
                            {order.fulfillment}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{order.orderTotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "address":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Address Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Street Address</h4>
                  <p className="mt-2 text-base text-gray-800 dark:text-white">{userAddress.address || "Not provided"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">City</h4>
                  <p className="mt-2 text-base text-gray-800 dark:text-white">{userAddress.city || "Not provided"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Postal Code</h4>
                  <p className="mt-2 text-base text-gray-800 dark:text-white">{userAddress.postalCode || "Not provided"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</h4>
                  <p className="mt-2 text-base text-gray-800 dark:text-white">{userAddress.country || "Not provided"}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "info":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">User Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</h4>
                  <p className="mt-2 text-base text-gray-800 dark:text-white">{user.userID || "Not assigned"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</h4>
                  <p className="mt-2 text-base text-gray-800 dark:text-white">{user.username || "Not provided"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</h4>
                  <p className="mt-2 text-base text-gray-800 dark:text-white">
                    <a href={`mailto:${user.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {user.email || "Not provided"}
                    </a>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Number</h4>
                  <p className="mt-2 text-base text-gray-800 dark:text-white">{user.contactNo || "Not provided"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Shop Name</h4>
                  <p className="mt-2 text-base text-gray-800 dark:text-white">{user.shopName || "Not provided"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Status</h4>
                  <p className="mt-2">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.isAdmin 
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"}`}>
                      {user.isAdmin ? "Admin" : "Active User"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {user.username || "User"} Details
            {user.shopName && <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">({user.shopName})</span>}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
          >
            <FaTimesCircle size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 px-6 py-2 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-6">
            <button
              onClick={() => setActiveTab("orders")}
              className={`py-2 px-1 text-sm font-medium border-b-2 ${
                activeTab === "orders"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab("address")}
              className={`py-2 px-1 text-sm font-medium border-b-2 ${
                activeTab === "address"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Address
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`py-2 px-1 text-sm font-medium border-b-2 ${
                activeTab === "info"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              User Info
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-gray-900">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            renderTabContent()
          )}
        </div>

        {/* Footer */}
        <div className="bg-white dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;