import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";
import BankDetails from "../Admin/BankDetails";
import { useUpdateAddressMutation, useGetUserDetailsQuery } from "../../redux/api/usersApiSlice";
import { EditIcon } from "lucide-react";
import { use } from "react";

const Shipping = () => {
  const storedData = JSON.parse(localStorage.getItem("userData")) || {};
  const userId = storedData._id;
  
  // Fetch user details including addresses from API
  const { data: userData, isLoading, error } = useGetUserDetailsQuery(userId);
  console.log(userData,"dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  
  const existingData = JSON.parse(localStorage.getItem("checkOutData")) || {};
  const totalPrice = existingData.totalPrice || 0;

  // Get addresses from API data if available, otherwise fallback to localStorage
  const addresses = userData?.addresses || storedData.addresses || [];

  const [selectedAddress, setSelectedAddress] = useState(
    existingData.shippingAddress || null
  );
  const [paymentMethod, setPaymentMethod] = useState(
    existingData.paymentMethod || "PayPal"
  );
  const [isBankDetailsOpen, setIsBankDetailsOpen] = useState(false);

  // Edit address state
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateAddress, { isLoading: isSubmitting }] = useUpdateAddressMutation();

  // Update selectedAddress if it exists in localStorage but we get new address data from API
  useEffect(() => {
    if (userData?.addresses && selectedAddress) {
      const matchingAddress = userData.addresses.find(
        addr => addr._id === selectedAddress._id
      );
      if (matchingAddress) {
        setSelectedAddress(matchingAddress);
      }
    }
  }, [userData, selectedAddress]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!selectedAddress) {
      alert("Please select a shipping address.");
      return;
    }

    localStorage.setItem(
      "checkOutData",
      JSON.stringify({
        ...existingData,
        shippingAddress: selectedAddress,
        paymentMethod,
      })
    );

    // Uncomment if you want to save data to Redux:
    // dispatch(saveShippingAddress(selectedAddress));
    // dispatch(savePaymentMethod(paymentMethod));

    navigate("/placeorder");
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setIsBankDetailsOpen(e.target.value === "Bank Transfer");
  };

  const handleEditClick = (address) => {
    setIsEditing(true);
    setEditingAddress(address);
    setFormData({
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingAddress(null);
  };

  const updateAddressHandler = async (e) => {
    e.preventDefault();

    try {
      const addressId = editingAddress._id;

      // Use the RTK Query mutation
      const response = await updateAddress({
        userId,
        addressId,
        addressData: formData,
      }).unwrap();

      // Update local storage with the updated user data
      localStorage.setItem("userData", JSON.stringify(response.user));

      // If the selected address was the one updated, update it
      if (selectedAddress && selectedAddress._id === addressId) {
        setSelectedAddress({
          ...selectedAddress,
          ...formData,
        });
      }

      // Exit editing mode
      setIsEditing(false);
      setEditingAddress(null);

      // Show success message
      alert("Address updated successfully");
    } catch (error) {
      console.error("Error updating address:", error);
      alert(
        error.data?.message || "An error occurred while updating the address"
      );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto mt-10 px-4 md:px-8 text-center">
        <ProgressSteps step1 step2 />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-customBlue"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto mt-10 px-4 md:px-8 text-center">
        <ProgressSteps step1 step2 />
        <div className="mt-10 text-red-600">
          <p>Error loading your addresses. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 p-2 bg-customBlue text-white rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 px-4 md:px-8">
      <ProgressSteps step1 step2 />
      <div className="mt-10">
        <h1 className="text-2xl font-semibold text-center text-customBlue mb-6">
          {isEditing ? "Edit Delivery Address" : "Select Delivery Address"}
        </h1>

        {isEditing ? (
          <form
            onSubmit={updateAddressHandler}
            className="max-w-2xl mx-auto space-y-4"
          >
            <div className="space-y-3">
              <div>
                <label className="block text-gray-400 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 p-3 bg-customBlue text-white rounded-md transition duration-300 hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue disabled:bg-purple-300"
              >
                {isSubmitting ? "Updating..." : "Update Address"}
              </button>

              <button
                type="button"
                onClick={cancelEdit}
                className="flex-1 p-3 bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={submitHandler}
            className="max-w-3xl mx-auto space-y-6"
          >
            {/* Address Selection */}
            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className={`border-2 p-4 rounded-md cursor-pointer transition relative ${
                      selectedAddress && selectedAddress._id === addr._id
                        ? "border-customBlue dark:bg-gray-800 bg-gray-100"
                        : "border-gray-700 dark:bg-gray-900 bg-gray-200"
                    }`}
                    onClick={() => setSelectedAddress(addr)}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={
                        selectedAddress && selectedAddress._id === addr._id
                      }
                      readOnly
                    />
                    <h2 className="text-lg font-semibold textcolor">
                      {addr.address}
                    </h2>
                    <p className="text-sm dark:text-gray-400 text-black">
                      {addr.city}
                    </p>
                    <p className="text-sm dark:text-gray-400 text-black">
                      {addr.postalCode}, {addr.country}
                    </p>

                    <button
                      type="button"
                      className="absolute top-2 right-2 text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(addr);
                      }}
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-gray-500 mb-4">You don't have any saved addresses yet.</p>
                <button 
                  type="button"
                  onClick={() => navigate('/profile')} 
                  className="p-2 bg-customBlue text-white rounded-md"
                >
                  Add New Address
                </button>
              </div>
            )}

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">
                Select Payment Method
              </label>
              <div className="space-y-2">
                 <label className="inline-flex items-center">
                  {/* <input
                    type="radio"
                    className="form-radio text-customBlue"
                    name="paymentMethod"
                    value="RazorPay"
                    checked={paymentMethod === "RazorPay"}
                    onChange={handlePaymentMethodChange}
                  />
                  <span className="ml-2">RazorPay</span> */}
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-customBlue"
                    name="paymentMethod"
                    value="Bank Transfer"
                    checked={paymentMethod === "Bank Transfer"}
                    onChange={handlePaymentMethodChange}
                  />
                  <span className="ml-2">Bank Transfer</span>
                </label>
              </div>
            </div>

            <button
              className="w-full p-3 bg-customBlue text-white rounded-md transition duration-300 hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue disabled:bg-customBlue/60"
              type="submit"
              disabled={!selectedAddress}
            >
              Continue
            </button>
          </form>
        )}
      </div>

      {isBankDetailsOpen && (
        <BankDetails
          totalPrice={totalPrice}
          onClose={() => setIsBankDetailsOpen(false)}
        />
      )}
    </div>
  );
};

export default Shipping;