import React, { useState, useRef } from "react";
import QRCode from "../../Assets/QRCode.jpeg";
import { Check, Copy } from "lucide-react";

const BankDetails = ({ onClose, totalPrice }) => {
  const defaultBankDetails = {
    bankName: "Kotak Mahindra Bank",
    accountHolder: "Osiya Enterprises",
    accountNumber: "2312894674",
    ifscCode: "KKBK0005933",
    branch: "Narayan Kothi Indore",
    upiId: "osiyaenterprises@kotak",
    totalPrice: totalPrice,
    document: "",
  };

  const [formData, setFormData] = useState(defaultBankDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [copyStatus, setCopyStatus] = useState({});
  
  const existingData = JSON.parse(localStorage.getItem("checkOutData")) || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Merge the existing data with the new form data
    const updatedData = { ...existingData, document: formData.document };

    // Save the updated data (with base64 file) to localStorage
    localStorage.setItem("checkOutData", JSON.stringify(updatedData));

    setTimeout(() => {
      console.log("Bank details submitted:", updatedData);
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64File = reader.result;

        // Save file data in formData
        setFormData({ ...formData, document: base64File });

        // Generate a preview for the file (if it's an image)
        setPreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file); // Convert file to Base64
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus({ [field]: true });
      setTimeout(() => setCopyStatus({}), 2000);
    });
  };

  // QR Modal component
  const QRCodeModal = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Scan to Pay
            </h3>
            <button
              onClick={() => setShowQRModal(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              &times;
            </button>
          </div>

          <div className="flex justify-center">
            <img
              src={QRCode}
              alt="Payment QR Code"
              className="w-64 h-64 object-contain border-4 border-white dark:border-gray-700 rounded-lg shadow-md"
              id="qr-code-image"
            />
          </div>

          <div className="mt-4 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="relative flex items-center w-full max-w-md">
                <input
                  type="text"
                  value={formData.upiId}
                  readOnly
                  className="p-3 pr-12 w-full border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => copyToClipboard(formData.upiId, 'upiId')}
                  className="absolute right-2 p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Copy UPI ID"
                >
                  {copyStatus.upiId ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <a
              href={QRCode}
              download="Payment-QRCode.jpeg"
              className="inline-block mt-2 px-6 py-3 text-white rounded-lg text-sm bg-blue-600 hover:bg-blue-700"
            >
              Download QR Code
            </a>

            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Scan with any UPI app to pay ₹{formData.totalPrice}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Payment to: {formData.accountHolder}
            </p>
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => setShowQRModal(false)}
              className="px-6 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowQRModal(false)}
              className="px-6 py-3 bg-customBlue text-white rounded-md hover:bg-customBlue/80 transition-colors font-medium"
            >
              Back to Form
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Common copy button component
  const CopyButton = ({ value, field }) => (
    <button
      onClick={() => copyToClipboard(value, field)}
      className="absolute right-2 p-1 text-gray-500 hover:text-customBlue dark:text-gray-400 dark:hover:text-gray-200 mt-2"
      title="Copy to clipboard"
    >
      {/* {copyStatus[field] ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )} */}

{copyStatus[field] ? <Check size={20} /> : <Copy size={20} />}

    </button>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center darktheme bg-opacity-50">
      <div className="relative w-full max-w-2xl darktheme bg-opacity-80 rounded-lg shadow-lg p-8 border-2 border-gray-600">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 dark:text-white text-black text-lg"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-center text-customBlue">
          Bank Transfer Details
        </h2>

        {/* QR Code Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowQRModal(true)}
            className="flex items-center justify-center space-x-2 bg-customBlue hover:bg-customBlue/80 text-white py-2 px-4 rounded-lg transition-colors shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2v2h2V6H5zm9-2a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V4a1 1 0 00-1-1h-4zm0 2h2v2h-2V6zm-8 7a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm2 2v2h2v-2H5zm9-2a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4zm0 2h2v2h-2v-2z"
                clipRule="evenodd"
              />
            </svg>
            <span>Scan QR Code to Pay</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="bankName"
                className="text-sm font-medium darklabel"
              >
                Bank Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  className="p-3 pr-10 border-2 border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  readOnly
                />
                <CopyButton value={formData.bankName} field="bankName" />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="accountHolder"
                className="text-sm font-medium darklabel"
              >
                Account Holder Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="accountHolder"
                  name="accountHolder"
                  value={formData.accountHolder}
                  className="p-3 pr-10 border-2 border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  readOnly
                />
                <CopyButton value={formData.accountHolder} field="accountHolder" />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="accountNumber"
                className="text-sm font-medium darklabel"
              >
                Account Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  className="p-3 pr-10 border-2 border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  readOnly
                />
                <CopyButton value={formData.accountNumber} field="accountNumber" />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="ifscCode"
                className="text-sm font-medium darklabel"
              >
                IFSC Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="ifscCode"
                  name="ifscCode"
                  value={formData.ifscCode}
                  className="p-3 pr-10 border-2 border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  readOnly
                />
                <CopyButton value={formData.ifscCode} field="ifscCode" />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="branch" className="text-sm font-medium darklabel">
                Branch
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  className="p-3 pr-10 border-2 border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  readOnly
                />
                <CopyButton value={formData.branch} field="branch" />
              </div>
            </div>

            {/* <div className="flex flex-col space-y-2">
              <label
                htmlFor="upiId"
                className="text-sm font-medium darklabel"
              >
                UPI ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="upiId"
                  name="upiId"
                  value={formData.upiId}
                  className="p-3 pr-10 border-2 border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  readOnly
                />
                <CopyButton value={formData.upiId} field="upiIdForm" />
              </div>
            </div> */}

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="totalPrice"
                className="text-sm font-medium darklabel"
              >
                Total Price
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="totalPrice"
                  name="totalPrice"
                  value={formData.totalPrice}
                  className="p-3 pr-10 border-2 border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  readOnly
                />
                {/* <CopyButton value={formData.totalPrice} field="totalPrice" /> */}
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="document"
              className="text-sm font-medium darklabel whitespace-nowrap"
            >
              Upload Payment Screenshot:
            </label>
            <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
              <div className="w-full sm:w-auto">
                <input
                  type="file"
                  id="document"
                  name="document"
                  className="p-2 border-2 border-dotted border-gray-700 dark:bg-gray-900 bg-gray-300 rounded-md dark:text-white text-black focus:outline-none focus:ring-2 focus:ring-customBlue w-full"
                  onChange={handleFileChange}
                />
              </div>

              {preview && (
                <div className="flex-shrink-0">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-16 h-16 rounded-md border border-gray-700"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 p-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-md transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 p-3 bg-customBlue text-white rounded-md transition duration-300 hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue disabled:bg-purple-300"
            >
              {isSubmitting ? "Submitting..." : "Confirm"}
            </button>
          </div>
        </form>

        {/* QR Code Modal */}
        {showQRModal && <QRCodeModal />}
      </div>
    </div>
  );
};

export default BankDetails;