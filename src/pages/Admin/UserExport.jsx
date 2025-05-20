import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";

const UserExport = ({ limit, fileName, currentPage }) => {
  const {
    data: usersData,
    refetch,
    isLoading,
    error,
  } = useGetUsersQuery({
    page: currentPage,
    limit,
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usersData && Array.isArray(usersData.data)) {
      setUsers(usersData.data); // Set the users data directly from the query if it's an array
    } else {
      // toast.error("Invalid data format"); 
    }
  }, [usersData]);

  const handleExport = () => {
    if (!users || users.length === 0) {
      toast.error("No data available to export");
      return;
    }

    // Get the current page data from usersData
    const currentPageData = usersData.data;

    // Map over the current page data and select the necessary fields
    const filteredUsers = currentPageData.map((user) => {
      const address = user.addresses.length > 0 ? user.addresses[0] : {};
      return {
        ID: user.userID, // assuming _id is the field containing the ID
        Username: user.username,
        Email: user.email,
        "Contact No": user.contactNo,
        City: address.city || "", // default to empty string if city is undefined
        Address: address.address || "",
        "Postal Code": address.postalCode || "",
        Country: address.country || "",
        Role: user.role,
        ShopName:user.shopName||"",
        DIST:user.dist||"",
        GSTIN:user.gstIn||""
      };
    });

    const ws = XLSX.utils.json_to_sheet(filteredUsers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <div>
      <button
        onClick={handleExport}
        className={`bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        Export
      </button>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading users</p>}
      {/* Render your pagination component or other elements as needed */}
    </div>
  );
};

export default UserExport;
