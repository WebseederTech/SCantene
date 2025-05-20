import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const UserOrder = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");

  const id = userInfo._id;
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // Number of orders per page

  const {
    data: orders,
    isLoading,
    error,
  } = useGetMyOrdersQuery({ id, page:currentPage, limit }, { skip: !id });

  // Filter orders based on search term
  const filteredOrders = orders?.data.filter((order) =>
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNextPage = () => {
    if (currentPage < orders?.pagination.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-full px-4 py-8 mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-customBlue mb-4 md:mb-0">
            My Orders
          </h1>

          {!isLoading && !error && orders?.length > 0 && (
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search by order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-customBlue"
              />
              <div className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center my-12">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">
            {error?.data?.error || error.error}
          </Message>
        ) : orders?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-gray-400 mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="text-2xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't placed any orders yet.
            </p>
            <Link to="/products">
              <button className="bg-customBlue hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors duration-300">
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="w-full overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto w-full">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-4 font-semibold">PRODUCT</th>
                    <th className="text-left p-4 font-semibold">ORDER ID</th>
                    <th className="text-left p-4 font-semibold">DATE</th>
                    <th className="text-left p-4 font-semibold">TOTAL</th>
                    <th className="text-left p-4 font-semibold">STATUS</th>
                    <th className="text-left p-4 font-semibold">DELIVERY</th>
                    <th className="text-left p-4 font-semibold"></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders?.map((order, index) => (
                    <tr
                      key={order._id}
                      className={`border-b border-gray-200 dark:border-gray-700 ${
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-900"
                          : "bg-gray-50 dark:bg-gray-800"
                      } hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors`}
                    >
                      <td className="p-4">
                        {order.orderItems?.length > 0 &&
                        order.orderItems[0]?.image ? (
                          <div className="flex items-center">
                            <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                              <img
                                src={order.orderItems[0].image}
                                alt={order.orderItems[0]?.name || "Product"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {order.orderItems.length > 1 && (
                              <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                                +{order.orderItems.length - 1} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400 text-xs">
                              No Image
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-mono text-sm">{order.orderId}</td>
                      <td className="p-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-medium">
                        ₹{order.totalPrice.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                            order.status === "Paid" ||
                            order.status === "Complete"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {order.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                            order.isDelivered
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {order.isDelivered ? "Delivered" : "Pending"}
                        </span>
                      </td>
                      <td className="p-4">
                        <Link to={`/order/${order._id}`}>
                          <button className="bg-customBlue hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors duration-200 flex items-center">
                            View Details
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 ml-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center items-center mt-6 space-x-3 mb-4 ">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
                  aria-label="Previous Page"
                >
                  <FaChevronLeft />
                </button>
                <div className="flex items-center space-x-2 max-w-[70%] overflow-x-auto scrollbar-hide">
                  {Array.from(
                    { length: orders.pagination.totalPages },
                    (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 rounded-full font-semibold text-sm transition duration-300 ease-in-out ${
                          currentPage === index + 1
                            ? "bg-gradient-to-r from-customBlue to-customBlue/80 text-white shadow-lg hover:scale-105"
                            : "pagination text-white hover:bg-customBlue/80"
                        }`}
                        aria-label={`Go to page ${index + 1}`}
                      >
                        {index + 1}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === orders.pagination.totalPages}
                  className="px-4 py-2 pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
                  aria-label="Next Page"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrder;
