import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { BASE_URL } from "../../redux/constants";

const ProductImport = () => {
  const [file, setFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");

  // Handle file upload
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseExcelFile(selectedFile);
    }
  };

  // Parse Excel file
  const parseExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setProducts(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  // Submit parsed data to the backend
  const handleSubmit = async () => {
    if (products.length === 0) {
      setUploadStatus("No products to upload.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/products/import-products`, {
        products,
      });
      setUploadStatus(response.data.message || "Products imported successfully!");
    } catch (error) {
      setUploadStatus("Error uploading products: " + error.message);
    }
  };

  return (
    <div className="product-import">
      <h2>Import Products</h2>
      <div>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
        <button onClick={handleSubmit} disabled={!file}>
          Upload Products
        </button>
      </div>

      {uploadStatus && <p>{uploadStatus}</p>}

      {products.length > 0 && (
        <div>
          <h3>Preview</h3>
          <table border="1">
            <thead>
              <tr>
                {Object.keys(products[0]).map((key, idx) => (
                  <th key={idx}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={idx}>
                  {Object.values(product).map((value, index) => (
                    <td key={index}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductImport;
