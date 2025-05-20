import React, { useState } from "react";

const CouponModal = ({ coupons, setCoupanData }) => {
  const [selectedCoupon, setSelectedCoupon] = useState(null); // Store selected coupon ID
  const today = new Date(); // Get today's date

  // ✅ Filter out expired coupons before rendering
  const validCoupons = coupons.filter((coupon) => {
    if (!coupon.expire) return true; // If no expire date, consider valid
    return new Date(coupon.expire) >= today; // Only keep non-expired coupons
  });

  const handleSelectCoupon = (coupon) => {
    if (selectedCoupon === coupon._id) {
      // If the same coupon is clicked again, deselect it
      setSelectedCoupon(null);
      setCoupanData({
        discount: 0,
        productId: "",
        couponCode: "",
        couponId: "",
      });
    } else {
      // Select the new coupon
      setSelectedCoupon(coupon._id);
      setCoupanData({
        discount: coupon.discount,
        productId: coupon.productId,
        couponCode: coupon.name,
        couponId: coupon._id,
      });
    }
  };

  return (
    <div className="">
      <div className="bg-white mt-4">
        <h2 className="text-xl font-bold text-gray-800 py-2">
          Available Coupons
        </h2>

        <div className="space-y-3">
          {validCoupons.length > 0 ? (
            validCoupons.map((coupon) => (
              <div
                key={coupon._id}
                className={`border border-dashed p-4 rounded-md flex justify-between items-center transition-all duration-200
                  ${
                    selectedCoupon === coupon._id
                      ? "bg-gray-300 border-gray-500" // Selected state
                      : "bg-blue-50 border-blue-500" // Default state
                  }`}
              >
                {/* ✅ Ensure text wraps properly */}
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-lg truncate ${selectedCoupon === coupon._id ? "text-gray-800" : "text-blue-700"}`}>
                    {coupon.name}{" "}
                    <span className="text-green-500 text-lg">{coupon.discount}%</span>
                  </p>
                  <p className="text-sm text-gray-600 break-all">
                    {coupon.productName}
                  </p>
                </div>

                {/* ✅ Ensure button stays aligned properly */}
                <button
                  onClick={() => handleSelectCoupon(coupon)}
                  className={`py-1 px-4 min-w-[80px] rounded text-sm transition-all duration-200 
                    ${
                      selectedCoupon === coupon._id
                        ? "bg-gray-600 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                  {selectedCoupon === coupon._id ? "Applied" : "Apply"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-2">
              No valid coupons available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponModal;
