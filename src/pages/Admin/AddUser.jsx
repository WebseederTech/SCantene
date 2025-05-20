// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAddUserMutation } from "../../redux/api/usersApiSlice";

// const AddUser = () => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [contactNo, setContactNo] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [role, setRole] = useState("");
//   const [city, setCity] = useState("");
//   const [address, setAddress] = useState("");
//   const [postalCode, setPostalCode] = useState("");
//   const [country, setCountry] = useState("");
//   const [shopName, setShopName] = useState("");


//   const [addUser, { isLoading }] = useAddUserMutation();
//   const navigate = useNavigate();

//   const addAddress = () => {
//     setAddresses([
//       ...addresses,
//       { address: "", city: "", postalCode: "", country: "" },
//     ]);
//   };

//   const removeAddress = (index) => {
//     const updatedAddresses = [...addresses];
//     updatedAddresses.splice(index, 1);
//     setAddresses(updatedAddresses);
//   };

//   const handleAddressChange = (index, field, value) => {
//     const updatedAddresses = [...addresses];
//     updatedAddresses[index][field] = value;
//     setAddresses(updatedAddresses);
//   };
//   const submitHandler = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     // Use a fallback if addresses array is empty


//     try {
//       const response = await addUser({
//         username,
//         email,
//         contactNo,
//         password,
//         role,
//         shopName,
//         addresses: [
//           {
//             address,
//             city,
//             postalCode,
//             country,
//           },
//         ],
//       }).unwrap();

//       console.log("User Created Successfully", response);
//       alert("User added successfully!");
//       navigate("/admin/userlist");

//       // Reset form fields
//       setUsername("");
//       setEmail("");
//       setContactNo("");
//       setPassword("");
//       setConfirmPassword("");
//       setRole("");
//       setAddress("");
//       setCity("");
//       setPostalCode("");
//       setCountry("");
//       setShopName("")
//     } catch (error) {
//       console.error("Error adding user:", error);
//       alert(error?.data?.message || "Failed to add user");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center darktheme">
//       <section className="relative w-full max-w-2xl darktheme bg-opacity-50 rounded-lg shadow-lg p-8 border-2 border-gray-600">
//         <div className="relative z-10">
//           <h1 className="text-2xl font-semibold mb-6 text-center text-customBlue">
//             Add New User
//           </h1>
//           <form onSubmit={submitHandler} className="space-y-6">
//             <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
//               <div className="flex-1">
//                 <label htmlFor="name" className="text-sm font-medium darkthemeinput">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   required
//                   placeholder="Enter your name"
//                   className="p-3 border border-gray-700 darkthemeinput rounded-md w-full  focus:outline-none focus:ring-2 focus:ring-customBlue"
//                 />
//               </div>

//               <div className="flex-1">
//                 <label htmlFor="shopName" className="text-sm font-medium darkthemeinput">
//                   Shop Name
//                 </label>
//                 <input
//                   type="text"
//                   id="shopName"
//                   value={shopName}
//                   onChange={(e) => setShopName(e.target.value)}
//                   placeholder="Enter your shop name"
//                   className="p-3 border border-gray-700 darkthemeinput rounded-md w-full  focus:outline-none focus:ring-2 focus:ring-customBlue"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
//               <div className="flex-1">
//                 <label htmlFor="email" className="text-sm font-medium darkthemeinput">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   placeholder="Enter your email"
//                   className="p-3 border border-gray-700 darkthemeinput rounded-md w-full  focus:outline-none focus:ring-2 focus:ring-customBlue"
//                 />
//               </div>

//               <div className="flex-1">
//                 <label htmlFor="contactNo" className="text-sm font-medium darkthemeinput">
//                   Contact Number
//                 </label>
//                 <input
//                   type="tel"
//                   id="contactNo"
//                   value={contactNo}
//                   onChange={(e) => setContactNo(e.target.value)}
//                   required
//                   placeholder="Enter your contact number"
//                   className="p-3 border border-gray-700 darkthemeinput rounded-md w-full  focus:outline-none focus:ring-2 focus:ring-customBlue"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
//               <div className="flex-1">
//                 <label htmlFor="password" className="text-sm font-medium darkthemeinput0">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   placeholder="Enter your password"
//                   className="p-3 border border-gray-700 darkthemeinput rounded-md w-full  focus:outline-none focus:ring-2 focus:ring-customBlue"
//                 />
//               </div>

//               <div className="flex-1">
//                 <label htmlFor="confirmPassword" className="text-sm font-medium darkthemeinput">
//                   Confirm Password
//                 </label>
//                 <input
//                   type="password"
//                   id="confirmPassword"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   required
//                   placeholder="Confirm your password"
//                   className="p-3 border border-gray-700 darkthemeinput rounded-md w-full  focus:outline-none focus:ring-2 focus:ring-customBlue"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
//               <div className="flex-1">
//                 <label htmlFor="role" className="text-sm font-medium darkthemeinput">
//                   Role
//                 </label>
//                 <select
//                   id="role"
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                   required
//                   className="p-3 border border-gray-700 darkthemeinput rounded-md w-full  focus:outline-none focus:ring-2 focus:ring-customBlue"
//                 >
//                   <option value="" disabled>
//                     Select Role
//                   </option>
//                   <option value="Inventory">Inventory</option>
//                   <option value="Accounts">Accounts</option>
//                   <option value="Seller">Seller</option>
//                   <option value="Buyer">Buyer</option>
//                   <option value="Salesman">Salesman</option>
//                 </select>
//               </div>

