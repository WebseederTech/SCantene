import React, { useState, useEffect } from "react";

const CouponForm = ({ coupon, isEditing, onSubmit, onCancel, isLoading }) => {
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [expire, setExpire] = useState(""); // Expiration date field
  const [errors, setErrors] = useState({});

  // Update form when editing a coupon
  useEffect(() => {
    if (coupon) {
      setName(coupon.name || "");
      setPercentage(coupon.percentage || "");
      setExpire(coupon.expire ? coupon.expire.split("T")[0] : ""); // Format for input[type=date]
    } else {
      setName("");
      setPercentage("");
      setExpire("");
    }
    setErrors({});
  }, [coupon]);

  // Form validation
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Coupon name is required";
    if (!percentage) {
      newErrors.percentage = "Discount percentage is required";
    } else if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      newErrors.percentage = "Percentage must be between 0 and 100";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        name: name.trim(),
        percentage: Number(percentage),
        expire: expire ? new Date(expire) : null, // Convert to Date object
      });
      if (!isEditing) {
        setName("");
        setPercentage("");
        setExpire("");
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? "Edit Coupon" : "Create New Coupon"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Coupon Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Coupon Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="SUMMER2025"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Discount Percentage */}
        <div className="mb-4">
          <label htmlFor="percentage" className="block text-sm font-medium text-gray-700 mb-1">
            Discount Percentage
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="number"
              id="percentage"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              min="0"
              max="100"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-12 ${
                errors.percentage ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="25"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">%</span>
            </div>
          </div>
          {errors.percentage && <p className="mt-1 text-sm text-red-600">{errors.percentage}</p>}
        </div>

        {/* Expiration Date */}
        <div className="mb-6">
          <label htmlFor="expire" className="block text-sm font-medium text-gray-700 mb-1">
            Expiration Date (Optional)
          </label>
          <input
            type="date"
            id="expire"
            value={expire}
            onChange={(e) => setExpire(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`${
              isEditing ? "ml-auto" : "w-full"
            } px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEditing ? "Updating..." : "Creating..."}
              </span>
            ) : (
              <>{isEditing ? "Update Coupon" : "Create Coupon"}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
