import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../redux/constants";
import { useSelector } from "react-redux";
import {
  useGetSlabRequestsQuery,
  useUpdateSlabRequestStatusMutation,
} from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";

const SlabRequestList = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);

  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo._id;
  const role = userInfo.role;

  const { data, error, refetch, isLoading } = useGetSlabRequestsQuery({
    page: currentPage,
    limit,
  });
  const [updateSlabRequestStatus] = useUpdateSlabRequestStatusMutation();

  const [localRequests, setLocalRequests] = useState([]);

  useEffect(() => {
    if (data?.data) {
      setLocalRequests(data.data);
    }
  }, [data]);
  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  const handleRequestStatusChange = async (requestId, status) => {
    try {
      if (["pending", "fulfilled", "rejected"].includes(status)) {
        await updateSlabRequestStatus({ requestId, status });
        toast.success(`Request ${status} successfully`);

        // Update the local state
        setLocalRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === requestId ? { ...request, status } : request
          )
        );
      } else {
        toast.error("Invalid status selected");
      }
    } catch (err) {
      console.error("Error updating request status:", err);
      toast.error("Failed to update request status");
    }
  };

  const requests = data?.data || [];
  const pagination = data?.pagination || {};
  useEffect(() => {
    if (data?.data) {
      // Admin can see all requests, Seller can only see their own product requests
      const filteredRequests =
        role === "Admin" || role === "Accounts"
          ? data.data
          : data.data.filter(
            (request) => request.product?.createdBy?._id === userId
          );
      setLocalRequests(filteredRequests);
    }
  }, [data, userId, role]);

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col items-center darktheme px-6">
      <section className="w-full  darktheme bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-600 ">
        {/* <AdminMenu /> */}
        <h1 className="text-2xl font-semibold mb-6 text-center text-customBlue">
          Slab Requests
        </h1>

        {loading ? (
          <p className="text-center dark:text-white text-black">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto text-sm">
            <table className="table-auto w-full rounded-lg overflow-hidden">
              <thead>
                <tr className="tableheading">
                  <th className="px-6 py-4 text-center font-medium">
                    Request BY
                  </th>
                  <th className="px-6 py-4 text-center font-medium">Product</th>
                  <th className="px-6 py-4 text-center font-medium">Vendor</th>

                  <th className="px-6 py-4 text-center font-medium">
                    Requested Quantity
                  </th>
                  <th className="px-6 py-4 text-center font-medium">Status</th>
                  {/* <th className="px-6 py-4 text-left font-medium">Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {localRequests?.map((request) => (
                  <tr
                    key={request._id}
                    className="tablecontent transition-colors"
                  >
                    <td className="px-6 py-4 text-center">
                      {request.requestedBy?.username}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {request.product?.name || "N/A"}
                    </td>
                    {request.product?.createdBy ? (
                      <td className="px-6 py-4 text-center">
                        {request.product.createdBy.username || "N/A"}
                      </td>
                    ) : (
                      <td className="px-6 py-4 text-center">N/A</td>
                    )}

                    <td className="px-6 py-4 text-center">
                      {request.requestedQuantity || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <select
                        value={request.status}
                        onChange={(e) =>
                          handleRequestStatusChange(request._id, e.target.value)
                        }
                        className={`px-4 py-2 rounded-full text-xs font-semibold capitalize inline-block ${request.status === "fulfilled"
                          ? "bg-green-500 text-white"
                          : request.status === "rejected"
                            ? "bg-red-500 text-white"
                            : "bg-yellow-500 text-white"
                          }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="fulfilled">Fulfiled</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    {/* <td className="px-6 py-4">
                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleRequestStatusChange(request._id, "approved")
                            }
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 mr-2"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() =>
                              handleRequestStatusChange(request._id, "rejected")
                            }
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      {request.status !== "pending" && (
                        <span className="text-gray-500">No action needed</span>
                      )}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center items-center mt-6 space-x-3 p-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 aspect-square pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
              >
                <FaChevronLeft />
              </button>
              {Array.from({ length: pagination.totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 aspect-square rounded-full font-semibold text-sm transition duration-300 ease-in-out ${currentPage === index + 1
                    ? "text-customBlue shadow hover:scale-105"
                    : "pagination text-blue-400 hover:bg-customBlue/80"
                    }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={handleNextPage}
                disabled={currentPage === pagination.totalPages}
                className="px-4 aspect-square py-2 pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SlabRequestList;


