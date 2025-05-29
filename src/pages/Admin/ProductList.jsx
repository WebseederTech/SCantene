// import { AiFillCloseCircle } from "react-icons/ai";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   useCreateProductMutation,
//   useGetCouponCodeQuery,
//   useUploadProductImageMutation,
// } from "../../redux/api/productApiSlice";
// import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
// import { toast } from "react-toastify";
// import AdminMenu from "./AdminMenu";
// import { useFetchBrandsQuery } from "../../redux/api/brandApiSlice";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { useSelector } from "react-redux";
// import { FiPlus, FiMinus } from "react-icons/fi";
// import { BASE_URL } from "../../redux/constants";
// import { io } from "socket.io-client";
// import CouponSelector from "./CouponSelector";

// const ProductList = () => {
//   const [image, setImage] = useState("");
//   const [images, setImages] = useState([]);
//   const [imageFiles, setImageFiles] = useState([]); // Store files to preview & upload

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [mrp, setMrp] = useState("");
//   const [offerPrice, setOfferPrice] = useState("");
//   const [category, setCategory] = useState("");
//   // const [quantity, setQuantity] = useState("");
//   const [brand, setBrand] = useState("");
//   const [stock, setStock] = useState(0);
//   const [imageUrls, setImageUrls] = useState([]);
//   const [slabs, setSlabs] = useState([
//     { minQuantity: "", maxQuantity: "", price: "", couponId: "", expire: "" },
//   ]);

//   const [aboutTheBrand, setAboutTheBrand] = useState("");
//   const [specification, setSpecification] = useState("");
//   const [lowStockThreshold, setLowStockThreshold] = useState("");
//   const [errors, setErrors] = useState({});
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     mrp: "",
//     offerPrice: "",
//     category: "",
//     brand: "",
//     stock: "",
//     aboutTheBrand: "",
//     specification: "",
//     createdBy: "",
//     lowStockThreshold: "",
//     imageUrls: [],
//     coupons: [], // Initialize the coupons array
//     slabs: [
//       { minQuantity: "", maxQuantity: "", price: "", couponId: "", expire: "" },
//     ],
//     height: "",
//     weight: "",
//     breadth: "",
//     width: "",
//     tax: "",
//     shippingRate: "",
//   });
//   const socket = io(`${BASE_URL}`);

//   const navigate = useNavigate();

//   const [uploadProductImage] = useUploadProductImageMutation();
//   const [createProduct] = useCreateProductMutation();
//   const { data: categories } = useFetchCategoriesQuery();
//   const { data: brands } = useFetchBrandsQuery();
//   const { data: coupons } = useGetCouponCodeQuery();

//   const user = useSelector((state) => state.auth);
//   const createdBy = user.userInfo._id;

//   useEffect(() => {
//     const savedData = localStorage.getItem("productFormData");
//     if (savedData) {
//       setFormData(JSON.parse(savedData));
//     }
//   }, []);
//   useEffect(() => {
//     socket.on("productAdded", (newProduct) => {
//       console.log("New Product Added:", newProduct);
//       // Refresh product list or update state
//     });

//     socket.on("productUpdated", (updatedProduct) => {
//       console.log("Product Updated:", updatedProduct);
//       // Refresh product list or update state
//     });

//     socket.on("productDeleted", (deletedProduct) => {
//       console.log("Product Deleted:", deletedProduct);
//       // Refresh product list or update state
//     });

//     return () => {
//       socket.off("productAdded");
//       socket.off("productUpdated");
//       socket.off("productDeleted");
//     };
//   }, []);

//   // Update local storage whenever formData changes

