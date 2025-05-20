import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Loader from "../../components/Loader";
import {
  useAddAddressesMutation,
  useProfileMutation,
  useUpdateAlterContactMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetUserDetailsQuery,
  useSubmitBugReportMutation,
} from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiRefreshCcw,
  FiEdit,
  FiTrash,
  FiX,
  FiFile,
} from "react-icons/fi";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [alternativeContactNo, setAlternativeContact] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [showBugReportModal, setShowBugReportModal] = useState(false);
  const [bugDescription, setBugDescription] = useState("");
  const [bugScreenshot, setBugScreenshot] = useState(null);
  const [screenshotName, setScreenshotName] = useState("");
  const [isSubmittingBug, setIsSubmittingBug] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo._id; // Get user ID from Redux store instead of localStorage
  const role = userInfo.role;
  console.log(role, "role");

  // Fetch user details using the query
  const {
    data: userDetails,
    isLoading: isLoadingUserDetails,
    error: userDetailsError,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
  const [updateAlterContact] = useUpdateAlterContactMutation();
  const [addAddresses] = useAddAddressesMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [submitBugReport] = useSubmitBugReportMutation();

  useEffect(() => {
    // Populate data from the query result when it's available
    if (userDetails) {
      setUserName(userDetails.username);
      setEmail(userDetails.email);
      setAddresses(userDetails.addresses || []);
      setAlternativeContact(userDetails.alternativeContactNo || "");
    }
  }, [userDetails]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userId,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
        refetch(); // Refetch user details to get the latest data
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleSaveAlternativeContact = async () => {
    try {
      const res = await updateAlterContact({
        userId,
        alternativeContactNo,
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      toast.success("Contact number updated successfully");
      refetch(); // Refetch user details
    } catch (err) {
      toast.error(
        err?.data?.message || err.error || "Failed to update contact"
      );
    } finally {
      setShowModal(false);
    }
  };

  // Handle new address input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    if (isEditingAddress) {
      setEditingAddress((prevAddress) => ({
        ...prevAddress,
        [name]: value,
      }));
    } else {
      setNewAddress((prevAddress) => ({
        ...prevAddress,
        [name]: value,
      }));
    }
  };

  // Add a new address
  const handleAddAddress = () => {
    if (
      newAddress.address.trim() &&
      newAddress.city.trim() &&
      newAddress.postalCode.trim() &&
      newAddress.country.trim()
    ) {
      setAddresses((prev) => [...prev, newAddress]);
      setNewAddress({
        address: "",
        city: "",
        postalCode: "",
        country: "",
      });
      setIsAddingAddress(false);
    } else {
      toast.error("Please fill out all address fields.");
    }
  };

  const handleSaveAddresses = async () => {
    try {
      const response = await addAddresses({
        addresses,
        userId: userId,
      }).unwrap();
      if (response.error) {
        toast.error("Failed to add addresses");
      } else {
        toast.success("Addresses added successfully");
        setIsAddingAddress(false);
        setNewAddress({ address: "", city: "", postalCode: "", country: "" });
        refetch(); // Refetch user details to get updated addresses
      }
    } catch (error) {
      toast.error("An error occurred while adding addresses");
    }
  };

  // Start editing an address
  const handleEditAddress = (address, index) => {
    setEditingAddress({ ...address, index });
    setIsEditingAddress(true);
  };

  // Save edited address
  const handleUpdateAddress = async () => {
    if (
      editingAddress.address.trim() &&
      editingAddress.city.trim() &&
      editingAddress.postalCode.trim() &&
      editingAddress.country.trim()
    ) {
      try {
        const addressId = editingAddress._id;
        if (!addressId) {
          // If it's a local address without an ID, just update the state
          const updatedAddresses = [...addresses];
          updatedAddresses[editingAddress.index] = {
            address: editingAddress.address,
            city: editingAddress.city,
            postalCode: editingAddress.postalCode,
            country: editingAddress.country,
          };
          setAddresses(updatedAddresses);
        } else {
          // If it has an ID, update via API
          const response = await updateAddress({
            userId,
            addressId,
            addressData: {
              address: editingAddress.address,
              city: editingAddress.city,
              postalCode: editingAddress.postalCode,
              country: editingAddress.country,
            },
          }).unwrap();

          if (response.addresses) {
            setAddresses(response.addresses);
            dispatch(
              setCredentials({ ...userInfo, addresses: response.addresses })
            );
          }
          toast.success("Address updated successfully");
          refetch(); // Refetch user details to get updated addresses
        }
      } catch (error) {
        toast.error("Failed to update address");
      } finally {
        setIsEditingAddress(false);
        setEditingAddress(null);
      }
    } else {
      toast.error("Please fill out all address fields.");
    }
  };

  // Delete an address
  const handleDeleteAddress = async (addressId, index) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        if (!addressId) {
          // If it's a local address without an ID, just remove from state
          const updatedAddresses = addresses.filter((_, i) => i !== index);
          setAddresses(updatedAddresses);
        } else {
          // If it has an ID, delete via API
          const response = await deleteAddress({
            userId,
            addressId,
          }).unwrap();

          if (response.addresses) {
            setAddresses(response.addresses);
            dispatch(
              setCredentials({ ...userInfo, addresses: response.addresses })
            );
          }
          toast.success("Address deleted successfully");
          refetch(); // Refetch user details to get updated addresses
        }
      } catch (error) {
        toast.error("Failed to delete address");
      }
    }
  };

  // Handle bug report submission
  const handleSubmitBugReport = async () => {
    if (!bugDescription.trim()) {
      toast.error("Please provide a description of the bug");
      return;
    }

    setIsSubmittingBug(true);

    try {
      const formData = new FormData();
      formData.append("description", bugDescription);
      if (bugScreenshot) {
        formData.append("screenshot", bugScreenshot);
      }

      await submitBugReport({ formData }).unwrap();
      toast.success("Bug report submitted successfully");
      setShowBugReportModal(false);
      setBugDescription("");
      setBugScreenshot(null);
      setScreenshotName("");
    } catch (error) {
      toast.error("Failed to submit bug report");
    } finally {
      setIsSubmittingBug(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBugScreenshot(file);
      setScreenshotName(file.name);
    }
  };

  if (isLoadingUserDetails) {
    return <Loader />;
  }

  if (userDetailsError) {
    return (
      <div className="text-center p-5 text-red-500">
        Error loading user data. Please try refreshing the page.
      </div>
    );
  }

  return (
    // <div className="flex items-center justify-center darktheme">
    //   <section className="relative w-full max-w-2xl darktheme bg-opacity-50 rounded-lg shadow-lg p-8 border-2 border-gray-600">
    //     <div className="relative z-10">
    //       <div className="flex justify-between items-center mb-6">
    //         <h2 className="text-2xl font-semibold text-customBlue">
    //           Update Profile
    //         </h2>
    //         {role === "Buyer" && (
    //           <button
    //             onClick={() => setShowBugReportModal(true)}
    //             className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300"
    //           >
    //             {/* <FiBug className="w-5 h-5" /> */}
    //             Report a Bug
    //           </button>
    //         )}
    //       </div>

    //       <form onSubmit={submitHandler} className="space-y-6">
    //         <div className="flex space-x-4">
    //           <div className="flex flex-col space-y-2 w-1/2">
    //             <label
    //               htmlFor="username"
    //               className="text-sm font-medium darklabel"
    //             >
    //               Name
    //             </label>
    //             <input
    //               type="text"
    //               id="username"
    //               className="p-3 border-2 border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
    //               placeholder="Enter your name"
    //               value={username}
    //               onChange={(e) => setUserName(e.target.value)}
    //             />
    //           </div>

    //           <div className="flex flex-col space-y-2 w-1/2">
    //             <label
    //               htmlFor="email"
    //               className="text-sm font-medium darklabel"
    //             >
    //               Email Address
    //             </label>
    //             <input
    //               type="email"
    //               id="email"
    //               className="p-3 border-2 border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
    //               placeholder="Enter your email"
    //               value={email}
    //               onChange={(e) => setEmail(e.target.value)}
    //             />
    //           </div>
    //         </div>

    //         <div className="flex space-x-4">
    //           <div className="flex flex-col space-y-2 w-1/2">
    //             <label
    //               htmlFor="password"
    //               className="text-sm font-medium darklabel"
    //             >
    //               Password
    //             </label>
    //             <input
    //               type="password"
    //               id="password"
    //               className="p-3 border-2 border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
    //               placeholder="Enter your password"
    //               value={password}
    //               onChange={(e) => setPassword(e.target.value)}
    //             />
    //           </div>

    //           <div className="flex flex-col space-y-2 w-1/2">
    //             <label
    //               htmlFor="confirmPassword"
    //               className="text-sm font-medium darklabel"
    //             >
    //               Confirm Password
    //             </label>
    //             <input
    //               type="password"
    //               id="confirmPassword"
    //               className="p-3 border-2 border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
    //               placeholder="Confirm your password"
    //               value={confirmPassword}
    //               onChange={(e) => setConfirmPassword(e.target.value)}
    //             />
    //           </div>
    //         </div>

    //         <button
    //           type="button"
    //           onClick={() => setShowModal(true)}
    //           className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-lg px-6 py-2 mx-auto mt-4 transition duration-300 hover:from-gray-400 hover:to-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
    //         >
    //           <FiPlus className="w-5 h-5" />
    //           Alternative Contact No
    //         </button>

    //         <button
    //           type="submit"
    //           className={`w-full p-3 bg-customBlue text-white rounded-md mt-4 transition duration-300 hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue disabled:bg-purple-300`}
    //           disabled={loadingUpdateProfile}
    //         >
    //           {loadingUpdateProfile ? (
    //             <>
    //               <FiRefreshCcw className="animate-spin w-5 h-5 inline-block mr-2" />
    //               Updating...
    //             </>
    //           ) : (
    //             <>
    //               <FiRefreshCcw className="w-5 h-5 inline-block mr-2" />
    //               Update Profile
    //             </>
    //           )}
    //         </button>

    //         {loadingUpdateProfile && <Loader />}
    //       </form>

    //       <div className="mt-6">
    //         <h3 className="text-lg text-customBlue font-medium mb-4">
    //           Addresses
    //         </h3>
    //         {addresses.map((addr, index) => (
    //           <div
    //             key={index}
    //             className="dark:bg-gray-900 bg-gray-200 p-4 rounded-lg mb-2 relative"
    //           >
    //             <div className="flex justify-between">
    //               <div>
    //                 <p className="dark:text-gray-300 text-black">
    //                   Address: {addr.address}
    //                 </p>
    //                 <p className="dark:text-gray-300 text-black">
    //                   City: {addr.city}
    //                 </p>
    //                 <p className="dark:text-gray-300 text-black">
    //                   Postal Code: {addr.postalCode}
    //                 </p>
    //                 <p className="dark:text-gray-300 text-black">
    //                   Country: {addr.country}
    //                 </p>
    //               </div>
    //               <div className="space-y-2">
    //                 <button
    //                   onClick={() => handleEditAddress(addr, index)}
    //                   className="p-2 bg-customBlue text-white rounded-md hover:bg-customBlue mr-2"
    //                 >
    //                   <FiEdit />
    //                 </button>
    //                 <button
    //                   onClick={() => handleDeleteAddress(addr._id, index)}
    //                   className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
    //                 >
    //                   <FiTrash />
    //                 </button>
    //               </div>
    //             </div>
    //           </div>
    //         ))}

    //         {isEditingAddress ? (
    //           <div className="space-y-4 mt-4">
    //             <input
    //               type="text"
    //               name="address"
    //               placeholder="Address"
    //               value={editingAddress.address}
    //               onChange={handleAddressChange}
    //               className="p-3 border-2 border-gray-700 darkthemeinput rounded-md w-full"
    //             />
    //             <input
    //               type="text"
    //               name="city"
    //               placeholder="City"
    //               value={editingAddress.city}
    //               onChange={handleAddressChange}
    //               className="p-3 border-2 border-gray-700 darkthemeinput rounded-md w-full"
    //             />
    //             <input
    //               type="text"
    //               name="postalCode"
    //               placeholder="Postal Code"
    //               value={editingAddress.postalCode}
    //               onChange={handleAddressChange}
    //               className="p-3 border-2 border-gray-700 darkthemeinput rounded-md w-full"
    //             />
    //             <input
    //               type="text"
    //               name="country"
    //               placeholder="Country"
    //               value={editingAddress.country}
    //               onChange={handleAddressChange}
    //               className="p-3 border-2 border-gray-700 darkthemeinput rounded-md w-full"
    //             />
    //             <div className="flex justify-between items-center">
    //               <button
    //                 type="button"
    //                 onClick={handleUpdateAddress}
    //                 className="bg-customBlue text-white rounded-lg px-6 py-2 transition duration-300 hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue"
    //               >
    //                 Update Address
    //               </button>
    //               <button
    //                 type="button"
    //                 onClick={() => {
    //                   setIsEditingAddress(false);
    //                   setEditingAddress(null);
    //                 }}
    //                 className="px-6 py-2 text-gray-300 bg-gray-700 rounded-lg transition duration-300 hover:bg-gray-600 focus:outline-none"
    //               >
    //                 Cancel
    //               </button>
    //             </div>
    //           </div>
    //         ) : isAddingAddress ? (
    //           <div className="space-y-4 mt-4">
    //             <input
    //               type="text"
    //               name="address"
    //               placeholder="Address"
    //               value={newAddress.address}
    //               onChange={handleAddressChange}
    //               className="p-3 border-2 border-gray-700 darkthemeinput rounded-md w-full"
    //             />
    //             <input
    //               type="text"
    //               name="city"
    //               placeholder="City"
    //               value={newAddress.city}
    //               onChange={handleAddressChange}
    //               className="p-3 border-2 border-gray-700 darkthemeinput rounded-md w-full"
    //             />
    //             <input
    //               type="text"
    //               name="postalCode"
    //               placeholder="Postal Code"
    //               value={newAddress.postalCode}
    //               onChange={handleAddressChange}
    //               className="p-3 border-2 border-gray-700 darkthemeinput rounded-md w-full"
    //             />
    //             <input
    //               type="text"
    //               name="country"
    //               placeholder="Country"
    //               value={newAddress.country}
    //               onChange={handleAddressChange}
    //               className="p-3 border-2 border-gray-700 darkthemeinput rounded-md w-full"
    //             />
    //             <div className="flex justify-between items-center">
    //               <button
    //                 type="button"
    //                 onClick={handleAddAddress}
    //                 className="bg-customBlue text-white rounded-lg px-6 py-2 transition duration-300 hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue"
    //               >
    //                 Save Address
    //               </button>
    //               <button
    //                 type="button"
    //                 onClick={() => setIsAddingAddress(false)}
    //                 className="px-6 py-2 text-gray-300 bg-gray-700 rounded-lg transition duration-300 hover:bg-gray-600 focus:outline-none"
    //               >
    //                 Cancel
    //               </button>
    //             </div>
    //           </div>
    //         ) : (
    //           <button
    //             type="button"
    //             onClick={() => setIsAddingAddress(true)}
    //             className="mt-1 bg-customBlue text-white rounded-lg px-6 py-2 transition duration-300 hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue"
    //           >
    //             <FiPlus className="w-5 h-5 inline-block mr-2" />
    //             Address
    //           </button>
    //         )}

    //         <button
    //           type="button"
    //           onClick={handleSaveAddresses}
    //           className="mt-4 w-full p-3 bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
    //         >
    //           Save Addresses
    //         </button>
    //       </div>
    //     </div>

    //     {/* Alternative Contact Modal */}
    //     {showModal && (
    //       <div
    //         className="fixed inset-0 flex items-center justify-center z-50"
    //         onClick={() => setShowModal(false)}
    //       >
    //         <div
    //           className="bg-black bg-opacity-70 fixed inset-0"
    //           onClick={(e) => e.stopPropagation()}
    //         ></div>
    //         <div
    //           className="darkthemeinput rounded-lg p-8 w-full max-w-md space-y-4 z-10"
    //           onClick={(e) => e.stopPropagation()}
    //         >
    //           <h2 className="text-2xl font-semibold text-center mb-4">
    //             Update Alternative Contact Number
    //           </h2>
    //           <input
    //             type="text"
    //             value={alternativeContactNo}
    //             onChange={(e) => setAlternativeContact(e.target.value)}
    //             className="p-3 border-2 border-gray-600 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
    //             placeholder="Enter alternative contact number"
    //           />
    //           <div className="flex justify-between">
    //             <button
    //               onClick={handleSaveAlternativeContact}
    //               className="p-3 bg-customBlue text-white rounded-md transition duration-300 hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue"
    //             >
    //               Save
    //             </button>
    //             <button
    //               onClick={() => setShowModal(false)}
    //               className="p-3 text-gray-300 bg-gray-700 rounded-md transition duration-300 hover:bg-gray-600 focus:outline-none"
    //             >
    //               Cancel
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     )}

    //     {/* Bug Report Modal */}
    //     {showBugReportModal && (
    //       <div
    //         className="fixed inset-0 flex items-center justify-center z-50"
    //         onClick={() => setShowBugReportModal(false)}
    //       >
    //         <div
    //           className="bg-black bg-opacity-70 fixed inset-0"
    //           onClick={(e) => e.stopPropagation()}
    //         ></div>
    //         <div
    //           className="darkthemeinput rounded-lg p-8 w-full max-w-xl space-y-4 z-10"
    //           onClick={(e) => e.stopPropagation()}
    //         >
    //           <div className="flex justify-between items-center">
    //             <h2 className="text-2xl font-semibold mb-4 text-customBlue">
    //               Report a Bug
    //             </h2>
    //             <button
    //               onClick={() => setShowBugReportModal(false)}
    //               className="text-gray-400 hover:text-gray-200 p-1"
    //             >
    //               <FiX className="w-6 h-6" />
    //             </button>
    //           </div>

    //           <div className="space-y-4">
    //             <div>
    //               <label className="block text-sm font-medium darklabel mb-2">
    //                 Bug Description
    //               </label>
    //               <textarea
    //                 value={bugDescription}
    //                 onChange={(e) => setBugDescription(e.target.value)}
    //                 className="p-3 border-2 border-gray-600 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue min-h-32"
    //                 placeholder="Please describe the bug in detail..."
    //               ></textarea>
    //             </div>

    //             <div>
    //               <label className="block text-sm font-medium darklabel mb-2">
    //                 Screenshot (Optional)
    //               </label>
    //               <div className="flex items-center justify-center w-full">
    //                 <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-all">
    //                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
    //                     <FiFile className="w-8 h-8 mb-2 text-gray-400" />
    //                     {screenshotName ? (
    //                       <p className="text-sm text-gray-300">
    //                         {screenshotName}
    //                       </p>
    //                     ) : (
    //                       <>
    //                         <p className="mb-2 text-sm text-gray-400">
    //                           <span className="font-semibold">
    //                             Click to upload
    //                           </span>{" "}
    //                           or drag and drop
    //                         </p>
    //                         <p className="text-xs text-gray-400">
    //                           PNG, JPG or GIF (MAX. 2MB)
    //                         </p>
    //                       </>
    //                     )}
    //                   </div>
    //                   <input
    //                     type="file"
    //                     className="hidden"
    //                     accept="image/png, image/jpeg, image/gif"
    //                     onChange={handleFileChange}
    //                   />
    //                 </label>
    //               </div>
    //             </div>
    //           </div>

    //           <button
    //             onClick={handleSubmitBugReport}
    //             disabled={isSubmittingBug}
    //             className="w-full p-3 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 flex items-center justify-center gap-2"
    //           >
    //             {isSubmittingBug ? (
    //               <>
    //                 <FiRefreshCcw className="animate-spin w-5 h-5" />
    //                 Submitting...
    //               </>
    //             ) : (
    //               <>
    //                 {/* <FiBug className="w-5 h-5" /> */}
    //                 Submit Bug Report
    //               </>
    //             )}
    //           </button>
    //         </div>
    //       </div>
    //     )}
    //   </section>
    // </div>
    
    
     <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Update Profile</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage your personal information and addresses
                </p>
              </div>
              {role === "Buyer" && (
                <button
                  onClick={() => setShowBugReportModal(true)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300"
                >
                  Report a Bug
                </button>
              )}
            </div>
          </div>

          <div className="px-6 py-5">
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <FiPlus className="w-5 h-5" />
                  Alternative Contact No
                </button>
              </div>

              <button
                type="submit"
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
                disabled={loadingUpdateProfile}
              >
                {loadingUpdateProfile ? (
                  <div className="flex items-center justify-center">
                    <FiRefreshCcw className="animate-spin w-5 h-5 mr-2" />
                    Updating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <FiRefreshCcw className="w-5 h-5 mr-2" />
                    Update Profile
                  </div>
                )}
              </button>

              {loadingUpdateProfile && <Loader />}
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  Addresses
                </h3>
              </div>
              
              <div className="space-y-4">
                {addresses.map((addr, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 flex-grow">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Address:</span> {addr.address}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium">City:</span> {addr.city}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Postal Code:</span> {addr.postalCode}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Country:</span> {addr.country}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleEditAddress(addr, index)}
                          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr._id, index)}
                          className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          <FiTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {isEditingAddress ? (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4 border border-gray-200 dark:border-gray-600">
                  <h4 className="text-md font-medium text-gray-800 dark:text-white mb-4">Edit Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={editingAddress.address}
                      onChange={handleAddressChange}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={editingAddress.city}
                      onChange={handleAddressChange}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={editingAddress.postalCode}
                      onChange={handleAddressChange}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={editingAddress.country}
                      onChange={handleAddressChange}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <button
                      type="button"
                      onClick={handleUpdateAddress}
                      className="bg-blue-600 text-white rounded-md px-6 py-2 transition duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Update Address
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingAddress(false);
                        setEditingAddress(null);
                      }}
                      className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : isAddingAddress ? (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4 border border-gray-200 dark:border-gray-600">
                  <h4 className="text-md font-medium text-gray-800 dark:text-white mb-4">Add New Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={newAddress.address}
                      onChange={handleAddressChange}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={handleAddressChange}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={newAddress.postalCode}
                      onChange={handleAddressChange}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={newAddress.country}
                      onChange={handleAddressChange}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <button
                      type="button"
                      onClick={handleAddAddress}
                      className="bg-blue-600 text-white rounded-md px-6 py-2 transition duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(true)}
                    className="bg-blue-600 text-white rounded-md px-6 py-2 transition duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <FiPlus className="w-5 h-5 inline-block mr-2" />
                    Add New Address
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveAddresses}
                className="mt-6 w-full p-3 bg-gray-600 text-white rounded-md transition duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Save All Addresses
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-70 fixed inset-0" onClick={() => setShowModal(false)}></div>
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md space-y-4 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Update Alternative Contact
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alternative Contact Number
              </label>
              <input
                type="text"
                value={alternativeContactNo}
                onChange={(e) => setAlternativeContact(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter alternative contact number"
              />
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={handleSaveAlternativeContact}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bug Report Modal */}
      {showBugReportModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-70 fixed inset-0" onClick={() => setShowBugReportModal(false)}></div>
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-xl space-y-4 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Report a Bug
              </h2>
              <button
                onClick={() => setShowBugReportModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bug Description
                </label>
                <textarea
                  value={bugDescription}
                  onChange={(e) => setBugDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
                  placeholder="Please describe the bug in detail..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Screenshot (Optional)
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiFile className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                      {screenshotName ? (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {screenshotName}
                        </p>
                      ) : (
                        <>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG or GIF (MAX. 2MB)
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg, image/gif"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmitBugReport}
              disabled={isSubmittingBug}
              className="w-full p-3 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-70 mt-4"
            >
              {isSubmittingBug ? (
                <div className="flex items-center justify-center">
                  <FiRefreshCcw className="animate-spin w-5 h-5 mr-2" />
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Submit Bug Report
                </div>
              )}
            </button>
          </div>
        </div>
      )}
    </div>

  );
};

export default Profile;
