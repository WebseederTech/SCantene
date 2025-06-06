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
    subCategory: "",
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

    // ✅ Newly added fields (from schema):
    sku: "",
    tags: [],
    keywords: [],
    variants: [
      {
        color: "",
        size: "",
        additionalPrice: 0,
        images: [],
        countInStock: 0,
        sku: "",
      },
    ],
    isEnable: true,
    isFeatured: false,
    isBestSeller: false,
    unit: "piece",
    deliveryDays: "",
    returnable: true,
    returnWindow: 7,
    warrantyPeriod: "",
    isDigital: false,
    downloadLink: "",
    visibility: "Public",
    attributes: [
      {
        key: "",
        value: "",
      },
    ],
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

      // Basic product details
      productData.append("name", formData.name);
      productData.append("sku", formData.sku);
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
      productData.append("deliveryDays", formData.deliveryDays);
      productData.append("returnWindow", formData.returnWindow);
      productData.append("warrantyPeriod", formData.warrantyPeriod);
      productData.append("unit", formData.unit);
      productData.append("downloadLink", formData.downloadLink || "");
      productData.append("visibility", formData.visibility || "Public");

      // Boolean fields
      productData.append("isEnable", formData.isEnable);
      productData.append("isFeatured", formData.isFeatured);
      productData.append("isBestSeller", formData.isBestSeller);
      productData.append("returnable", formData.returnable);
      productData.append("isDigital", formData.isDigital);

      // Tags & Keywords
      formData.tags.forEach((tag, index) => {
        productData.append(`tags[${index}]`, tag);
      });

      formData.keywords.forEach((keyword, index) => {
        productData.append(`keywords[${index}]`, keyword);
      });

      // Coupons
      if (formData.coupons && formData.coupons.length > 0) {
        formData.coupons.forEach((couponId, index) => {
          productData.append(`coupons[${index}]`, couponId);
        });
      }

      // Slabs
      formData.slabs.forEach((slab, index) => {
        productData.append(`slabs[${index}][minQuantity]`, slab.minQuantity);
        productData.append(`slabs[${index}][maxQuantity]`, slab.maxQuantity);
        productData.append(`slabs[${index}][price]`, slab.price);
       if (slab.couponId && slab.couponId.trim() !== "") {
  productData.append(`slabs[${index}][couponId]`, slab.couponId);
}
        productData.append(`slabs[${index}][expire]`, slab.expire || "");
      });

