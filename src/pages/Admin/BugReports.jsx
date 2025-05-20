// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import AdminMenu from "./AdminMenu";
// import Loader from "../../components/Loader";
// import Message from "../../components/Message";
// import { BASE_URL } from "../../redux/constants";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { io } from "socket.io-client";
// import { useGetBugReportsQuery } from "../../redux/api/usersApiSlice";

// const BugReportsList = () => {
//   const { userInfo } = useSelector((state) => state.auth);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit] = useState(10);
//   const socket = io(`${BASE_URL}`);

//   const {
//     data: reportsData,
//     isLoading,
//     refetch,
//     error,
//   } = useGetBugReportsQuery({ page: currentPage, limit });
//   console.log(reportsData, "reportsData");
//   const [localReports, setLocalReports] = useState([]);

//   useEffect(() => {
//     if (reportsData) {
//       setLocalReports(reportsData.data);
//     }
//   }, [reportsData]);

//   useEffect(() => {
//     socket.on("bugReportUpdated", (updatedReport) => {
//       setLocalReports((prevReports) =>
//         prevReports.map((report) =>
//           report._id === updatedReport._id ? updatedReport : report
//         )
//       );
//       refetch(); // Ensure the server data stays synced
//     });
//     return () => socket.off("bugReportUpdated");
//   }, [socket, refetch]);

//   const handleNextPage = () => {
//     if (currentPage < reportsData?.pagination.totalPages) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//     }
//   };

//   useEffect(() => {
//     // refetch();
//   }, [currentPage]);

//   return (
//     <div className="flex flex-col items-center darktheme px-6 pb-6">
//       <AdminMenu />
//       <section className="w-full darktheme bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-600">
//         <h1 className="text-2xl font-semibold mb-6 text-center text-customBlue">
//           Bug Reports List
//         </h1>
//         {isLoading ? (
//           <Loader />
//         ) : error ? (
//           <Message variant="danger">
//             {error?.data?.message || error.error}
//           </Message>
//         ) : (
//           <>
            
//             <div className="overflow-x-auto overflow-y-hidden">
//               <table className="table-auto w-full mt-2 rounded-lg overflow-hidden">
//                 <thead>
//                   <tr className="tableheading text-sm">
//                     {/* <th className="px-4 py-2 text-left font-medium">ID</th> */}
//                     <th className="px-4 py-2 text-left font-medium">User</th>
//                     <th className="px-4 py-2 text-left font-medium">
//                       Screenshot
//                     </th>
//                     <th className="px-4 py-2 text-left font-medium">
//                       Description
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {localReports.map((report) => (
//                     <tr
//                       key={report._id}
//                       className="tablecontent transition-colors text-sm"
//                     >
//                       {/* <td className="px-4 py-2">{report._id}</td> */}
//                       <td className="px-4 py-2">
//                         {report.user?.username || "N/A"}
//                       </td>
//                       <td className="px-4 py-2">
//                         <div className="w-16 h-16 flex items-center justify-center">
//                           <img
//                             src={`${BASE_URL}/${report.screenshot}`}
//                             alt="screenshot"
//                             className="w-full h-full object-cover rounded-md"
//                           />
//                         </div>
//                       </td>
//                       <td className="px-4 py-2">{report.description}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <div className="flex justify-center items-center mt-6 space-x-3">
//                 <button
//                   onClick={() =>
//                     setCurrentPage((prev) => Math.max(prev - 1, 1))
//                   }
//                   disabled={currentPage === 1 || !reportsData?.pagination}
//                   className="px-4 py-2 rounded-full pagination hover:bg-customBlue/80"
//                 >
//                   <FaChevronLeft />
//                 </button>

//                 {reportsData?.pagination?.totalPages &&
//                   Array.from(
//                     { length: reportsData.pagination.totalPages },
//                     (_, index) => (
//                       <button
//                         key={index + 1}
//                         onClick={() => setCurrentPage(index + 1)}
//                         className={`px-4 py-2 aspect-square rounded-full font-semibold text-sm ${
//                           currentPage === index + 1
//                             ? "text-customBlue shadow"
//                             : "pagination text-white"
//                         }`}
//                       >
//                         {index + 1}
//                       </button>
//                     )
//                   )}

//                 <button
//                   onClick={() => setCurrentPage((prev) => prev + 1)}
//                   disabled={
//                     currentPage === reportsData?.pagination?.totalPages ||
//                     !reportsData?.pagination
//                   }
//                   className="px-4 py-2 rounded-full pagination hover:bg-customBlue/80"
//                 >
//                   <FaChevronRight />
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </section>
//     </div>
//   );
// };

// export default BugReportsList;

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { BASE_URL } from "../../redux/constants";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { io } from "socket.io-client";
import { useGetBugReportsQuery } from "../../redux/api/usersApiSlice";

const BugReportsList = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const socket = io(`${BASE_URL}`);

  const {
    data: reportsData,
    isLoading,
    refetch,
    error,
  } = useGetBugReportsQuery({ page: currentPage, limit });
  
  const [localReports, setLocalReports] = useState([]);

  useEffect(() => {
    if (reportsData) {
      setLocalReports(reportsData.data);
    }
  }, [reportsData]);

  useEffect(() => {
    socket.on("bugReportUpdated", (updatedReport) => {
      setLocalReports((prevReports) =>
        prevReports.map((report) =>
          report._id === updatedReport._id ? updatedReport : report
        )
      );
      refetch(); // Ensure the server data stays synced
    });
    return () => socket.off("bugReportUpdated");
  }, [socket, refetch]);

  const handleNextPage = () => {
    if (currentPage < reportsData?.pagination.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* <AdminMenu /> */}
        <div className="w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {/* <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Bug Reports</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View and manage bug reports submitted by users
              </p>
            </div> */}
            
            <div className="px-6 py-5">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader />
                </div>
              ) : error ? (
                <Message variant="danger">
                  {error?.data?.message || error.error}
                </Message>
              ) : (
                <div className="overflow-x-auto">
                  {localReports.length === 0 ? (
                    <div className="text-center py-16">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712m-4.242-3.712c-1.172 1.025-1.172 2.687 0 3.712 1.171 1.025 3.071 1.025 4.242 0M9 10h.01M15 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No bug reports</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No bug reports have been submitted yet.</p>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            User
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Screenshot
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {localReports.map((report) => (
                          <tr key={report._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {report.user?.username || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-16 h-16 flex items-center justify-center">
                                <img
                                  src={`${BASE_URL}/${report.screenshot}`}
                                  alt="screenshot"
                                  className="w-full h-full object-cover rounded-md border border-gray-200 dark:border-gray-600"
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                              {report.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
            
            {!isLoading && !error && reportsData?.pagination && reportsData.data.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft size={14} />
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from(
                      { length: reportsData.pagination.totalPages },
                      (_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                            currentPage === index + 1
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        >
                          {index + 1}
                        </button>
                      )
                    )}
                  </div>
                  
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === reportsData.pagination.totalPages}
                    className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default BugReportsList;