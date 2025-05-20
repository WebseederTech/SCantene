import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import {
  useCreateBankTransferOrderMutation,
  useCreateOrderMutation,
  useCreateRazorpayOrderMutation,
  useDeleteUserCartItemsMutation,
  useGetUserOrdersCountQuery,
} from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { io } from "socket.io-client";
import { BASE_URL, REACT_APP_RAZORPAY_KEY_ID } from "../../redux/constants";

const socket = io(`${BASE_URL}`); // Replace with your server URL

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [shippingRate, setShippingRate] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDiscountPopup, setShowDiscountPopup] = useState(false);
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const cart = JSON.parse(localStorage.getItem("checkOutData")) || {};
  const user = useSelector((state) => state.auth); // or wherever user is stored
  const userId = user.userInfo._id;
  const key = REACT_APP_RAZORPAY_KEY_ID;

  // Fetch user's order count to determine if this is their first order
  const { data: userOrdersCount, isLoading: isLoadingOrderCount } =
    useGetUserOrdersCountQuery(userId);

  useEffect(() => {
    // If user has no previous orders, set isFirstOrder to true
    if (userOrdersCount !== undefined && userOrdersCount === 0) {
      setIsFirstOrder(true);
      setShowDiscountPopup(true);
      // Hide popup after 5 seconds
      setTimeout(() => {
        setShowDiscountPopup(false);
      }, 5000);
    }
  }, [userOrdersCount]);

  console.log(cart, "cart");

  const [createOrder] = useCreateOrderMutation();
  const [createRazorpayOrder, { isLoading, error }] =
    useCreateRazorpayOrderMutation();
  const [createBankTransferOrder] = useCreateBankTransferOrderMutation();

  const [deleteCart] = useDeleteUserCartItemsMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  // Function to load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // // Apply first order discount (2%)
  // const applyDiscount = (price) => {
  //   if (isFirstOrder) {
  //     return price * 0.98; // 2% discount
  //   }
  //   return price;
  // };

  // Function to handle Razorpay payment
  const handleRazorpayPayment = async (orderData) => {
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      toast.error(
        "Razorpay SDK failed to load. Check your internet connection."
      );
      return;
    }

    // Apply discount to amount if it's the user's first order
    const discountedAmount = isFirstOrder
      ? orderData.amount * 0.98
      : orderData.amount;

    const options = {
      key: key,
      amount: discountedAmount.toString(),
      currency: orderData.currency,
      name: "Osiya Enterprise",
      description: isFirstOrder
        ? "Payment for your order (2% First Order Discount Applied)"
        : "Payment for your order",
      order_id: orderData.orderId,
      handler: async function (response) {
        try {
          // ✅ Send payment details to backend for verification & order creation
          const paymentData = {
            orderCreationId: orderData.orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            orderItems: orderData.orderItems,
            user: user?.userInfo._id,
            shippingAddress: orderData.shippingAddress,
            paymentMethod: "RazorPay",
            orderSummary: orderData.orderSummary,
            isFirstOrder: isFirstOrder,
          };

          console.log("Sending paymentData to backend:", paymentData);

          // ✅ Make API call to create the order in the backend
          const backendResponse = await fetch(`${BASE_URL}/api/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentData),
          });

          const data = await backendResponse.json();
          console.log("Backend Order Creation Response:", data);

          // ✅ If order is successfully created, clear cart & navigate
          if (data.order) {
            await deleteCart({
              userId: orderData.user || user?.userInfo._id,
            }).unwrap();
            dispatch(clearCartItems());
            navigate(`/order/${data.order._id}`);
            toast.success("Payment successful & Order Created!");
          } else {
            throw new Error("Order creation failed after payment.");
          }
        } catch (error) {
          console.error(
            "Payment verification or order creation failed:",
            error
          );
          toast.error("Payment verification failed, please contact support.");
        }
      },
      prefill: {
        name: user.userInfo.username || "",
        email: user.userInfo.email || "",
        contact: user.userInfo.contactNo || "",
      },
      notes: {
        address: orderData.shippingAddress.address,
        isFirstOrder: isFirstOrder ? "Yes" : "No",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    paymentObject.on("payment.failed", function (response) {
      toast.error(`Payment failed: ${response.error.description}`);
    });
  };

  const placeOrderHandler = async () => {
    try {
      setIsProcessing(true);
      const orderItems = cart.cartItems.map((item) => ({
        name: item.productName,
        qty: item.qty,
        image: item.productId.images[0],
        price: item.slabData?.price ?? item.price,
        productData: item.productId,
        product: item.productId._id,
        taxablePrice:
          (item.slabData?.price ?? item.price) /
          ((100 + (item.productId?.tax || 0)) / 100),
        taxAmount:
          (item.slabData?.price ?? item.price) -
          (item.slabData?.price ?? item.price) /
            ((100 + (item.productId?.tax || 0)) / 100),
        totalPrice: item.qty * (item.slabData?.price ?? item.price),
        shippingRate: item.productId.shippingRate,
      }));

      console.log(JSON.stringify(orderItems), "orderItems");

      // Calculate order summary with potential discount
      const itemsPrice = cart.cartItems.reduce(
        (acc, item) => acc + (item.slabData?.price ?? item.price) * item.qty,
        0
      );

      const shippingPrice = cart.cartItems.reduce(
        (acc, item) => acc + item.productId.shippingRate * item.qty,
        0
      );

      const taxAmount = cart.cartItems.reduce(
        (acc, item) =>
          acc +
          ((item.slabData?.price ?? item.price) -
            (item.slabData?.price ?? item.price) /
              ((100 + (item.productId?.tax || 0)) / 100)) *
            item.qty,
        0
      );

      // Original total before discount
      const originalTotal = itemsPrice + shippingPrice;

      // Apply discount if first order
      const discountAmount = isFirstOrder ? originalTotal * 0.02 : 0;
      const discountedTotal = originalTotal - discountAmount;

      // Final total with tax
      const finalTotal = discountedTotal + taxAmount;

      const orderSummary = {
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        taxAmount: taxAmount,
        discountAmount: discountAmount,
        totalPrice: finalTotal,
        isFirstOrder: isFirstOrder,
      };

      const shippingInfo = cart.shippingAddress;

      if (cart.paymentMethod === "RazorPay") {
        // Use the Razorpay-specific API
        const response = await createRazorpayOrder({
          orderItems,
          user: userId,
          shippingAddress: shippingInfo,
          paymentMethod: "RazorPay",
          orderSummary,
          isFirstOrder,
        }).unwrap();

        if (response.orderId) {
          await handleRazorpayPayment({
            orderId: response.orderId,
            amount: response.amount,
            currency: response.currency,
            orderItems,
            shippingAddress: shippingInfo,
            orderSummary,
          });
        } else {
          throw new Error("Invalid Razorpay response");
        }
      } else if (cart.paymentMethod === "Bank Transfer") {
        // Use the Bank Transfer-specific API with FormData
        const formData = new FormData();

        // Make sure orderItems is properly stringified
        const orderItemsString = JSON.stringify(orderItems);
        formData.append("orderItems", orderItemsString);
        formData.append("user", userId);
        formData.append(
          "shippingAddress",
          JSON.stringify(cart.shippingAddress)
        );
        formData.append("paymentMethod", cart.paymentMethod);
        formData.append("orderSummary", JSON.stringify(orderSummary));
        formData.append("isFirstOrder", isFirstOrder.toString());

        // Debug logging to make sure our data is correct
        console.log("OrderItems being sent:", orderItemsString);

        // Add document if available
        if (cart.document) {
          // Ensure we're appending the actual file or blob, not a data URL
          // If cart.document is a data URL, convert it to a Blob first
          if (
            typeof cart.document === "string" &&
            cart.document.startsWith("data:")
          ) {
            const response = await fetch(cart.document);
            const blob = await response.blob();
            formData.append("document", blob, "payment_proof.jpg");
          } else {
            formData.append("document", cart.document);
          }
        }

        // Debug FormData payload
        for (let pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }

        // Change from createOrder to createBankTransferOrder
        const response = await createBankTransferOrder(formData).unwrap();
        console.log("Bank Transfer Order Response:", response);
        await deleteCart({ userId }).unwrap();
        dispatch(clearCartItems());
        navigate(`/order/${response.order._id}`);
        toast.success("Order placed successfully!");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to place order"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const totalTaxAmount = cart.cartItems.reduce((acc, item) => {
    const P1 = item.slabData?.price ?? item.price; // Prefer slabData.price, fallback to item.price
    const T1 = item.productId?.tax || 0;
    const TP1 = P1 / ((100 + T1) / 100);
    const TU1 = P1 - TP1;
    return acc + TU1 * item.qty;
  }, 0);

  useEffect(() => {
    const getShippingCharges = cart.cartItems.map((data) =>
      setShippingRate(data.productId.shippingRate)
    );
  }, []);

  const totalShippingPrice = cart.cartItems.reduce((acc, item) => {
    return acc + item.productId.shippingRate * item.qty;
  }, 0);

  const totalTaxablePrice = cart.cartItems.reduce((acc, item) => {
    const P1 = item.slabData?.price ?? item.price; // Prefer slabData.price, fallback to item.price
    const T1 = item.productId?.tax || 0;
    const TP1 = P1 / ((100 + T1) / 100); // Taxable price per unit
    return acc + TP1 * item.qty;
  }, 0);

  // Calculate amounts for display
  const subtotal = totalTaxablePrice + totalShippingPrice;
  const discountAmount = isFirstOrder ? subtotal * 0.02 : 0;
  const finalTotal = subtotal + totalTaxAmount - discountAmount;

  useEffect(() => {
    socket.on("orderCreated", (order) => {
      console.log("New Order Created:", order);
      // Update your state or UI
    });

    return () => {
      socket.off("orderCreated");
    };
  }, []);

  return (
    <>
      {/* First Order Discount Popup */}
      {showDiscountPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-customBlue text-white p-6 rounded-lg shadow-xl border-2 border-purple-400 transform transition-transform duration-300 animate-bounce">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">
                🎉 Congratulations! 🎉
              </h3>
              <p className="text-xl">As a first-time customer, you get</p>
              <p className="text-3xl font-bold my-3">2% OFF</p>
              <p>This discount has been automatically applied to your order.</p>
              <button
                onClick={() => setShowDiscountPopup(false)}
                className="mt-4 px-4 py-2 bg-white text-customBlue rounded-md hover:bg-gray-200 transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 -z-10"
            onClick={() => setShowDiscountPopup(false)}
          ></div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center bg-black">
        <section className="relative w-full max-w-7xl bg-black bg-opacity-50 rounded-lg shadow-lg p-8 border-2 border-gray-600">
          <ProgressSteps step1 step2 step3 />

          <div className="container mx-auto mt-12 px-6 sm:px-8 lg:px-12">
            {cart.cartItems.length === 0 ? (
              <div className="bg-gray-800 text-white text-center p-6 rounded-lg shadow-xl">
                <Message>Your cart is empty</Message>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="overflow-hidden bg-gray-900 shadow-lg rounded-lg">
                  <table className="w-full table-auto text-white">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                          Image
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                          Product
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                          Quantity
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                          Rate
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                          Taxable Price
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                          Tax Amount (TU1)
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                          Total Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.cartItems.map((item, index) => {
                        const P1 = item.slabData?.price ?? item.price; // Prioritize slabData.price, fallback to item.price
                        console.log(P1, "P1");
                        const T1 = item.productId?.tax || 0;

                        // Calculate taxable price and tax amount per unit
                        const TP1 = P1 / ((100 + T1) / 100);
                        const TU1 = P1 - TP1;

                        return (
                          <tr
                            key={index}
                            className="border-t border-gray-800 hover:bg-gray-700"
                          >
                            <td className="px-6 py-4">
                              <img
                                src={item.productId.images[0]}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <Link
                                to={`/product/${item.product}`}
                                className="text-customBlue hover:underline"
                              >
                                {item.productId.name}
                              </Link>
                            </td>
                            <td className="px-6 py-4">{item.qty}</td>
                            <td className="px-6 py-4">
                              &#8377;{P1.toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                              &#8377;{TP1.toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                              &#8377;{TU1.toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                              &#8377;{(item.qty * P1).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-lg shadow-xl border-2 border-gray-600 transform hover:scale-105 transition-transform duration-300">
                    <h2 className="text-2xl font-bold text-white mb-4">
                      Order Summary
                    </h2>

                    <div className="space-y-4">
                      <p className="flex justify-between text-lg text-gray-300">
                        <span>Items Price:</span>
                        <span>&#8377;{totalTaxablePrice.toFixed(2)}</span>
                      </p>
                      <p className="flex justify-between text-lg text-gray-300">
                        <span>Shipping Price:</span>
                        <span>&#8377;{totalShippingPrice}</span>
                      </p>
                      <p className="flex justify-between text-lg text-gray-300">
                        <span>Tax Amount:</span>
                        <span>&#8377;{totalTaxAmount.toFixed(2)}</span>
                      </p>

                      {isFirstOrder && (
                        <p className="flex justify-between text-lg text-green-400 font-semibold">
                          <span>First Order Discount (2%):</span>
                          <span>-&#8377;{discountAmount.toFixed(2)}</span>
                        </p>
                      )}

                      <p className="flex justify-between text-xl font-bold text-white">
                        <span>Total Price:</span>
                        <span>&#8377;{finalTotal.toFixed(2)}</span>
                      </p>

                      {isFirstOrder && (
                        <div className="mt-2 p-2 bg-green-900 bg-opacity-50 rounded-md text-center">
                          <p className="text-green-400 font-medium">
                            2% First Order Discount Applied!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-lg shadow-xl border-2 border-gray-600 transform hover:scale-105 transition-transform duration-300">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Shipping Information
                    </h3>
                    <p className="text-lg text-gray-300">
                      <strong>Address:</strong> {cart.shippingAddress.address}{" "}
                      <br />
                      <strong>City:</strong> {cart.shippingAddress.city} <br />
                      <strong>Pincode:</strong>{" "}
                      {cart.shippingAddress.postalCode} <br />
                      <strong>State:</strong> {cart.shippingAddress.country}
                      <br />
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-lg shadow-xl border-2 border-gray-600 transform hover:scale-105 transition-transform duration-300">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Payment Method
                    </h3>
                    <p className="text-lg text-gray-300">
                      <strong>Method:</strong> {cart.paymentMethod}
                    </p>
                    {cart.paymentMethod === "RazorPay" && (
                      <p className="mt-4 text-sm text-gray-400">
                        You will be redirected to Razorpay payment gateway after
                        placing the order.
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full p-4 bg-customBlue text-white rounded-md mt-6 transition duration-300 hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue disabled:bg-purple-300"
                  disabled={
                    cart.cartItems.length === 0 || isProcessing || isLoading
                  }
                  onClick={placeOrderHandler}
                >
                  {isProcessing || isLoading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      {cart.paymentMethod === "RazorPay"
                        ? "Proceed to Payment"
                        : "Place Order"}
                    </>
                  )}
                </button>

                {isLoading && <Loader />}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default PlaceOrder;