const validVariants = formData.variants?.filter((variant) => {
      return (
        variant.color.trim() !== "" ||
        variant.size.trim() !== "" ||
        variant.additionalPrice > 0 ||
        variant.countInStock > 0 ||
        variant.sku.trim() !== "" ||
        (variant.images && variant.images.length > 0)
      );
    });

    // Append variants only if there are any valid ones
    if (validVariants && validVariants.length > 0) {
      validVariants.forEach((variant, index) => {
        Object.entries(variant).forEach(([key, value]) => {
          if (key === "images" && Array.isArray(value)) {
            value.forEach((img, i) => {
              productData.append(`variants[${index}][images][${i}]`, img);
            });
          } else {
            productData.append(`variants[${index}][${key}]`, value);
          }
        });
      });
    }

      // Attributes
      formData.attributes.forEach((attr, index) => {
        productData.append(`attributes[${index}][key]`, attr.key || "");
        productData.append(`attributes[${index}][value]`, attr.value || "");
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
    } else if (name === "subCategory") {
      const selectedSubCategory = subCategories?.find(
        (cate) => cate._id === value
      );
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
    } else {
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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleVariantChange = (index, e) => {
  const { name, value, type } = e.target;

  setFormData((prev) => {
    const updatedVariants = [...prev.variants];

    // If the field is numeric, convert value accordingly
    let val = value;
    if (type === "number") {
      val = value === "" ? "" : Number(value);
    }

    // Update the specific property of the variant at given index
    updatedVariants[index] = {
      ...updatedVariants[index],
      [name]: val,
    };

    return {
      ...prev,
      variants: updatedVariants,
    };
  });
};


const handleVariantImageChange = (index, e) => {
  const files = Array.from(e.target.files); // FileList to array

  setFormData(prev => {
    const updatedVariants = [...prev.variants];
    // Replace or append files as per your logic (here replacing)
    updatedVariants[index] = {
      ...updatedVariants[index],
      images: files,
    };
    return { ...prev, variants: updatedVariants };
  });
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
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
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
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="mrp"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
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
                        <p className="mt-1 text-sm text-red-600">
                          {errors.mrp}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="offerPrice"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
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
                        <p className="mt-1 text-sm text-red-600">
                          {errors.offerPrice}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="stock"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
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
                        <p className="mt-1 text-sm text-red-600">
                          {errors.stock}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="lowStockThreshold"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
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
                        <p className="mt-1 text-sm text-red-600">
                          {errors.lowStockThreshold}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
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
                        <p className="mt-1 text-sm text-red-600">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
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
                        <p className="mt-1 text-sm text-red-600">
                          {errors.subCategory}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="brand"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
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
                        <p className="mt-1 text-sm text-red-600">
                          {errors.brand}
                        </p>
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
                      <label
                        htmlFor="height"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
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
                      <label
                        htmlFor="width"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
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
                      <label
                        htmlFor="breadth"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
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
                      <label
                        htmlFor="weight"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
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
                      <label
                        htmlFor="tax"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
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
                      <label
                        htmlFor="shippingRate"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
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

                {/* Variants*/}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Product Variants
                  </h3>

                  {formData.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="mb-4 p-4 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    >
                      <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
                        Variant #{index + 1}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                          <label
                            htmlFor={`color-${index}`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Color
                          </label>
                          <input
                            type="text"
                            id={`color-${index}`}
                            name="color"
                            value={variant.color}
                            onChange={(e) => handleVariantChange(index, e)}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="e.g. Red"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`size-${index}`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Size
                          </label>
                          <input
                            type="text"
                            id={`size-${index}`}
                            name="size"
                            value={variant.size}
                            onChange={(e) => handleVariantChange(index, e)}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="e.g. M, L, XL"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`additionalPrice-${index}`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Additional Price
                          </label>
                          <input
                            type="number"
                            id={`additionalPrice-${index}`}
                            name="additionalPrice"
                            value={variant.additionalPrice}
                            onChange={(e) => handleVariantChange(index, e)}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="0"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`countInStock-${index}`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Stock Count
                          </label>
                          <input
                            type="number"
                            id={`countInStock-${index}`}
                            name="countInStock"
                            value={variant.countInStock}
                            onChange={(e) => handleVariantChange(index, e)}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="0"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`sku-${index}`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            SKU
                          </label>
                          <input
                            type="text"
                            id={`sku-${index}`}
                            name="sku"
                            value={variant.sku}
                            onChange={(e) => handleVariantChange(index, e)}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="SKU12345"
                          />
                        </div>
                              {/* Images upload */}
      <div className="sm:col-span-2 lg:col-span-5">
        <label
          htmlFor={`images-${index}`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Upload Images
        </label>
        <input
          type="file"
          id={`images-${index}`}
          multiple
          accept="image/*"
          onChange={(e) => handleVariantImageChange(index, e)}
          className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100
                     dark:file:bg-gray-700 dark:file:text-gray-300"
        />
        {/* Preview thumbnails */}
        <div className="flex flex-wrap mt-2 gap-2">
          {variant.images && variant.images.length > 0 && variant.images.map((img, i) => (
            <img
              key={i}
              src={typeof img === "string" ? img : URL.createObjectURL(img)}
              alt={`Variant ${index + 1} Image ${i + 1}`}
              className="h-16 w-16 object-cover rounded-md border border-gray-300"
            />
          ))}
        </div>
      </div>
                      </div>
                    </div>
                  ))}

                  {/* Button to add a new variant */}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        variants: [
                          ...prev.variants,
                          {
                            color: "",
                            size: "",
                            additionalPrice: 0,
                            countInStock: 0,
                            sku: "",
                            images: [],
                          },
                        ],
                      }))
                    }
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                  >
                    Add Variant
                  </button>
                </div>

                {/* Sku Meta & Info*/}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    SKU & Meta Info
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label
                        htmlFor="sku"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        SKU
                      </label>
                      <input
                        type="text"
                        id="sku"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
                        placeholder="Enter SKU"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="unit"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Unit (e.g. pcs, kg)
                      </label>
                      <input
                        type="text"
                        id="unit"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., pcs"
                      />
                    </div>
                  </div>
                </div>

                {/* Logistics & Return Policy*/}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Logistics & Return Policy
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label
                        htmlFor="deliveryDays"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Delivery Days
                      </label>
                      <input
                        type="number"
                        id="deliveryDays"
                        name="deliveryDays"
                        value={formData.deliveryDays}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., 5"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="returnWindow"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Return Window (days)
                      </label>
                      <input
                        type="number"
                        id="returnWindow"
                        name="returnWindow"
                        value={formData.returnWindow}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., 7"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="warrantyPeriod"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Warranty Period (months)
                      </label>
                      <input
                        type="number"
                        id="warrantyPeriod"
                        name="warrantyPeriod"
                        value={formData.warrantyPeriod}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., 12"
                      />
                    </div>

                    <div className="flex items-center mt-6">
                      <input
                        type="checkbox"
                        id="returnable"
                        name="returnable"
                        checked={formData.returnable}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="returnable"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        Returnable
                      </label>
                    </div>
                  </div>
                </div>

                {/* Tags & Keywords */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    SEO Tags & Keywords
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tags
                      </label>
                      <input
                        type="text"
                        value={(formData.tags ?? []).join(",")}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tags: e.target.value.split(","),
                          })
                        }
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., organic, summer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Keywords
                      </label>
                      <input
                        type="text"
                        value={formData.keywords.join(",")}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            keywords: e.target.value.split(","),
                          })
                        }
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., tshirt, cotton"
                      />
                    </div>
                  </div>
                </div>

                {/*. Visibility Settings */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Product Visibility & Status
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                      { label: "Enable Product", name: "isEnable" },
                      { label: "Best Seller", name: "isBestSeller" },
                      { label: "Featured", name: "isFeatured" },
                      { label: "Digital Product", name: "isDigital" },
                    ].map(({ label, name }) => (
                      <div key={name} className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          id={name}
                          name={name}
                          checked={formData[name]}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={name}
                          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          {label}
                        </label>
                      </div>
                    ))}

                    <div>
                      <label
                        htmlFor="visibility"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Visibility
                      </label>
                      <select
                        id="visibility"
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
                      >
                        <option value="Public">Public</option>
                        <option value="Draft">Draft</option>
                        <option value="Private">Private</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
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
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* About the Brand */}
                <div className="mb-6">
                  <label
                    htmlFor="aboutTheBrand"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    About the Brand
                  </label>
                  <div className="bg-white dark:bg-gray-700 rounded-md">
                    <ReactQuill
                      value={formData.aboutTheBrand}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          aboutTheBrand: value,
                        }))
                      }
                      theme="snow"
                      placeholder="Enter brand information"
                    />
                  </div>
                </div>

                {/* Specifications */}
                <div className="mb-6">
                  <label
                    htmlFor="specification"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Specifications
                  </label>
                  <div className="bg-white dark:bg-gray-700 rounded-md">
                    <ReactQuill
                      value={formData.specification}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          specification: value,
                        }))
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
                          onChange={(e) =>
                            handleSlabChange(
                              index,
                              "minQuantity",
                              e.target.value
                            )
                          }
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
                          onChange={(e) =>
                            handleSlabChange(
                              index,
                              "maxQuantity",
                              e.target.value
                            )
                          }
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
                          onChange={(e) =>
                            handleSlabChange(index, "price", e.target.value)
                          }
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div className="w-full sm:w-1/5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Coupon
                        </label>
                        <select
                          value={slab.couponId || ""}
                          onChange={(e) =>
                            handleSlabChange(index, "couponId", e.target.value)
                          }
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
                                  return parts.length === 3
                                    ? `${parts[2]}-${parts[1]}-${parts[0]}`
                                    : "";
                                })()
                              : ""
                          }
                          onChange={(e) =>
                            handleSlabChange(index, "expire", e.target.value)
                          }
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
  );
};
export default ProductList;
