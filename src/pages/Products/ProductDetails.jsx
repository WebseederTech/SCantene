import { useCallback, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Slider from "react-slick";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
  useSaveSlabSelectionMutation,
  useAddProductClickMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaShoppingCart,
  FaStore,
  FaArrowLeft,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useRequestSlabMutation } from "../../redux/api/productApiSlice";
import { BASE_URL } from "../../redux/constants";
import axios from "axios";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isCustomQty, setIsCustomQty] = useState(false);
  const [customQty, setCustomQty] = useState("");
  const [selectedSlab, setSelectedSlab] = useState(null);
  const [requestSlab] = useRequestSlabMutation();
  const [saveSlabSelection] = useSaveSlabSelectionMutation();
  const [selectedVariant, setSelectedVariant] = useState(null);
const [displayImages, setDisplayImages] = useState([]);


  // Add state to track which quantity method the user prefers
  const [quantityMethod, setQuantityMethod] = useState("manual"); // Options: "manual", "slab"

  const {
    data,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const product = data?.product || { slabs: [] }; // Assuming API response shape: { message, data }

  const [addProductClick] = useAddProductClickMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const role = userInfo.role;
  const isSeller = role === "Seller";

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  // const addToCartHandler = async () => {
  //   const hasSlabs = product.slabs && product.slabs.length > 0;

  //   let qtyToSave;
  //   let price;

  //   if (quantityMethod === "manual") {
  //     // Use manual quantity
  //     qtyToSave = qty;
  //     price = product.offerPrice;
  //   } else if (quantityMethod === "slab") {
  //     if (isCustomQty) {
  //       // Use custom quantity for bulk request
  //       qtyToSave = parseInt(customQty, 10);
  //       price = product.offerPrice;
  //     } else if (selectedSlab) {
  //       // Use selected slab quantity and price
  //       qtyToSave = selectedQuantities[selectedSlab._id];
  //       price = selectedSlab.price;
  //     } else {
  //       toast.warn("Please select a slab or enable custom quantity.");
  //       return;
  //     }
  //   }

  //   if (!qtyToSave || qtyToSave <= 0) {
  //     toast.error("Invalid quantity selected.");
  //     return;
  //   }

  //   try {
  //     const payload = {
  //       productId: productId,
  //       slabId: quantityMethod === "slab" ? selectedSlab?._id || null : null,
  //       userId: userInfo._id,
  //       qty: qtyToSave,
  //       price: price,
  //     };

  //     await saveSlabSelection(payload).unwrap();
  //     toast.success("Item added to cart successfully");
  //     navigate("/cart");
  //   } catch (error) {
  //     toast.error(error?.data?.message || "Failed to add item to cart");
  //   }
  // };

const addToCartHandler = async () => {
  const hasSlabs = product.slabs && product.slabs.length > 0;
  let qtyToSave;
  let basePrice;

  if (quantityMethod === "manual") {
    qtyToSave = qty;
    basePrice = product.offerPrice;
  } else if (quantityMethod === "slab") {
    if (isCustomQty) {
      qtyToSave = parseInt(customQty, 10);
      basePrice = product.offerPrice;
    } else if (selectedSlab) {
      qtyToSave = selectedQuantities[selectedSlab._id];
      basePrice = selectedSlab.price;
    } else {
      toast.warn("Please select a slab or enable custom quantity.");
      return;
    }
  }

  if (!qtyToSave || qtyToSave <= 0) {
    toast.error("Invalid quantity selected.");
    return;
  }

  // Calculate price including variant's additional price if any
  const additionalPrice = selectedVariant?.additionalPrice || 0;
  const finalPrice = basePrice + additionalPrice;

  // Show coupon code if available
  if (product.coupons && product.coupons.length > 0) {
    const firstCoupon = product.coupons[0]; // Show the first coupon code
    toast.info(
      `🎉 Special Offer! This product has a coupon: ${firstCoupon.name} — Get ${firstCoupon.percentage}% OFF!`
    );
  }

  try {
    const payload = {
      productId: productId,
      slabId: quantityMethod === "slab" ? selectedSlab?._id || null : null,
      userId: userInfo._id,
      qty: qtyToSave,
      price: finalPrice,
    };

    await saveSlabSelection(payload).unwrap();
    toast.success("Item added to cart successfully");
    navigate("/cart");
  } catch (error) {
    toast.error(error?.data?.message || "Failed to add item to cart");
  }
};

  const handleCustomQtyRequest = async () => {
    try {
      const slab = await requestSlab({
        productId,
        requestedQuantity: customQty,
        requestedBy: userInfo._id, 
        status: "Pending",
      }).unwrap();
      toast.success("Custom quantity request submitted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit slab request");
    }
  };

  const handleSlabSelect = (slab) => {
    setSelectedSlab(slab);
    setIsCustomQty(false);
    setCustomQty("");
    if (slab.couponId) {
      toast.info(
        `🎉 Special Offer! This slab has a coupon: ${slab.couponId.name} — Get ${slab.couponId.percentage}% OFF!`,
        { autoClose: 5000 }
      );
      toast.success(
        <div>
          🎉 <strong>Coupon Unlocked!</strong>
          <p>
            Code: <strong>{slab.couponId.name}</strong>
          </p>
          <p>
            Discount: <strong>{slab.couponId.percentage}% OFF</strong>
          </p>
        </div>,
        { autoClose: 5000 }
      );
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const [selectedQuantities, setSelectedQuantities] = useState({});

  useEffect(() => {
    if (product?.slabs) {
      setSelectedQuantities((prevQuantities) => {
        const newQuantities = product.slabs.reduce((acc, slab) => {
          acc[slab._id] = slab.minQuantity;
          return acc;
        }, {});

        // Avoid unnecessary re-renders
        return JSON.stringify(prevQuantities) === JSON.stringify(newQuantities)
          ? prevQuantities
          : newQuantities;
      });
    }
      if (product?.images) {
    setDisplayImages(product.images);
  }
  }, [product]);

  useEffect(() => {
    // Default to manual quantity if no slabs available
    const hasSlabs = product.slabs && product.slabs.length > 0;
    if (!hasSlabs) {
      setQuantityMethod("manual");
    }
  }, [product.slabs]);

  const handleQuantityChange = (slabId, change) => {
    setSelectedQuantities((prev) => {
      const updatedQuantities = { ...prev };
      const slab = product.slabs.find((s) => s._id === slabId);

      if (slab) {
        const newQuantity =
          (updatedQuantities[slabId] || slab.minQuantity) + change;
        updatedQuantities[slabId] = Math.min(
          Math.max(newQuantity, slab.minQuantity),
          slab.maxQuantity
        );
      }

      return updatedQuantities;
    });
  };

  // Handle default quantity change when no slabs are available
  const handleDefaultQtyChange = (change) => {
    const newQty = qty + change;
    setQty(Math.max(1, newQty));
  };

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const trackProductClick = useCallback(() => {
    if (userInfo && productId) {
      addProductClick({ productId })
        .unwrap()
        .catch((err) => console.error("Click tracking failed:", err));
    }
  }, [userInfo, productId, addProductClick]);


  //variant select
const handleVariantSelect = (variant) => {
  if (selectedVariant?._id === variant._id) {
    // If clicked variant is already selected, unselect it
    setSelectedVariant(null);
    setDisplayImages(product.images); // fallback to default images
  } else {
    setSelectedVariant(variant);

    // Show variant images if available, else product images
    if (variant.images && variant.images.length > 0) {
      setDisplayImages(variant.images);
    } else {
      setDisplayImages(product.images);
    }
  }
};


//final Price after variant selection
const finalPrice = selectedVariant
  ? product.offerPrice + (selectedVariant.additionalPrice || 0)
  : product.offerPrice;

const finalMrp = selectedVariant
  ? product.mrp + (selectedVariant.additionalPrice || 0)
  : product.mrp;

const discountPercent = finalMrp
  ? Math.round(((finalMrp - finalPrice) / finalMrp) * 100)
  : 0;

  useEffect(() => {
    trackProductClick();
  }, [trackProductClick]);

  // Check if slabs are available
  const hasSlabs = product.slabs && product.slabs.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors mb-8"
        >
          <FaArrowLeft className="mr-2" /> Back to Products
        </Link>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : error ? (
          <div className="my-8">
            <Message
              variant="danger"
              className="bg-red-50 border-red-500 text-red-700 p-4 rounded-lg"
            >
              {error?.data?.message || error.message}
            </Message>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Product Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="relative rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
<Slider {...settings} className="product-slider">
  {displayImages.map((image, index) => (
    <div key={index} className="relative w-full" style={{ aspectRatio: "4 / 5" }}>
      <img
        src={`${BASE_URL}${image}`}
        alt={`${product.name} ${index + 1}`}
        className="w-full h-full object-cover transition duration-500 hover:scale-105"
      />
    </div>
  ))}
</Slider>

                <div className="absolute top-4 right-4 z-10">
                  <HeartIcon product={product} />
                </div>
              </div>

              {/* Product Details */}
              <div className="flex flex-col space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {product.name}
                </h1>

                {/* <div className="flex items-center">
                  <Ratings value={product.rating} className="text-yellow-400" />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'}
                  </span>
                </div> */}

<div className="flex items-baseline space-x-4">
  <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
    ₹{finalPrice}
  </span>
  <span className="line-through text-xl text-gray-400 dark:text-gray-500">
    ₹{finalMrp}
  </span>
  <span className="px-2 py-1 text-sm font-semibold text-white bg-green-500 rounded-md">
    {discountPercent}% OFF
  </span>
</div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {stripHtml(product.description)}
                </p>

                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="flex items-center">
                    <FaStore className="mr-2 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Brand:</span>{" "}
                      {product.brand?.name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaBox className="mr-2 text-gray-500 dark:text-gray-400" />
                    <span
                      className={`font-medium ${
                        product.countInStock > 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {product.countInStock > 0
                        ? `In Stock (${product.countInStock})`
                        : "Out of Stock"}
                    </span>
                  </div>
                </div>

  {/* Variant Selection */}
  {product.variants && product.variants.length > 0 && (
    <div className="variant-selection mb-6">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Select Variant:
      </h4>
      <div style={{ display: "flex", gap: "10px" }}>
        {product.variants.map((variant) => (
          <button
            key={variant._id}
            onClick={() => handleVariantSelect(variant)}
            style={{
              padding: "5px 10px",
              border:
                selectedVariant?._id === variant._id
                  ? "2px solid purple"
                  : "1px solid gray",
              backgroundColor:
                selectedVariant?._id === variant._id ? "#f0e" : "#fff",
              cursor: "pointer",
              opacity: variant.countInStock === 0 ? 0.5 : 1,
            }}
            disabled={variant.countInStock === 0}
            title={`Color: ${variant.color}, Size: ${variant.size}`}
          >
            {variant.color} / {variant.size}{" "}
            {variant.countInStock === 0 && "(Out of stock)"}
          </button>
        ))}
      </div>
    </div>
  )}

                {!isSeller && product.countInStock > 0 && hasSlabs && (
                  <div className="mb-4">
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div
                          className={`flex-1 p-3 rounded-lg cursor-pointer border ${
                            quantityMethod === "manual"
                              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                          onClick={() => setQuantityMethod("manual")}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="quantityMethod"
                              checked={quantityMethod === "manual"}
                              onChange={() => setQuantityMethod("manual")}
                              className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                            />
                            <label className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                              Standard Quantity
                            </label>
                          </div>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Regular pricing at ₹{product.offerPrice} per unit
                          </p>
                        </div>

                        <div
                          className={`flex-1 p-3 rounded-lg cursor-pointer border ${
                            quantityMethod === "slab"
                              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                          onClick={() => setQuantityMethod("slab")}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="quantityMethod"
                              checked={quantityMethod === "slab"}
                              onChange={() => setQuantityMethod("slab")}
                              className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                            />
                            <label className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                              Bulk Pricing
                            </label>
                          </div>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Special pricing for bulk purchases
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Manual Quantity Selector - always available or when quantityMethod is manual */}
                {!isSeller &&
                  product.countInStock > 0 &&
                  (quantityMethod === "manual" || !hasSlabs) && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Select Quantity
                      </h3>

                      <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => handleDefaultQtyChange(-1)}
                          className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                          flex items-center justify-center transition-all hover:bg-gray-300 dark:hover:bg-gray-600
                          disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={qty <= 1}
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <input
                          type="number"
                          value={qty}
                          onChange={(e) =>
                            setQty(Math.max(1, parseInt(e.target.value) || 1))
                          }
                          className="w-16 h-10 text-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                          rounded-md shadow-sm text-gray-700 dark:text-gray-300 font-medium focus:outline-none focus:ring-2 
                          focus:ring-indigo-500"
                        />
                        <button
                          onClick={() => handleDefaultQtyChange(1)}
                          className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                          flex items-center justify-center transition-all hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          <FaPlus className="text-xs" />
                        </button>

                        <div className="ml-4 text-gray-700 dark:text-gray-300">
                          <p>
                            Unit Price:{" "}
                            <span className="font-semibold">
                              ₹{product.offerPrice}
                            </span>
                          </p>
                          <p>
                            Total:{" "}
                            <span className="font-semibold">
                              ₹{(product.offerPrice * qty).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Slabs Section - only when quantityMethod is slab */}
                {!isSeller &&
                  product.countInStock > 0 &&
                  hasSlabs &&
                  quantityMethod === "slab" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Select Bulk Quantity
                      </h3>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse rounded-lg overflow-hidden">
                          <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                              <th className="p-3 text-left text-gray-700 dark:text-gray-300">
                                Select
                              </th>
                              <th className="p-3 text-center text-gray-700 dark:text-gray-300">
                                Min Qty
                              </th>
                              <th className="p-3 text-center text-gray-700 dark:text-gray-300">
                                Max Qty
                              </th>
                              <th className="p-3 text-center text-gray-700 dark:text-gray-300">
                                Price
                              </th>
                              <th className="p-3 text-center text-gray-700 dark:text-gray-300">
                                Quantity
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {product.slabs.map((slab, index) => (
                              <tr
                                key={slab._id}
                                className={`
                                border-b border-gray-200 dark:border-gray-700
                                ${
                                  selectedSlab?._id === slab._id
                                    ? "bg-indigo-50 dark:bg-indigo-900/20"
                                    : index % 2 === 0
                                    ? "bg-white dark:bg-gray-800"
                                    : "bg-gray-50 dark:bg-gray-750"
                                }
                              `}
                              >
                                <td className="p-3 text-center">
                                  <input
                                    type="radio"
                                    name="selectedSlab"
                                    checked={selectedSlab?._id === slab._id}
                                    onChange={() => handleSlabSelect(slab)}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                  />
                                </td>
                                <td className="p-3 text-center text-gray-700 dark:text-gray-300">
                                  {slab.minQuantity}
                                </td>
                                <td className="p-3 text-center text-gray-700 dark:text-gray-300">
                                  {slab.maxQuantity}
                                </td>
                                <td className="p-3 text-center font-medium text-gray-900 dark:text-white">
                                  ₹{slab.price}
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center justify-center space-x-2">
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(slab._id, -1)
                                      }
                                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                                      flex items-center justify-center transition-all hover:bg-gray-300 dark:hover:bg-gray-600
                                      disabled:opacity-50 disabled:cursor-not-allowed"
                                      disabled={
                                        selectedQuantities[slab._id] <=
                                          slab.minQuantity ||
                                        selectedSlab?._id !== slab._id
                                      }
                                    >
                                      <FaMinus className="text-xs" />
                                    </button>
                                    <input
                                      type="number"
                                      value={
                                        selectedQuantities[slab._id] ||
                                        slab.minQuantity
                                      }
                                      readOnly
                                      className="w-14 h-8 text-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                                      rounded-md shadow-sm text-gray-700 dark:text-gray-300 font-medium focus:outline-none focus:ring-2 
                                      focus:ring-indigo-500"
                                    />
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(slab._id, 1)
                                      }
                                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                                      flex items-center justify-center transition-all hover:bg-gray-300 dark:hover:bg-gray-600
                                      disabled:opacity-50 disabled:cursor-not-allowed"
                                      disabled={
                                        selectedQuantities[slab._id] >=
                                          slab.maxQuantity ||
                                        selectedSlab?._id !== slab._id
                                      }
                                    >
                                      <FaPlus className="text-xs" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Custom Quantity Option */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isCustomQty}
                            onChange={() => {
                              setIsCustomQty(!isCustomQty);
                              if (!isCustomQty) {
                                setSelectedSlab(null);
                              }
                            }}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
                          />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            Need Bulk Quantity?
                          </span>
                        </label>

                        {isCustomQty && (
                          <div className="flex items-center mt-2 sm:mt-0">
                            <input
                              type="number"
                              value={customQty}
                              onChange={(e) => setCustomQty(e.target.value)}
                              placeholder="Enter quantity"
                              className="w-24 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                              text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-6">
                  <button
                    onClick={addToCartHandler}
                    disabled={
                      product.countInStock === 0 ||
                      product.outOfStock || // Prevents adding if outOfStock is true
                      (quantityMethod === "slab" &&
                        isCustomQty &&
                        !customQty) ||
                      (quantityMethod === "slab" &&
                        !isCustomQty &&
                        !selectedSlab)
                    }
                    className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg
                      shadow-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {product.outOfStock ? (
                      <span className="text-red-500 font-bold">
                        Out of Stock
                      </span>
                    ) : (
                      <>
                        <FaShoppingCart className="mr-2" /> Add to Cart
                      </>
                    )}
                  </button>

                  {quantityMethod === "slab" && isCustomQty && (
                    <button
                      onClick={handleCustomQtyRequest}
                      disabled={!customQty}
                      className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg
                        shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Request Bulk Quote
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Product Tabs Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
