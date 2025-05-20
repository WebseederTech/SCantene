import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { useGetBuyersQuery } from "../../redux/api/usersApiSlice";

const BuyerExport = ({ limit, fileName, currentPage }) => {
  const {
    data: BuyerData,
    isLoading,
    error,
  } = useGetBuyersQuery({
    page: currentPage,
    limit,
  });

  const [Buyers, setBuyers] = useState([]);

  useEffect(() => {
    if (BuyerData && Array.isArray(BuyerData.data)) {
      setBuyers(BuyerData.data);
    } else {
      toast.error("Invalid data format");
    }
  }, [BuyerData]);

  const handleExport = () => {
    if (!Buyers || Buyers.length === 0) {
      toast.error("No data available to export");
      return;
    }

    const filteredBuyers = Buyers.map((Buyer) => {
      return {
        "Buyer ID": Buyer.userID,
        Name: Buyer.username,
        Email: Buyer.email,
        "Contact Number": Buyer.contactNo,
        "Referral Code": Buyer.referralCode,
        "Salesmanperson Name": Buyer.SalesmanpersonUsername || "N/A",
        Status: Buyer.status,
      };
    });

    const ws = XLSX.utils.json_to_sheet(filteredBuyers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Buyers");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <div>
      <button
        onClick={handleExport}
        className={`bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        Export Buyers
      </button>
      {isLoading && <p>Loading Buyer Data...</p>}
      {error && <p>Error loading Buyers: {error?.message}</p>}
    </div>
  );
};

export default BuyerExport;
