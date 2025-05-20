import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingCart, FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { BASE_URL } from "../redux/constants";
import axios from "axios";
import { useSelector } from "react-redux";
import CouponModal from "./CouponModal";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandNames, setBrandNames] = useState({});
  const [coupans, setCoupans] = useState([]);
  const [showCoupans, setShowCoupans] = useState(false);
  const [coupanData, setCoupanData] = useState({
    productId: "",
    couponCode: "",
    discount: 0,
    couponId: "",
  });

  const user = useSelector((state) => state.auth);

  // Fetch brand info and store it in state
  const fetchBrandById = async (brandId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/brand/${brandId}`);
      setBrandNames((prev) => ({
        ...prev,
        [brandId]: res.data.name || "Unknown Brand",
      }));
    } catch (error) {
      console.error("Failed to fetch brand:", error);
      setBrandNames((prev) => ({
        ...prev,
        [brandId]: "Unknown Brand",
      }));
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/users/${user.userInfo._id}`
        );
        setCartItems(res.data.cart);

        // Fetch brand info for each product in the cart
        const brandIds = new Set();
        res.data.cart.forEach((item) => {
          const brandId = item.productId.brand._id;
          if (brandId && !brandIds.has(brandId)) {
            brandIds.add(brandId);
            fetchBrandById(brandId);
          }
        });

        if (res.data?.availableCoupons?.length) {
          setCoupans(res.data.availableCoupons);
          setShowCoupans(true);
        } else {
          setShowCoupans(false); // Ensure the modal/list hides if no coupons are available
        }
      } catch (error) {
        console.error("Failed to fetch cart items", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userInfo?._id) {
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Handle quantity change - fixed logic
  const handleQuantityChange = async (item, qty) => {
    // Don't allow quantities less than 1 or more than available stock
    if (qty < 1 || qty > item.productId.countInStock) return;

    const updatedItems = cartItems.map((ci) =>
      ci._id === item._id ? { ...ci, qty } : ci
    );
    setCartItems(updatedItems);

    try {
      await axios.patch(`${BASE_URL}/api/cart/${item._id}`, { qty });
    } catch (error) {
      console.error("Failed to update cart item quantity", error);
    }
  };

  // Handle item removal
  const removeFromCartHandler = async (cartItemId) => {
    try {
      const userId = user.userInfo._id;
      await axios.delete(`${BASE_URL}/api/users/${userId}/cart/${cartItemId}`);

      // Remove only the selected item from the state
      setCartItems(cartItems.filter((item) => item._id !== cartItemId));
    } catch (error) {
      console.error("Failed to remove item from cart", error);
    }
  };

  // Navigate to checkout
  const checkoutHandler = () => {
    // Check for out-of-stock items
    const hasOutOfStockItems = cartItems.some((item) => item.productId.outOfStock);
  
    if (hasOutOfStockItems) {
      alert("Some items in your cart are out of stock. Please remove them before proceeding.");
      return;
    }
  
    // Get updated price with applied coupons
    const totalPrice = calculateTotalPrice();
  
    // Prepare checkout data
    const checkOutData = {
      cartItems: JSON.parse(localStorage.getItem("cartItems")), // Use updated cart data
      totalPrice,
    };
  
    // Store checkout data in localStorage
    localStorage.setItem("checkOutData", JSON.stringify(checkOutData));
  
    // Navigate to login before proceeding to checkout
    navigate("/login?redirect=/shipping");
  };
  
  // Calculate total price
  const calculateTotalPrice = () => {
    const updatedCartItems = cartItems.map((item) => {
      const { productId, qty } = item;
  
      // Find correct slab price based on quantity
      const slab = productId.slabs.find(
        (sl) => qty >= sl.minQuantity && qty <= sl.maxQuantity
      );
  
      let price = slab ? slab.price : productId.offerPrice;
  
      // Apply coupon if applicable
      if (coupanData && coupanData.productId === productId._id && coupanData.discount > 0) {
        price = price - (price * coupanData.discount) / 100; // Apply percentage discount
      }
  
      return { ...item, price }; // Update price for checkout
    });
  
    // Save updated cart to localStorage for future reference
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  
    return updatedCartItems
      .reduce((total, item) => total + item.price * item.qty, 0)
      .toFixed(2);
  };
  

  // Calculate total savings
  const calculateTotalSavings = () => {
    return cartItems
      .reduce((total, item) => {
        const mrp = item.productId.mrp;
        const slab = item.productId.slabs.find(
          (sl) => item.qty >= sl.minQuantity && item.qty <= sl.maxQuantity
        );
        const price = slab ? slab.price : item.productId.offerPrice;
        return total + (mrp - price) * item.qty;
      }, 0)
      .toFixed(2);
  };

  // Count total items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.qty, 0);
  };

  // Loading state with skeleton
  if (loading) {
    return (
      <div className="container mx-auto mt-12 px-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-12 rounded-lg mb-6"></div>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 animate-pulse"
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                <div className="md:ml-6 flex-1 mt-4 md:mt-0">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mt-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mt-2"></div>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-gray-200 dark:bg-gray-700 h-20 rounded-lg mt-6 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 px-4 pb-12">
      {cartItems.length === 0 ? (
        <div className="text-center py-16 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <FaShoppingCart className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center px-6 py-3 bg-customBlue text-white font-medium rounded-full hover:bg-blue-600 transition-colors"
          >
            Start Shopping <FaArrowRight className="ml-2" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
          {/* Cart Items Section */}

          <div className="flex-grow">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Shopping Cart{" "}
                <span className="text-lg font-normal text-gray-500">
                  ({getTotalItems()} items)
                </span>
              </h1>
              <Link
                to="/shop"
                className="text-customBlue hover:underline flex items-center"
              >
                <span>Continue Shopping</span>
              </Link>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => {
                const { productId } = item;
                const quantity = item.qty;
                const brandId = productId.brand;
                const brandName = brandNames[brandId] || "";

                // Find the correct slab price based on quantity
                const slab = productId.slabs.find(
                  (sl) =>
                    quantity >= sl.minQuantity && quantity <= sl.maxQuantity
                );

                let price = slab ? slab.price : productId.offerPrice;

                // Check if a coupon applies to this product and apply discount
                if (
                  coupanData.productId === productId._id &&
                  coupanData.discount > 0
                ) {
                  price = price - (price * coupanData.discount) / 100; // Apply percentage discount
                }

                const discount = (
                  ((productId.mrp - price) / productId.mrp) *
                  100
                ).toFixed(0);

                return (
                  <div
                    key={item._id}
                    className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                      productId.outOfStock
                        ? "bg-white dark:bg-gray-800 opacity-75"
                        : "bg-white dark:bg-gray-800 hover:shadow-lg"
                    }`}
                  >
                    {productId.outOfStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center z-10">
                        <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm transform rotate-12">
                          OUT OF STOCK
                        </div>
                      </div>
                    )}

                    <div className="p-4 flex flex-col sm:flex-row items-start gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <img
                          src={
                            BASE_URL + productId.images?.[0] ||
                            "https://via.placeholder.com/150"
                          }
                          alt={productId.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <Link
                          to={`/product/${productId._id}`}
                          className={`font-medium text-lg hover:underline ${
                            productId.outOfStock
                              ? "text-gray-500"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {productId.name}
                        </Link>

                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {brandName}
                        </div>

                        <div className="mt-2 flex items-baseline">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ₹{price.toLocaleString()}
                          </span>
                          <span className="ml-2 text-sm line-through text-gray-500">
                            ₹{productId.mrp.toLocaleString()}
                          </span>
                          <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                            {discount}% OFF
                          </span>
                        </div>
                        {coupanData.productId === productId._id &&
                          coupanData.discount > 0 && (
                            <div className="mt-1 text-sm text-blue-600 font-semibold">
                              Coupon Applied:{" "}
                              <span className="text-blue-800">
                                {coupanData.couponCode}
                              </span>
                            </div>
                          )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-2 mt-2 sm:mt-0">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              handleQuantityChange(item, quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            disabled={quantity <= 1 || productId.outOfStock}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={quantity}
                            readOnly
                            className="w-10 h-8 text-center border-none text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
                          />
                          <button
                            onClick={() =>
                              handleQuantityChange(item, quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            disabled={
                              quantity >= productId.countInStock ||
                              productId.outOfStock
                            }
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCartHandler(item._id)}
                          className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-1"
                        >
                          <FaTrash size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Section */}
          <div className="lg:w-80 mt-6 lg:mt-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>₹{calculateTotalPrice()}</span>
                </div>

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="text-sm italic">Calculated at checkout</span>
                </div>

                <div className="flex justify-between text-green-600 font-medium">
                  <span>You Save</span>
                  <span>₹{calculateTotalSavings()}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white mb-6">
                <span>Total</span>
                <span>₹{calculateTotalPrice()}</span>
              </div>

              <button
                onClick={checkoutHandler}
                className="w-full py-3 px-4 bg-customBlue hover:bg-blue-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={cartItems.some((item) => item.productId.outOfStock)}
              >
                {cartItems.some((item) => item.productId.outOfStock)
                  ? "Remove Out of Stock Items"
                  : "Proceed to Checkout"}
                <FaArrowRight />
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                Shipping charges may vary based on your location and will be
                calculated at checkout.
              </p>
              <CouponModal coupons={coupans} setCoupanData={setCoupanData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