//   useEffect(() => {
//     localStorage.setItem("productFormData", JSON.stringify(formData));
//   }, [formData]);
//   useEffect(() => {
//     if (user?.userInfo?._id) {
//       setFormData((prevState) => ({
//         ...prevState,
//         createdBy: user.userInfo._id,
//       }));
//     }
//   }, [user]);

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   try {
//   //     const productData = new FormData();

//   //     // Ensure `imageUrls` is an array and append each image URL to the productData
//   //     formData.imageUrls.forEach((url, index) => {
//   //       productData.append(`imageUrls[${index}]`, url); // Append image URLs as array format
//   //     });

//   //     // Append other product details to the productData
//   //     productData.append("name", formData.name);
//   //     productData.append("description", formData.description);
//   //     productData.append("mrp", formData.mrp);
//   //     productData.append("offerPrice", formData.offerPrice);
//   //     productData.append("category", formData.category);
//   //     productData.append("brand", formData.brand);
//   //     productData.append("countInStock", formData.stock);
//   //     productData.append("aboutTheBrand", formData.aboutTheBrand);
//   //     productData.append("specification", formData.specification);
//   //     productData.append("createdBy", formData.createdBy);
//   //     productData.append("lowStockThreshold", formData.lowStockThreshold);
//   //     productData.append("createdBy", formData.createdBy);

//   //     productData.append("height", formData.height);
//   //     productData.append("width", formData.width);
//   //     productData.append("weight", formData.weight);
//   //     productData.append("breadth", formData.breadth);
//   //     productData.append("tax", formData.tax);
//   //     productData.append("shippingRate", formData.shippingRate);

//   //     // Append slabs
//   //     // formData.slabs.forEach((slab, index) => {
//   //     //   productData.append(`slabs[${index}][minQuantity]`, slab.minQuantity);
//   //     //   productData.append(`slabs[${index}][maxQuantity]`, slab.maxQuantity);
//   //     //   productData.append(`slabs[${index}][price]`, slab.price);
//   //     // });

//   //     // In the handleSubmit function, update the slab append code
//   //     formData.slabs.forEach((slab, index) => {
//   //       productData.append(`slabs[${index}][minQuantity]`, slab.minQuantity);
//   //       productData.append(`slabs[${index}][maxQuantity]`, slab.maxQuantity);
//   //       productData.append(`slabs[${index}][price]`, slab.price);

//   //       if (slab.couponId)
//   //         productData.append(`slabs[${index}][couponId]`, slab.couponId);

//   //       // ✅ Fix expire field
//   //       productData.append(
//   //         `slabs[${index}][expire]`,
//   //         slab.expire ? slab.expire : "" // Send "" (empty string) instead of "null"
//   //       );
//   //     });

//   //     const { data } = await createProduct(productData);

//   //     if (data.error) {
//   //       toast.error("Product creation failed. Try again.");
//   //     } else {
//   //       toast.success(`${data.name} is created`);
//   //       localStorage.removeItem("productFormData");
//   //       navigate("/admin/admin-inventory");
//   //     }
//   //   } catch (error) {
//   //     console.error("Product creation failed:", error);
//   //     toast.error("Product creation failed. Try again.");
//   //   }
//   // };

//   // Handle Slab Change
//   // const handleSlabChange = (index, field, value) => {
//   //   const updatedSlabs = formData.slabs.map((slab, i) =>
//   //     i === index ? { ...slab, [field]: value } : slab
//   //   );

//   //   setFormData((prev) => ({
//   //     ...prev,
//   //     slabs: updatedSlabs,
//   //   }));
//   // };

//   // const addSlab = () => {
//   //   setFormData((prev) => ({
//   //     ...prev,
//   //     slabs: [...prev.slabs, { minQuantity: "", maxQuantity: "", price: "" }],
//   //   }));
//   // };

//   // Modify the handleSlabChange function to handle coupon selection

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const productData = new FormData();

//       // Append image URLs
//       formData.imageUrls.forEach((url, index) => {
//         productData.append(`imageUrls[${index}]`, url);
//       });

//       // Append basic product details
//       productData.append("name", formData.name);
//       productData.append("description", formData.description);
//       productData.append("mrp", formData.mrp);
//       productData.append("offerPrice", formData.offerPrice);
//       productData.append("category", formData.category);
//       productData.append("brand", formData.brand);
//       productData.append("countInStock", formData.stock);
//       productData.append("aboutTheBrand", formData.aboutTheBrand);
//       productData.append("specification", formData.specification);
//       productData.append("createdBy", formData.createdBy);
//       productData.append("lowStockThreshold", formData.lowStockThreshold);
//       productData.append("height", formData.height);
//       productData.append("width", formData.width);
//       productData.append("weight", formData.weight);
//       productData.append("breadth", formData.breadth);
//       productData.append("tax", formData.tax);
//       productData.append("shippingRate", formData.shippingRate);

//       // Append product-level coupons if they exist
//       if (formData.coupons && formData.coupons.length > 0) {
//         formData.coupons.forEach((couponId, index) => {
//           productData.append(`coupons[${index}]`, couponId);
//         });
//       }

//       // Append slabs
//       formData.slabs.forEach((slab, index) => {
//         productData.append(`slabs[${index}][minQuantity]`, slab.minQuantity);
//         productData.append(`slabs[${index}][maxQuantity]`, slab.maxQuantity);
//         productData.append(`slabs[${index}][price]`, slab.price);

//         if (slab.couponId) {
//           productData.append(`slabs[${index}][couponId]`, slab.couponId);
//         }

//         // Handle expire date properly
//         if (slab.expire) {
//           productData.append(`slabs[${index}][expire]`, slab.expire);
//         } else {
//           productData.append(`slabs[${index}][expire]`, ""); // Send empty string instead of null
//         }
//       });

//       const { data } = await createProduct(productData);

//       if (data.error) {
//         toast.error("Product creation failed. Try again.");
//       } else {
//         toast.success(`${data.name} is created`);
//         localStorage.removeItem("productFormData");
//         navigate("/admin/admin-inventory");
//       }
//     } catch (error) {
//       console.error("Product creation failed:", error);
//       toast.error("Product creation failed. Try again.");
//     }
//   };
//   const handleSlabChange = (index, field, value) => {
//     const updatedSlabs = [...formData.slabs];

//     if (field === "expire") {
//       // ✅ Convert DD-MM-YYYY to YYYY-MM-DD for storage
//       const [day, month, year] = value.split("-");
//       updatedSlabs[index][field] = `${year}-${month}-${day}`;
//     } else {
//       updatedSlabs[index][field] = value;
//     }

//     setFormData((prev) => ({ ...prev, slabs: updatedSlabs }));
//   };

//   // Update the addSlab function to include couponId
//   const addSlab = () => {
//     setFormData((prev) => ({
//       ...prev,
//       slabs: [
//         ...prev.slabs,
//         { minQuantity: "", maxQuantity: "", price: "", couponId: "" },
//       ],
//     }));
//   };

//   const removeSlab = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       slabs: prev.slabs.filter((_, i) => i !== index),
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "brand") {
//       const selectedBrand = brands.find((brand) => brand._id === value);
//       console.log("Selected Brand:", selectedBrand);
//       setFormData((prev) => ({
//         ...prev,
//         aboutTheBrand: selectedBrand ? selectedBrand.aboutTheBrand : "",
//         brand: selectedBrand ? selectedBrand._id : "",
//       }));
//     }

//     if (name === "category") {
//       const selectedCategory = categories.find((cate) => cate._id === value);
//       if (!selectedCategory) {
//         setErrors((prev) => ({
//           ...prev,
//           category: "Category is required",
//         }));
//       } else {
//         setFormData((prev) => ({
//           ...prev,
//           category: selectedCategory._id,
//         }));
//         setErrors((prev) => ({
//           ...prev,
//           category: "", // Clear error message if valid category is selected
//         }));
//       }
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const uploadFileHandler = async (e) => {
//     const files = Array.from(e.target.files);

//     if (files.length === 0) {
//       toast.error("Please select at least one image to upload.");
//       return;
//     }

//     const formData = new FormData();
//     files.forEach((file) => formData.append("images", file));

//     try {
//       const response = await uploadProductImage(formData).unwrap();

//       if (response?.images?.length) {
//         toast.success("Images uploaded successfully!");

//         // Update the `formData` state to hold uploaded image URLs
//         setFormData((prevData) => ({
//           ...prevData,
//           imageUrls: [...prevData.imageUrls, ...response.images],
//         }));
//       } else {
//         toast.error("No images returned from the server.");
//       }
//     } catch (error) {
//       console.error("Upload Error:", error);
//       toast.error(error?.data?.message || "Error uploading images.");
//     }
//   };

//   const handleRemoveImage = (index) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       imageUrls: prevData.imageUrls.filter((_, i) => i !== index),
//     }));
//   };

//   const validateFields = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) newErrors.name = "Product name is required";
//     if (!formData.description.trim())
//       newErrors.description = "Description is required";
//     if (!formData.mrp || isNaN(formData.mrp) || Number(formData.mrp) <= 0)
//       newErrors.mrp = "Valid MRP is required";
//     if (
//       !formData.offerPrice ||
//       isNaN(formData.offerPrice) ||
//       Number(formData.offerPrice) <= 0
//     )
//       newErrors.offerPrice = "Valid Offer Price is required";
//     // if (!formData.brand || (typeof formData.brand !== 'string' && !formData.brand._id))
//     //   newErrors.brand = "Brand selection is required";
//     if (!formData.category)
//       newErrors.category = "Category selection is required";
//     if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0)
//       newErrors.stock = "Stock must be a non-negative number";
//     if (
//       !formData.lowStockThreshold ||
//       isNaN(formData.lowStockThreshold) ||
//       Number(formData.lowStockThreshold) < 0
//     )
//       newErrors.lowStockThreshold =
//         "Low Stock Threshold must be a non-negative number";
//     if (
//       formData.slabs.some(
//         (slab) => !slab.minQuantity || !slab.maxQuantity || !slab.price
//       )
//     )
//       newErrors.slabs = "All slab fields are required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   return (
//     <div className="flex flex-col items-center darktheme px-6">
//       <section className="w-full  darktheme bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-600 ">
//         <div className="md:w-1/4 p-3 mt-2">
//           <AdminMenu />
//         </div>
//         <h2 className="text-2xl font-semibold mb-6 text-center text-customBlue">
//           Create Product
//         </h2>

//         {formData.imageUrls.length > 0 && (
//           <div className="text-center flex gap-4 flex-wrap">
//             {formData.imageUrls.map((url, index) => (
//               <div key={index} className="relative">
//                 <img
//                   src={BASE_URL + url}
//                   alt="product"
//                   className="max-h-[100px] object-cover border border-gray-400 rounded-md my-2"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveImage(index)}
//                   className="absolute top-4 right-2 text-red-500 bg-white rounded-full text-lg"
//                 >
//                   <AiFillCloseCircle />
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="mb-3">
//           <label className="border border-gray-400 px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-8 darkthemeinput">
//             {formData.imageUrls.length > 0
//               ? `${formData.imageUrls.length} files uploaded`
//               : "Upload Images 400 X 500"}
//             <input
//               type="file"
//               name="images"
//               accept="image/*"
//               multiple
//               onChange={uploadFileHandler}
//               className="hidden"
//             />
//           </label>
//         </div>
//         <div className="w-full">
//           <div className="flex flex-col ">
//             <div className="flex justify-between gap-4 flex-col md:flex-row">
//               <div className="w-full">
//                 <label htmlFor="name">Name</label> <br />
//                 <input
//                   type="text"
//                   className="p-2 mb-3 w-full border border-gray-400 rounded-lg darkthemeinput"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                 />
//                 {errors.name && <p className="text-red-500">{errors.name}</p>}
//               </div>
//               <div className="w-full ">
//                 <label htmlFor="name block">MRP</label> <br />
//                 <input
//                   type="number"
//                   className="p-2 mb-3 w-full border border-gray-400 rounded-lg darkthemeinput"
//                   name="mrp"
//                   value={formData.mrp}
//                   onChange={handleChange}
//                 />
//                 {errors.mrp && <p className="text-red-500">{errors.mrp}</p>}
//               </div>
//               <div className="w-full ">
//                 <label htmlFor="name block">Height</label> <br />
//                 <input
//                   type="number"
//                   className="p-2 mb-3 w-full border border-gray-400 rounded-lg darkthemeinput"
//                   name="height"
//                   value={formData.height}
//                   onChange={handleChange}
//                 />
//                 {/* {errors.mrp && <p className="text-red-500">{errors.mrp}</p>} */}
//               </div>
//               <div className="w-full ">
//                 <label htmlFor="name block">Width</label> <br />
//                 <input
//                   type="number"
//                   className="p-2 mb-3 w-full border border-gray-400 rounded-lg darkthemeinput"
//                   name="width"
//                   value={formData.width}
//                   onChange={handleChange}
//                 />
//                 {/* {errors.mrp && <p className="text-red-500">{errors.mrp}</p>} */}
//               </div>
//               <div className="w-full ">
//                 <label htmlFor="name block">Breadth</label> <br />
//                 <input
//                   type="number"
//                   className="p-2 mb-3 w-full border border-gray-400 rounded-lg darkthemeinput"
//                   name="breadth"
//                   value={formData.breadth}
//                   onChange={handleChange}
//                 />
//                 {/* {errors.mrp && <p className="text-red-500">{errors.mrp}</p>} */}
//               </div>
//               <div className="w-full ">
//                 <label htmlFor="name block">Weight</label> <br />
//                 <input
//                   type="number"
//                   className="p-2 mb-3 w-full border border-gray-400 rounded-lg darkthemeinput"
//                   name="weight"
//                   value={formData.weight}
//                   onChange={handleChange}
//                 />
//                 {/* {errors.mrp && <p className="text-red-500">{errors.mrp}</p>} */}
//               </div>
//               <div className="w-full ">
//                 <label htmlFor="name block">Tax</label> <br />
//                 <input
//                   type="number"
//                   className="p-2 mb-3 w-full border border-gray-400 rounded-lg darkthemeinput"
//                   name="tax"
//                   value={formData.tax}
//                   onChange={handleChange}
//                 />
//                 {/* {errors.mrp && <p className="text-red-500">{errors.mrp}</p>} */}
//               </div>
//               <div className="w-full ">
//                 <label htmlFor="name block">Shipping Rate</label> <br />
//                 <input
//                   type="number"
//                   className="p-2 mb-3 w-full border border-gray-400 rounded-lg darkthemeinput"
//                   name="shippingRate"
//                   value={formData.shippingRate}
//                   onChange={handleChange}
//                 />
//                 {/* {errors.mrp && <p className="text-red-500">{errors.mrp}</p>} */}
//               </div>
//             </div>

//             <div className="flex justify-between gap-4 flex-col md:flex-row">
//               <div className="w-full">
//                 <label htmlFor="name block">Offer Price</label> <br />
//                 <input
//                   type="number"
//                   className="p-2 mb-3 w-full border border-gray-400 rounded-lg darkthemeinput"
//                   name="offerPrice"
//                   value={formData.offerPrice}
//                   onChange={handleChange}
//                 />
//                 {errors.offerPrice && (
//                   <p className="text-red-500">{errors.offerPrice}</p>
//                 )}
//               </div>

//               <div className="w-full">
//                 <label htmlFor="brand">Brand</label> <br />
//                 <select
//                   name="brand"
//                   value={formData.brand} // Bind the select value to formData.brand
//                   placeholder="Choose Brand"
//                   className="p-2 mb-3 w-full border border-gray-400 rounded-lg darkthemeinput"
//                   onChange={handleChange}
//                 >
//                   <option value="">Select Brand</option>
//                   {brands?.map((c) => (
//                     <option key={c._id} value={c._id}>
//                       {c.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.brand && <p className="text-red-500">{errors.brand}</p>}
//               </div>
//             </div>
//           </div>
//           <div className="flex flex-wrap"></div>

//           <label htmlFor="description" className="my-5">
//             Description
//           </label>
//           <ReactQuill
//             value={formData.description}
//             onChange={(value) =>
//               setFormData((prev) => ({ ...prev, description: value }))
//             }
//             theme="snow"
//             placeholder="Enter Description"
//             className="w-full mb-4"
//             name="description"
//           />
//           {errors.description && (
//             <p className="text-red-500">{errors.description}</p>
//           )}

//           <div className="flex justify-between gap-4 flex-col md:flex-row">
//             <div className="w-full">
//               <label htmlFor="name block">Count In Stock</label> <br />
//               <input
//                 type="text"
//                 name="stock"
//                 className="p-2 mb-3 w-full border border-gray-400 rounded-lg darkthemeinput"
//                 value={formData.stock}
//                 onChange={handleChange}
//               />
//               {errors.stock && <p className="text-red-500">{errors.stock}</p>}
//             </div>
//             {/* Product-Level Coupons */}
//             {/* <div className="mb-5">
//               <label>Coupons (Optional)</label>
//               <select
//                 multiple
//                 value={formData.coupons || []}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     coupons: Array.from(
//                       e.target.selectedOptions,
//                       (option) => option.value
//                     ),
//                   })
//                 }
//                 className="p-2 mb-3 w-full border border-gray-400 rounded-lg darkthemeinput"
//               >
//                 {coupons?.map((coupon) => (
//                   <option key={coupon._id} value={coupon._id}>
//                     {coupon.name} - {coupon.percentage}% off
//                   </option>
//                 ))}
//               </select>
//             </div> */}
//           </div>
//           <CouponSelector
//             coupons={coupons}
//             formData={formData}
//             setFormData={setFormData}
//           />

//           {/*Slab Section */}

//           <div className="mb-5">
//             <label>Pricing Slabs</label>

//             {formData.slabs.map((slab, index) => (
//               <div
//                 key={index}
//                 className="flex items-center flex-col md:flex-row space-x-3 my-2"
//               >
//                 <input
//                   type="number"
//                   placeholder="Min Quantity"
//                   value={slab.minQuantity}
//                   onChange={(e) =>
//                     handleSlabChange(index, "minQuantity", e.target.value)
//                   }
//                   className="p-2 border border-gray-400 rounded-lg darkthemeinput w-full"
//                 />
//                 <input
//                   type="number"
//                   placeholder="Max Quantity"
//                   value={slab.maxQuantity}
//                   onChange={(e) =>
//                     handleSlabChange(index, "maxQuantity", e.target.value)
//                   }
//                   className="p-2 border border-gray-400 rounded-lg darkthemeinput w-full"
//                 />
//                 <input
//                   type="number"
//                   placeholder="Price"
//                   value={slab.price}
//                   onChange={(e) =>
//                     handleSlabChange(index, "price", e.target.value)
//                   }
//                   className="p-2 border border-gray-400 rounded-lg darkthemeinput w-full"
//                 />

//                 {/* Add the expiration date picker */}
//                 {/* <input
//                   type="date"
//                   placeholder="Expire Date (DD-MM-YYYY)"
//                   value={slab.expire}
//                   onChange={(e) =>
//                     handleSlabChange(index, "expire", e.target.value)
//                   }
//                   className="p-2 border border-gray-400 rounded-lg darkthemeinput w-full"
//                 />

//                 <select
//                   value={slab.couponId || ""}
//                   onChange={(e) =>
//                     handleSlabChange(index, "couponId", e.target.value)
//                   }
//                   className="p-2 border border-gray-400 rounded-lg darkthemeinput w-full"
//                 >
//                   <option value="">Select Coupon (Optional)</option>
//                   {coupons?.map((coupon) => (
//                     <option key={coupon._id} value={coupon._id}>
//                       {coupon.name} - {coupon.percentage}% off
//                     </option>
//                   ))}
//                 </select> */}

//                 {/* Remove slab button */}
//                 <button
//                   type="button"
//                   onClick={() => removeSlab(index)}
//                   className="py-2 px-4 mt-1 rounded-lg text-lg font-bold bg-red-600 text-white"
//                 >
//                   <FiMinus className="w-5 h-5" />
//                 </button>

//                 {/* Add slab button */}
//                 <button
//                   onClick={addSlab}
//                   className="py-2 px-4 mt-1 rounded-lg text-lg font-bold bg-blue-600 text-white"
//                 >
//                   <FiPlus className="w-5 h-5" />
//                 </button>
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-between w-full gap-4 flex-col md:flex-row">
//             <div className="w-full">
//               <label htmlFor="lowStockThreshold" className="my-5">
//                 Low Stock Threshold
//               </label>{" "}
//               <br />
//               <input
//                 name="lowStockThreshold"
//                 type="number"
//                 className="p-2 mb-3 w-full border border-gray-400 rounded-lg darkthemeinput"
//                 value={formData.lowStockThreshold}
//                 onChange={handleChange}
//               />
//               {errors.lowStockThreshold && (
//                 <p className="text-red-500">{errors.lowStockThreshold}</p>
//               )}
//             </div>

//             <div className="w-full">
//               <label htmlFor="">Category</label> <br />
//               <select
//                 name="category"
//                 placeholder="Choose Category"
//                 className="p-2 mb-3 w-full border border-gray-400 rounded-lg darkthemeinput"
//                 onChange={handleChange}
//               >
//                 <option value={formData.category}>Select Category</option>
//                 {categories?.map((c) => (
//                   <option key={c._id} value={c._id}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <label htmlFor="aboutTheBrand" className="my-5">
//             About the Brand
//           </label>
//           <ReactQuill
//             value={formData.aboutTheBrand}
//             onChange={(value) =>
//               setFormData((prev) => ({ ...prev, aboutTheBrand: value }))
//             }
//             theme="snow"
//             placeholder="Enter aboutTheBrand"
//             className="w-full mb-4"
//           />
//           {/* New Field: Specifications */}
//           <label htmlFor="specification" className="my-5">
//             Specifications
//           </label>
//           <ReactQuill
//             value={formData.specification}
//             onChange={(value) =>
//               setFormData((prev) => ({ ...prev, specification: value }))
//             }
//             theme="snow"
//             placeholder="Enter Specification"
//             className="w-full"
//             name="specification" // Added name attribute here
//           />
//           <div className="flex justify-center mt-8">
//             <button
//               type="submit"
//               onClick={handleSubmit}
//               className="bg-customBlue text-white py-2 px-4 rounded-lg hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-opacity-50 w-full sm:w-auto"
//             >
//               Submit
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default ProductList;


import React, { useState, useEffect } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { FiPlus, FiMinus } from "react-icons/fi";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useGetCouponCodeQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import { useFetchBrandsQuery } from "../../redux/api/brandApiSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../redux/constants";
import { io } from "socket.io-client";
import CouponSelector from "./CouponSelector";
import { useFetchSubCategoriesQuery } from "../../redux/api/subCategoryApiSlice";

const ProductList = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mrp: "",
    offerPrice: "",
    category: "",
    subCategory:"",
    brand: "",
    stock: "",
    aboutTheBrand: "",
    specification: "",
    createdBy: "",
    lowStockThreshold: "",
    imageUrls: [],
    coupons: [],
    slabs: [
      { minQuantity: "", maxQuantity: "", price: "", couponId: "", expire: "" },
    ],
    height: "",
    weight: "",
    breadth: "",
    width: "",
    tax: "",
    shippingRate: "",
  });

  const [errors, setErrors] = useState({});
  const socket = io(`${BASE_URL}`);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();
  const { data: subCategories = [] } = useFetchSubCategoriesQuery();
  const { data: brands } = useFetchBrandsQuery();
  const { data: coupons } = useGetCouponCodeQuery();

  const user = useSelector((state) => state.auth);

  // Load saved form data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("productFormData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Set up socket connections
  useEffect(() => {
    socket.on("productAdded", (newProduct) => {
      console.log("New Product Added:", newProduct);
    });

    socket.on("productUpdated", (updatedProduct) => {
      console.log("Product Updated:", updatedProduct);
    });

    socket.on("productDeleted", (deletedProduct) => {
      console.log("Product Deleted:", deletedProduct);
    });

    return () => {
      socket.off("productAdded");
      socket.off("productUpdated");
      socket.off("productDeleted");
    };
  }, []);

  // Save form data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("productFormData", JSON.stringify(formData));
  }, [formData]);

  // Set created by ID when user info is available
  useEffect(() => {
    if (user?.userInfo?._id) {
      setFormData((prevState) => ({
        ...prevState,
        createdBy: user.userInfo._id,
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      const productData = new FormData();

      // Append image URLs
      formData.imageUrls.forEach((url, index) => {
        productData.append(`imageUrls[${index}]`, url);
      });

      // Append basic product details
      productData.append("name", formData.name);
      productData.append("description", formData.description);
      productData.append("mrp", formData.mrp);
      productData.append("offerPrice", formData.offerPrice);
      productData.append("category", formData.category);
      productData.append("subCategory", formData.subCategory);
      productData.append("brand", formData.brand);
      productData.append("countInStock", formData.stock);
      productData.append("aboutTheBrand", formData.aboutTheBrand);
      productData.append("specification", formData.specification);
      productData.append("createdBy", formData.createdBy);
      productData.append("lowStockThreshold", formData.lowStockThreshold);
      productData.append("height", formData.height);
      productData.append("width", formData.width);
      productData.append("weight", formData.weight);
      productData.append("breadth", formData.breadth);
      productData.append("tax", formData.tax);
      productData.append("shippingRate", formData.shippingRate);

      // Append product-level coupons if they exist
      if (formData.coupons && formData.coupons.length > 0) {
        formData.coupons.forEach((couponId, index) => {
          productData.append(`coupons[${index}]`, couponId);
        });
      }

      // Append slabs
      formData.slabs.forEach((slab, index) => {
        productData.append(`slabs[${index}][minQuantity]`, slab.minQuantity);
        productData.append(`slabs[${index}][maxQuantity]`, slab.maxQuantity);
        productData.append(`slabs[${index}][price]`, slab.price);

        if (slab.couponId) {
          productData.append(`slabs[${index}][couponId]`, slab.couponId);
        }

        // Handle expire date properly
        if (slab.expire) {
          productData.append(`slabs[${index}][expire]`, slab.expire);
        } else {
          productData.append(`slabs[${index}][expire]`, "");
        }
      });

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product creation failed. Try again.");
      } else {
        toast.success(`${data.name} is created`);
        localStorage.removeItem("productFormData");
        navigate("/admin/admin-inventory");
      }
    } catch (error) {
      console.error("Product creation failed:", error);
      toast.error("Product creation failed. Try again.");
    }
  };

  const handleSlabChange = (index, field, value) => {
    const updatedSlabs = [...formData.slabs];

    if (field === "expire") {
      // Convert DD-MM-YYYY to YYYY-MM-DD for storage
      const [day, month, year] = value.split("-");
      updatedSlabs[index][field] = `${year}-${month}-${day}`;
    } else {
      updatedSlabs[index][field] = value;
    }

    setFormData((prev) => ({ ...prev, slabs: updatedSlabs }));
  };

  const addSlab = () => {
    setFormData((prev) => ({
      ...prev,
      slabs: [
        ...prev.slabs,
        { minQuantity: "", maxQuantity: "", price: "", couponId: "" },
      ],
    }));
  };

  const removeSlab = (index) => {
    setFormData((prev) => ({
      ...prev,
      slabs: prev.slabs.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "brand") {
      const selectedBrand = brands?.find((brand) => brand._id === value);
      setFormData((prev) => ({
        ...prev,
        aboutTheBrand: selectedBrand ? selectedBrand.aboutTheBrand : "",
        brand: selectedBrand ? selectedBrand._id : "",
      }));
    } else if (name === "category") {
      const selectedCategory = categories?.find((cate) => cate._id === value);
      if (!selectedCategory) {
        setErrors((prev) => ({
          ...prev,
          category: "Category is required",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          category: selectedCategory._id,
        }));
        setErrors((prev) => ({
          ...prev,
          category: "",
        }));
      }
    }
     else if (name === "subCategory") {
      const selectedSubCategory = subCategories?.find((cate) => cate._id === value);
      if (!selectedSubCategory) {
        setErrors((prev) => ({
          ...prev,
          subCategory: "Sub-Category is required",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          subCategory: selectedSubCategory._id,
        }));
        setErrors((prev) => ({
          ...prev,
          subCategory: "",
        }));
      }
    }  else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) {
      toast.error("Please select at least one image to upload.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      const response = await uploadProductImage(formData).unwrap();

      if (response?.images?.length) {
        toast.success("Images uploaded successfully!");

        setFormData((prevData) => ({
          ...prevData,
          imageUrls: [...prevData.imageUrls, ...response.images],
        }));
      } else {
        toast.error("No images returned from the server.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error(error?.data?.message || "Error uploading images.");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      imageUrls: prevData.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const validateFields = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.mrp || isNaN(formData.mrp) || Number(formData.mrp) <= 0)
      newErrors.mrp = "Valid MRP is required";
    if (
      !formData.offerPrice ||
      isNaN(formData.offerPrice) ||
      Number(formData.offerPrice) <= 0
    )
      newErrors.offerPrice = "Valid Offer Price is required";
    if (!formData.category)
      newErrors.category = "Category selection is required";
        if (!formData.subCategory)
      newErrors.subCategory = "Sub-Category selection is required";
    if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0)
      newErrors.stock = "Stock must be a non-negative number";
    if (
      !formData.lowStockThreshold ||
      isNaN(formData.lowStockThreshold) ||
      Number(formData.lowStockThreshold) < 0
    )
      newErrors.lowStockThreshold =
        "Low Stock Threshold must be a non-negative number";
    if (
      formData.slabs.some(
        (slab) => !slab.minQuantity || !slab.maxQuantity || !slab.price
      )
    )
      newErrors.slabs = "All slab fields are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="min-h-screen ">
       {/* <AdminMenu /> */}
      <div className="max-w-7xl px-4 ">
        <div className="w-full">
          {/* Sidebar */}
        
          {/* Main Content */}
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                {/* <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Create Product
                </h2> */}
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Add a new product to your inventory
                </p>
              </div>

              <div className="px-6 py-5">
                {/* Image Upload Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Images
                  </label>

                  {formData.imageUrls.length > 0 && (
                    <div className="flex flex-wrap gap-4 mb-4">
                      {formData.imageUrls.map((url, index) => (
                        <div key={index} className="relative w-24 h-24">
                          <img
                            src={`${BASE_URL}${url}`}
                            alt={`product-${index}`}
                            className="w-full h-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label="Remove image"
                          >
                            <AiFillCloseCircle size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-2">
                    <label className="flex justify-center px-6 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="space-y-1 text-center">
                        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formData.imageUrls.length > 0
                            ? `${formData.imageUrls.length} file(s) uploaded`
                            : "Upload Images (400 x 500)"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </div>
                      </div>
                      <input
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={uploadFileHandler}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter product name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="mrp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        MRP
                      </label>
                      <input
                        type="number"
                        id="mrp"
                        name="mrp"
                        value={formData.mrp}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="0.00"
                      />
                      {errors.mrp && (
                        <p className="mt-1 text-sm text-red-600">{errors.mrp}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="offerPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Offer Price
                      </label>
                      <input
                        type="number"
                        id="offerPrice"
                        name="offerPrice"
                        value={formData.offerPrice}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="0.00"
                      />
                      {errors.offerPrice && (
                        <p className="mt-1 text-sm text-red-600">{errors.offerPrice}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="0"
                      />
                      {errors.stock && (
                        <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Low Stock Threshold
                      </label>
                      <input
                        type="number"
                        id="lowStockThreshold"
                        name="lowStockThreshold"
                        value={formData.lowStockThreshold}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="0"
                      />
                      {errors.lowStockThreshold && (
                        <p className="mt-1 text-sm text-red-600">{errors.lowStockThreshold}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select Category</option>
                        {categories?.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                      )}
                    </div>

                      <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                       Sub-Category
                      </label>
                      <select
                        id="subCategory"
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select Sub-Category</option>
                        {subCategories?.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {errors.subCategory && (
                        <p className="mt-1 text-sm text-red-600">{errors.subCategory}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Brand
                      </label>
                      <select
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select Brand</option>
                        {brands?.map((b) => (
                          <option key={b._id} value={b._id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                      {errors.brand && (
                        <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product Dimensions & Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Product Dimensions & Details
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div>
                      <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Height
                      </label>
                      <input
                        type="number"
                        id="height"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label htmlFor="width" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Width
                      </label>
                      <input
                        type="number"
                        id="width"
                        name="width"
                        value={formData.width}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label htmlFor="breadth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Breadth
                      </label>
                      <input
                        type="number"
                        id="breadth"
                        name="breadth"
                        value={formData.breadth}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Weight
                      </label>
                      <input
                        type="number"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label htmlFor="tax" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tax (%)
                      </label>
                      <input
                        type="number"
                        id="tax"
                        name="tax"
                        value={formData.tax}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label htmlFor="shippingRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Shipping Rate
                      </label>
                      <input
                        type="number"
                        id="shippingRate"
                        name="shippingRate"
                        value={formData.shippingRate}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <div className="bg-white dark:bg-gray-700 rounded-md">
                    <ReactQuill
                      value={formData.description}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, description: value }))
                      }
                      theme="snow"
                      placeholder="Enter product description"
                    />
                  </div>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* About the Brand */}
                <div className="mb-6">
                  <label htmlFor="aboutTheBrand" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    About the Brand
                  </label>
                  <div className="bg-white dark:bg-gray-700 rounded-md">
                    <ReactQuill
                      value={formData.aboutTheBrand}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, aboutTheBrand: value }))
                      }
                      theme="snow"
                      placeholder="Enter brand information"
                    />
                  </div>
                </div>

                {/* Specifications */}
                <div className="mb-6">
                  <label htmlFor="specification" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Specifications
                  </label>
                  <div className="bg-white dark:bg-gray-700 rounded-md">
                    <ReactQuill
                      value={formData.specification}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, specification: value }))
                      }
                      theme="snow"
                      placeholder="Enter product specifications"
                    />
                  </div>
                </div>

                {/* Coupon Selector */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Coupons
                  </h3>

                  {coupons && (
                    <CouponSelector
                      coupons={coupons}
                      formData={formData}
                      setFormData={setFormData}
                    />
                  )}
                </div>
                {/* Pricing Slabs */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Pricing Slabs
                  </h3>

                  {formData.slabs.map((slab, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-center gap-3 mb-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="w-full sm:w-1/5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Min Quantity
                        </label>
                        <input
                          type="number"
                          placeholder="Min Quantity"
                          value={slab.minQuantity}
                          onChange={(e) => handleSlabChange(index, "minQuantity", e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div className="w-full sm:w-1/5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Max Quantity
                        </label>
                        <input
                          type="number"
                          placeholder="Max Quantity"
                          value={slab.maxQuantity}
                          onChange={(e) => handleSlabChange(index, "maxQuantity", e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div className="w-full sm:w-1/5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Price
                        </label>
                        <input
                          type="number"
                          placeholder="Price"
                          value={slab.price}
                          onChange={(e) => handleSlabChange(index, "price", e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div className="w-full sm:w-1/5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Coupon
                        </label>
                        <select
                          value={slab.couponId || ""}
                          onChange={(e) => handleSlabChange(index, "couponId", e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">No Coupon</option>
                          {coupons?.map((coupon) => (
                            <option key={coupon._id} value={coupon._id}>
                              {coupon.code} ({coupon.discount}% off)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-full sm:w-1/5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                         value={
  slab.expire
    ? (() => {
        const parts = slab.expire.split("-");
        return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : "";
      })()
    : ""
}

                          onChange={(e) => handleSlabChange(index, "expire", e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                        <button
                          type="button"
                          onClick={() => removeSlab(index)}
                          className="p-2 text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                          aria-label="Remove slab"
                        >
                          <FiMinus size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={addSlab}
                      className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiPlus className="mr-2" size={18} />
                      Add Pricing Slab
                    </button>
                  </div>

                  {errors.slabs && (
                    <p className="mt-2 text-sm text-red-600">{errors.slabs}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
export default ProductList;
