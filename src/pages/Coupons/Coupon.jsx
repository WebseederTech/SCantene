import React, { useState } from "react";
import CouponList from "./CouponList";
import CouponForm from "./CouponForm";
import {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from "../../redux/api/coupenApiSlice";

const Coupon = () => {
  const { data: coupons = [], error, isLoading,refetch  } = useGetCouponsQuery();
  const [createCoupon] = useCreateCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Set up coupon for editing
  const editCoupon = (coupon) => {
    setCurrentCoupon(coupon);
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setCurrentCoupon(null);
    setIsEditing(false);
  };

  // Handle form submission (create or update)
  const handleSubmit = async (couponData) => {
    let success;
    try {
      if (isEditing && currentCoupon) {
        await updateCoupon({ id: currentCoupon._id, ...couponData }).unwrap();
      } else {
        await createCoupon(couponData).unwrap();
      }
      refetch();
      setCurrentCoupon(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save coupon", error);
    }
  };

  // Delete a coupon
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCoupon(id).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete coupon", error);
      }
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4">
        {/* <h1 className="text-3xl font-bold text-gray-900 mb-8">Coupon Management</h1> */}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Failed to load coupons
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CouponList
              coupons={coupons}
              onEdit={editCoupon}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <CouponForm
              coupon={currentCoupon}
              isEditing={isEditing}
              onSubmit={handleSubmit}
              onCancel={cancelEdit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coupon;