//               <div className="flex-1">
//                 <label htmlFor="address" className="text-sm font-medium darkthemeinput">
//                   Address
//                 </label>
//                 <input
//                   type="text"
//                   id="address"
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                   placeholder="Enter your address"
//                   className="p-3 border border-gray-700 darkthemeinput rounded-md w-full  focus:outline-none focus:ring-2 focus:ring-customBlue"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
//               <div className="flex-1">
//                 <label htmlFor="city" className="text-sm font-medium darkthemeinput">
//                   City
//                 </label>
//                 <input
//                   type="text"
//                   id="city"
//                   value={city}
//                   onChange={(e) => setCity(e.target.value)}
//                   placeholder="Enter your city"
//                   className="p-3 border border-gray-700 darkthemeinput rounded-md w-full  focus:outline-none focus:ring-2 focus:ring-customBlue"
//                 />
//               </div>

//               <div className="flex-1">
//                 <label htmlFor="postalCode" className="text-sm font-medium darkthemeinput">
//                   Postal Code
//                 </label>
//                 <input
//                   type="text"
//                   id="postalCode"
//                   value={postalCode}
//                   onChange={(e) => setPostalCode(e.target.value)}
//                   placeholder="Enter your postal code"
//                   className="p-3 border border-gray-700 darkthemeinput rounded-md w-full  focus:outline-none focus:ring-2 focus:ring-customBlue"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
//               <div className="flex-1">
//                 <label htmlFor="country" className="text-sm font-medium darkthemeinput">
//                   Country
//                 </label>
//                 <input
//                   type="text"
//                   id="country"
//                   value={country}
//                   onChange={(e) => setCountry(e.target.value)}
//                   placeholder="Enter your country"
//                   className="p-3 border border-gray-700 darkthemeinput rounded-md w-full  focus:outline-none focus:ring-2 focus:ring-customBlue"
//                 />
//               </div>

//               <div className="flex-1"></div>
//             </div>

//             <button
//               type="submit"
//               className={`w-full p-3 bg-customBlue text-white rounded-md mt-4 transition duration-300 hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue disabled:bg-purple-300`}
//               disabled={isLoading}
//             >
//               {isLoading ? "Adding User..." : "Add User"}
//             </button>
//           </form>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default AddUser;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddUserMutation } from "../../redux/api/usersApiSlice";
import { FaUserPlus, FaStore, FaEnvelope, FaPhone, FaLock, FaUserTag, FaMapMarkerAlt, FaCity, FaMailBulk, FaGlobe } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import AdminMenu from "./AdminMenu";

const AddUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [shopName, setShopName] = useState("");
  const [formError, setFormError] = useState(null);

  const [addUser, { isLoading }] = useAddUserMutation();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (password !== confirmPassword) {
      setFormError("Passwords do not match!");
      return;
    }

    try {
      const response = await addUser({
        username,
        email,
        contactNo,
        password,
        role,
        shopName,
        addresses: [
          {
            address,
            city,
            postalCode,
            country,
          },
        ],
      }).unwrap();

      console.log("User Created Successfully", response);
      navigate("/admin/userlist");

      // Reset form fields
      setUsername("");
      setEmail("");
      setContactNo("");
      setPassword("");
      setConfirmPassword("");
      setRole("");
      setAddress("");
      setCity("");
      setPostalCode("");
      setCountry("");
      setShopName("");
      
    } catch (error) {
      console.error("Error adding user:", error);
      setFormError(error?.data?.message || "Failed to add user");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* <AdminMenu /> */}
        <div className="w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Add New User</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Create a new user account with role-based permissions
              </p>
            </div>
            
            <div className="px-6 py-5">
              {formError && <Message variant="danger">{formError}</Message>}
              
              <form onSubmit={submitHandler} className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600">
                  <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <FaUserPlus className="mr-2" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter full name"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Shop Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaStore className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="shopName"
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          placeholder="Enter shop name (if applicable)"
                          className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="Enter email address"
                          className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="contactNo"
                          value={contactNo}
                          onChange={(e) => setContactNo(e.target.value)}
                          required
                          placeholder="Enter contact number"
                          className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600">
                  <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <FaLock className="mr-2" />
                    Security & Role
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="Enter password"
                          className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          placeholder="Confirm password"
                          className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Role
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUserTag className="text-gray-400" />
                        </div>
                        <select
                          id="role"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          required
                          className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="" disabled>Select Role</option>
                          <option value="Inventory">Inventory</option>
                          <option value="Accounts">Accounts</option>
                          <option value="Seller">Seller</option>
                          <option value="Buyer">Buyer</option>
                          <option value="Salesman">Salesman</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600">
                  <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    Address Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Street Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaMapMarkerAlt className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter street address"
                          className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        City
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCity className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Enter city"
                          className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Postal Code
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaMailBulk className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="postalCode"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="Enter postal code"
                          className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Country
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaGlobe className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="Enter country"
                          className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400 flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader size="sm" className="mr-2" /> Processing...
                      </>
                    ) : (
                      <>
                        <FaUserPlus className="mr-2" /> Add User
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;