import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetUserActivityQuery } from "../../redux/api/usersApiSlice";
import {
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaSearch,
  FaHistory,
  FaShoppingBag,
} from "react-icons/fa";

const UserActivityPage = () => {
  const { userId } = useParams();
  // API query parameters
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeTab, setActiveTab] = useState("clicked"); // "clicked" or "searches"

  // Filter UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [userNameFilter, setUserNameFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Track if we're using local filtering
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredClickedData, setFilteredClickedData] = useState([]);
  const [filteredSearchData, setFilteredSearchData] = useState([]);
  const [filteredPage, setFilteredPage] = useState(1);
  const [filteredTotalPages, setFilteredTotalPages] = useState(1);

  // Fetch data from API
  const {
    data: userActivity,
    isLoading,
    isError,
    refetch,
  } = useGetUserActivityQuery({
    userId,
    page,
    limit,
    search,
    startDate,
    endDate,
  });

  // Apply local filters when filter values change
  useEffect(() => {
    const hasFilters = searchTerm || dateFilter || userNameFilter;
    setIsFiltering(hasFilters);

    if (hasFilters && userActivity?.data) {
      // Filter clicked products
      if (userActivity.data.clickedProducts) {
        const filteredClicked = applyFiltersToClicked(
          userActivity.data.clickedProducts,
          searchTerm,
          dateFilter,
          userNameFilter
        );
        
        setFilteredClickedData(filteredClicked);
      }
      
      // Filter search history
      if (userActivity.data.searchHistory) {
        const filteredSearches = applyFiltersToSearches(
          userActivity.data.searchHistory,
          searchTerm,
          dateFilter
        );
        
        setFilteredSearchData(filteredSearches);
      }
      
      // Calculate total pages based on active tab
      const dataToUse = activeTab === "clicked" ? filteredClickedData : filteredSearchData;
      const totalPages = Math.max(1, Math.ceil(dataToUse.length / limit));
      setFilteredTotalPages(totalPages);
      
      // Reset to first page when filters change
      setFilteredPage(1);
    }
  }, [searchTerm, dateFilter, userNameFilter, userActivity, limit, activeTab]);

  // Update filtered total pages when tab changes
  useEffect(() => {
    if (isFiltering) {
      const dataToUse = activeTab === "clicked" ? filteredClickedData : filteredSearchData;
      const totalPages = Math.max(1, Math.ceil(dataToUse.length / limit));
      setFilteredTotalPages(totalPages);
      setFilteredPage(1); // Reset to first page when changing tabs
    }
  }, [activeTab, filteredClickedData, filteredSearchData, isFiltering, limit]);

  // Handle applying local filters for clicked products
  const applyFiltersToClicked = (data, term, date, username) => {
    if (!Array.isArray(data)) {
      return [];
    }

    let filtered = [...data];

    // Filter by search term (product name or username)
    if (term) {
      filtered = filtered.filter(
        (item) =>
          (item.productId?.name &&
            item.productId.name.toLowerCase().includes(term.toLowerCase())) ||
          (item.user?.username &&
            item.user.username.toLowerCase().includes(term.toLowerCase()))
      );
    }

    // Filter by date
    if (date) {
      const filterDate = new Date(date);
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.timestamp);
        return (
          itemDate.getDate() === filterDate.getDate() &&
          itemDate.getMonth() === filterDate.getMonth() &&
          itemDate.getFullYear() === filterDate.getFullYear()
        );
      });
    }

    // Filter by username
    if (username) {
      filtered = filtered.filter(
        (item) =>
          item.user?.username &&
          item.user.username.toLowerCase().includes(username.toLowerCase())
      );
    }

    return filtered;
  };

  // Handle applying local filters for search history
  const applyFiltersToSearches = (data, term, date) => {
    if (!Array.isArray(data)) {
      return [];
    }

    let filtered = [...data];

    // Filter by search query term
    if (term) {
      filtered = filtered.filter(
        (item) =>
          (item.query &&
            item.query.toLowerCase().includes(term.toLowerCase()))
      );
    }

    // Filter by date
    if (date) {
      const filterDate = new Date(date);
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.timestamp);
        return (
          itemDate.getDate() === filterDate.getDate() &&
          itemDate.getMonth() === filterDate.getMonth() &&
          itemDate.getFullYear() === filterDate.getFullYear()
        );
      });
    }

    return filtered;
  };

  // Get current page data for filtered results
  const getCurrentFilteredPageData = () => {
    const startIndex = (filteredPage - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Return data based on active tab
    if (activeTab === "clicked") {
      return filteredClickedData.slice(startIndex, endIndex);
    } else {
      return filteredSearchData.slice(startIndex, endIndex);
    }
  };

  // Handle pagination for filtered data
  const handleFilteredNextPage = () => {
    if (filteredPage < filteredTotalPages) {
      setFilteredPage(filteredPage + 1);
    }
  };

  const handleFilteredPrevPage = () => {
    if (filteredPage > 1) {
      setFilteredPage(filteredPage - 1);
    }
  };

  // Handle pagination for API data
  const handleNextPage = () => {
    if (userActivity && page < userActivity.pagination.totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setDateFilter("");
    setUserNameFilter("");
    setIsFiltering(false);
    setFilteredPage(1);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isLoading) return <p className="text-center text-gray-600">Loading...</p>;
  if (isError || !userActivity)
    return <p className="text-center text-red-500">No activity found.</p>;

  // Determine what data to display based on filtering state and active tab
  const displayClickedData = isFiltering
    ? getCurrentFilteredPageData()
    : userActivity.data.clickedProducts || [];
    
  const displaySearchData = isFiltering
    ? getCurrentFilteredPageData()
    : userActivity.data.searchHistory || [];

  // Determine which data to use based on active tab
  const displayData = activeTab === "clicked" ? displayClickedData : displaySearchData;
  
  // Ensure we don't show pagination for empty pages
  const currentPageHasData = displayData.length > 0;

  return (
    <div className="flex flex-col items-center darktheme px-6">
      <section className="w-full darktheme bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-600 ">
        <h1 className="text-2xl font-semibold mb-6 text-center text-customBlue">
          User Activity
        </h1>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-600 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm flex items-center gap-2 ${
              activeTab === "clicked"
                ? "border-b-2 border-customBlue text-customBlue"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("clicked")}
          >
            <FaShoppingBag /> Clicked Products
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm flex items-center gap-2 ${
              activeTab === "searches"
                ? "border-b-2 border-customBlue text-customBlue"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("searches")}
          >
            <FaHistory /> Search History
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder={activeTab === "clicked" ? "Search by product..." : "Search queries..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 pr-4 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-customBlue"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="bg-gray-800 p-4 rounded-lg mb-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Only show username filter for clicked products tab */}
                {activeTab === "clicked" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Filter by Username
                    </label>
                    <input
                      type="text"
                      placeholder="Enter username..."
                      value={userNameFilter}
                      onChange={(e) => setUserNameFilter(e.target.value)}
                      className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-customBlue"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Filter by Date
                  </label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-customBlue"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Status Indicator */}
        {isFiltering && (
          <div className="mb-4 p-2 bg-blue-900/30 border border-blue-500 rounded-lg">
            <p className="text-blue-300 text-sm flex items-center">
              <FaFilter className="mr-2" /> 
              Showing filtered results ({
                activeTab === "clicked" ? filteredClickedData.length : filteredSearchData.length
              } items found) 
              {displayData.length > 0 && (
                <span className="ml-2">
                  - Page {filteredPage} of {filteredTotalPages}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Clicked Products Table */}
        {activeTab === "clicked" && (
          <div className="mb-6">
            {displayClickedData.length > 0 ? (
              <div className="overflow-x-auto mt-4 rounded-lg text-sm">
                <table className="table-auto w-full text-white">
                  <thead>
                    <tr className="tableheading">
                      <th className="px-6 py-4 text-left font-medium">#</th>
                      <th className="px-6 py-4 text-left font-medium">
                        Product Name
                      </th>
                      <th className="px-6 py-4 text-left font-medium">
                        Click Count
                      </th>
                      <th className="px-6 py-4 text-left font-medium">
                        Last Clicked
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayClickedData.map((click, index) => (
                      <tr
                        key={click._id || index}
                        className="tablecontent transition-colors"
                      >
                        <td className="px-6 py-4">
                          {isFiltering
                            ? (filteredPage - 1) * limit + index + 1
                            : (page - 1) * limit + index + 1}
                        </td>
                        <td className="px-6 py-4">
                          {click.productId?.name || "Unknown Product"}
                        </td>
                        <td className="px-4 py-3 text-blue-500">{click.count}</td>
                        <td className="px-6 py-4">
                          {click.timestamp ? formatDate(click.timestamp) : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                {isFiltering 
                  ? "No products match your filter criteria. Try adjusting your filters."
                  : "No clicked products found."}
              </p>
            )}
          </div>
        )}

        {/* Search History Table */}
        {activeTab === "searches" && (
          <div className="mb-6">
            {displaySearchData.length > 0 ? (
              <div className="overflow-x-auto mt-4 rounded-lg text-sm">
                <table className="table-auto w-full text-white">
                  <thead>
                    <tr className="tableheading">
                      <th className="px-6 py-4 text-left font-medium">#</th>
                      <th className="px-6 py-4 text-left font-medium">
                        Search Query
                      </th>
                      <th className="px-6 py-4 text-left font-medium">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displaySearchData.map((search, index) => (
                      <tr
                        key={search._id || index}
                        className="tablecontent transition-colors"
                      >
                        <td className="px-6 py-4">
                          {isFiltering
                            ? (filteredPage - 1) * limit + index + 1
                            : (page - 1) * limit + index + 1}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {search.query || "Empty Search"}
                        </td>
                        <td className="px-6 py-4">
                          {search.timestamp ? formatDate(search.timestamp) : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                {isFiltering 
                  ? "No search queries match your filter criteria. Try adjusting your filters."
                  : "No search history found."}
              </p>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {currentPageHasData && (
          <div className="flex justify-center items-center mt-6 space-x-3 mb-4">
            {isFiltering ? (
              /* Filtered Data Pagination */
              <>
                <button
                  onClick={handleFilteredPrevPage}
                  disabled={filteredPage === 1}
                  className="px-4 py-2 pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
                  aria-label="Previous Page"
                >
                  <FaChevronLeft />
                </button>
                <div className="flex items-center space-x-2 max-w-[70%] overflow-x-auto scrollbar-hide">
                  {filteredTotalPages > 0 && Array.from(
                    { length: filteredTotalPages },
                    (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setFilteredPage(index + 1)}
                        className={`px-4 py-2 rounded-full font-semibold text-sm transition duration-300 ease-in-out ${
                          filteredPage === index + 1
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
                  onClick={handleFilteredNextPage}
                  disabled={filteredPage >= filteredTotalPages}
                  className="px-4 py-2 pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
                  aria-label="Next Page"
                >
                  <FaChevronRight />
                </button>
              </>
            ) : (
              /* API Data Pagination */
              <>
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="px-4 py-2 pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
                  aria-label="Previous Page"
                >
                  <FaChevronLeft />
                </button>
                <div className="flex items-center space-x-2 max-w-[70%] overflow-x-auto scrollbar-hide">
                  {Array.from(
                    { length: userActivity.pagination.totalPages },
                    (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setPage(index + 1)}
                        className={`px-4 py-2 rounded-full font-semibold text-sm transition duration-300 ease-in-out ${
                          page === index + 1
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
                  disabled={page >= userActivity.pagination.totalPages}
                  className="px-4 py-2 pagination rounded-full hover:bg-customBlue/80 transition transform duration-300 ease-in-out disabled:cursor-not-allowed hover:scale-105"
                  aria-label="Next Page"
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserActivityPage;