import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../redux/constants";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [documentUrl, setDocumentUrl] = useState(""); // To store the selected document URL

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/orders/admin/pending-orders`
        );

        console.log("API Response:", response.data); // Log the full response

        const formattedData = response.data.data.map((order) => ({
          _id: order._id,
          username: order.user?.username || "N/A", // Correctly access the username
          productName: order.orderItems[0]?.name || "N/A", // First item's name
          price: `${order.totalPrice}`, // Total price
          addedDocument: order.document || "No Document", // Document name
          status: order.status, // Current status
        }));

        setOrders(formattedData);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Optimistically update the UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );

      // Send the status update request to the API
      const response = await axios.put(
        `${BASE_URL}/api/orders/admin/orders/${id}/status`,
        { status: newStatus }
      );

      console.log("Status updated successfully:", response.data);
    } catch (error) {
      // Roll back UI changes if API call fails
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: order.status } : order
        )
      );
      console.error("Error updating status:", error);
      alert(
        error.response?.data?.message ||
        error.message ||
        "An error occurred while updating the status."
      );
    }
  };

  // Function to open the modal with the document URL
  // Function to open the modal with the document URL
  const openDocumentModal = (url) => {
    console.log("Document URL:", url); // Debug: log the document URL
    if (url && url !== "No Document") {
      // Check if the URL is relative (doesn't start with 'http' or 'https')
      const fullUrl = url.startsWith("http")
        ? url
        : `${BASE_URL}/uploads/${url}`;
      setDocumentUrl(fullUrl);
      setModalOpen(true);
    } else {
      alert("No document available.");
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setModalOpen(false);
    setDocumentUrl("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center darktheme p-8">
      <section className="relative w-full max-w-7xl darktheme bg-opacity-50 rounded-lg shadow-lg p-8 border-2 border-gray-600">
        <h1 className="text-2xl font-semibold mb-6 text-center text-customBlue">
          Order Overview
        </h1>

        {loading ? (
          <p className="text-center text-white">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="tableheading">
                  <th className="px-6 py-4 text-left font-medium">Username</th>
                  <th className="px-6 py-4 text-left font-medium">
                    Product Name
                  </th>
                  <th className="px-6 py-4 text-left font-medium">Price</th>
                  <th className="px-6 py-4 text-left font-medium">Document</th>
                  <th className="px-6 py-4 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="tablecontent transition-colors"
                  >
                    <td className="px-6 py-4">{order.username}</td>
                    <td className="px-6 py-4">{order.productName}</td>
                    <td className="px-6 py-4">&#8377;{order.price}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openDocumentModal(order.addedDocument)}
                        className="text-blue-400 hover:underline"
                      >
                        View Document
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`px-4 py-2 rounded-full text-xs font-semibold capitalize inline-block ${order.status === "Confirm"
                            ? "bg-green-500 text-white"
                            : order.status === "Cancelled"
                              ? "bg-red-500 text-white"
                              : "bg-yellow-500 text-white"
                          }`}
                      >
                        <option value="Awaited">Awaited</option>
                        <option value="Confirm">Confirm</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal for document preview */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl w-full">
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="text-red-500 font-semibold text-lg"
              >
                X
              </button>
            </div>
            {documentUrl ? (
              <img
                src={documentUrl}
                alt="Document"
                className="max-w-full max-h-96 object-contain"
              />
            ) : (
              <p>No document available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingOrders;
