import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { BASE_URL } from "../../redux/constants";

const UserImport = () => {
  const [importStatus, setImportStatus] = useState({ success: [], errors: [] });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const parseExcelFile = async (file) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const parsedData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

    return parsedData.map((user, index) => {
      const contactNumbers = String(user["ContactNo"] || "")
        .split(/[\/\-]/)
        .map((num) => num.trim())
        .filter((num) => num.length > 0 && !isNaN(num));

      const email =
        user.Email && user.Email.includes("@") ? user.Email : undefined;

      return {
        username: user.Username || ``,
        email: email,
        password: user.Password || "12345",
        contactNo: contactNumbers.length > 0 ? contactNumbers[0] :"",
        alternativeContactNo:
          contactNumbers.length > 1 ? contactNumbers[1] : "",
        role: user.Role || "Buyer",
        shopName: user.ShopName || "",
        gstIn: user.GSTIN || "",
        dist: user.DIST || "",
        addresses: {
          city: user.City || "",
          address: user.Address || "",
          postalCode: user["Postal Code"] || "",
          country: user.Country || "",
        },
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setImportStatus({ success: [], errors: [] });

    try {
      const userData = await parseExcelFile(file);
      console.log(userData,"userData")

      const response = await axios.post(`${BASE_URL}/api/users/bulk-import`, {
        users: userData,
      });

      if (response.data.success) {
        setImportStatus({ success: response.data.data, errors: [] });
        alert("Users imported successfully.");
        location.reload();
      } else {
        setImportStatus({ success: [], errors: response.data.errors });
        alert("Failed to import users: " + response.data.message);
      }
    } catch (error) {
      console.error("Error importing data:", error);
      setImportStatus({ success: [], errors: [error.message] });
      alert("An error occurred while importing the data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-2">
      <input
        type="file"
        accept=".xlsx, .xls"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={handleButtonClick}
        className={`bg-blue-500 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-blue-600 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
            Importing...
          </>
        ) : (
          "Import"
        )}
      </button>
    </div>
  );
};

export default UserImport;
