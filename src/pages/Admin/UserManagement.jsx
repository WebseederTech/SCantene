import { useEffect, useState } from "react";
import {
  useApprovedUserMutation,
  useGetBuyersQuery,
  useGetUsersQuery,
} from "../../redux/api/usersApiSlice";
import { useSelector } from "react-redux";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { data } from "autoprefixer";
import UserExport from "./UserExport";
import AdminMenu from "./AdminMenu";

const UserManagement = () => {
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [limit] = useState(5); // Items per page

  // Fetch users with pagination
  const {
    data: users,
    refetch,
    isLoading,
    error,
  } = useGetBuyersQuery({
    page: currentPage,
    limit,
  });

  console.log(users, "USSSSSSSSSSSSSSSSSSSSSS");

  const [approvedUser] = useApprovedUserMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      if (userInfo.role === "Admin") {
        const user = users?.data?.find((user) => user._id === userId);
        if (!user) throw new Error("User not found");
        console.log(userId, "iddddd");
        // Approve user while keeping their role as 'Buyer'
        await approvedUser({ userId, role: "Buyer", status: newStatus });
        refetch();
      } else {
        console.warn("Only Admins can approve users.");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < users.pagination.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    refetch(); // Refetch data when page changes
  }, [currentPage, refetch]);

  // Handle no data found scenario
  const isNoData = !users || !users.data || users.data.length === 0;

  return (
    <div className="flex flex-col items-center darktheme px-6">
      <section className="w-full  darktheme bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-600 ">
        {/* <AdminMenu /> */}
        <h1 className="text-2xl font-semibold mb-6 text-center text-customBlue">
          Buyer Approval
        </h1>
        {isLoading ? (
          <p className="text-white">Loading...</p>
        ) : error ? (
          <p className="text-red-500">
            {error?.data?.message || "Error loading users."}
          </p>
        ) : isNoData ? (
          <p className="text-gray-400 text-center">No Buyer users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex sm:flex-row flex-col justify-end sm:justify-end sm:mb-0 mb-2 items-center sm:items-start">
              <UserExport
                limit={limit}
                fileName="Buyers"
                currentPage={currentPage}
              />
            </div>

            <div className="overflow-x-auto mt-4 rounded-lg text-sm">
              <table className="table-auto w-full text-white">
                <thead>
                  <tr className="tableheading">
                    <th className="px-6 py-4 text-left font-medium">Name</th>
                    <th className="px-6 py-4 text-left font-medium">Email</th>
                    <th className="px-6 py-4 text-left font-medium">
                      Contact No.
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Referral Code
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Salesmanman Name
                    </th>
                    <th className="px-6 py-4 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.data
                    .filter((user) => user.role === "Buyer")
                    .map((user) => (
                      <tr
                        key={user._id}
                        className="tablecontent transition-colors"
                      >
                        <td className="px-6 py-4">{user.username}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{user.contactNo}</td>
                        <td className="px-6 py-4">{user.referralCode}</td>
                        <td className="px-6 py-4">
                          {user.SalesmanpersonUsername}
                        </td>

                        <td className="px-6 py-4 text-center">
                          {userInfo.role === "Admin" ? (
                            <select
                              value={user.status}
                              onChange={(e) =>
                                handleStatusChange(user._id, e.target.value)
                              }
                              className={`px-4 py-2 rounded-full text-xs font-semibold capitalize inline-block ${user.status === "approved"
                                ? "bg-green-500 text-white"
                                : user.status === "pending"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-red-500 text-white"
                                }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                            </select>
                          ) : (
                            user.status
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <div className="flex justify-center items-center mt-6 space-x-3">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 aspect-square py-2 pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
                  aria-label="Previous Page"
                >
                  <FaChevronLeft />
                </button>

                <div className="flex items-center space-x-2">
                  {Array.from(
                    { length: users.pagination.totalPages },
                    (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 aspect-square rounded-full font-semibold text-sm transition duration-300 ease-in-out ${currentPage === index + 1
                          ? "text-customBlue shadow hover:scale-105"
                          : "pagination hover:bg-customBlue/80"
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
                  disabled={currentPage === users.pagination.totalPages}
                  className="px-4 py-2 aspect-square pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
                  aria-label="Next Page"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default UserManagement;
