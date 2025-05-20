import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import PrintOrderModal from "../Admin/PrintOrderModal";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const [showPrintModal, setShowPrintModal] = useState(false);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPaPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypal?.clientId) {
      const loadingPaPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPaPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order marked as delivered");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const handlePrintOrder = () => {
    setShowPrintModal(true);
  };

  // Format date and time for delivery history
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error.data.message}</Messsage>
  ) : (
    <div className="flex flex-col items-center darktheme px-6">
      {showPrintModal && order && (
        <PrintOrderModal
          order={order}
          onClose={() => setShowPrintModal(false)}
        />
      )}

      <section
        className={`relative w-full lg:w-[${
          userInfo?.role === "Admin" ? "85%" : "90%"
        }] max-w-[90%] darktheme bg-opacity-50 rounded-lg shadow-lg p-8 border-2 border-gray-600 ${
          userInfo?.role === "Admin" ? "" : "ml-0"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-customBlue">
            Order Details
          </h1>
          <button
            onClick={handlePrintOrder}
            className="bg-customBlue text-white px-4 py-2 rounded hover:bg-customBlue/90 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print Invoice
          </button>
        </div>
        

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 p-0">
            <div className="darktheme bg-opacity-50 rounded-lg shadow-lg">
              {order.orderItems.length === 0 ? (
                <Messsage>Order is empty</Messsage>
              ) : (
                <div className="overflow-x-auto rounded-lg text-sm">
                  <table className="table-auto w-full mx-auto">
                    <thead>
                      <tr className="tableheading">
                        <th className="px-4 py-2 text-left font-medium">
                          Image
                        </th>
                        <th className="px-4 py-2 text-left font-medium">
                          Product
                        </th>
                        <th className="px-4 py-2 text-left font-medium">
                          Quantity
                        </th>
                        <th className="px-4 py-2 text-left font-medium">
                          Unit Price
                        </th>
                        <th className="px-4 py-2 text-left font-medium">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((item, index) => (
                        <tr
                          key={index}
                          className="tablecontent transition-colors"
                        >
                          <td className="px-4 py-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </td>
                          <td className="px-4 py-4">{item.name}</td>
                          <td className="px-4 py-4">{item.qty}</td>
                          <td className="px-4 py-4">
                            &#8377;{item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-4">
                            &#8377;{(item.qty * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                      
              {/* Delivery History Section */}
              <div className="mt-4">
                <h3 className="font-semibold text-lg text-customBlue mb-2">Delivery History:</h3>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4">
                  {order.statusHistory && order.statusHistory.length > 0 ? (
                    <ul className="space-y-2">
                      {order.statusHistory.map((item, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span className="font-medium text-lg">{item.status}</span>
                          <span className="text-md text-gray-600 dark:text-gray-400">
                            {formatDateTime(item.date)}
                          </span>
                        </li>
                      ))}
                      {/* Add order creation if not already in history */}
                      {!order.statusHistory.some(item => 
                        new Date(item.date).getTime() === new Date(order.createdAt).getTime()
                      ) && (
                        <li className="flex items-center justify-between">
                          <span className="font-medium text-lg">Order Placed</span>
                          <span className="text-md text-gray-600 dark:text-gray-400">
                            {formatDateTime(order.createdAt)}
                          </span>
                        </li>
                      )}
                    </ul>
                  ) : (
                    <div>
                      <p className="font-medium">Current Status: {order.status}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Order Placed: {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/3 dark:bg-gray-900 bg-gray-400 shadow-lg rounded-lg p-6 bg-opacity-50">
            <div className="border-b border-gray-300 pb-4">
              <h2 className="text-xl font-semibold mb-4">Shipping</h2>
              <p className="mb-3">
                <strong className="text-customBlue">Order ID :</strong>{" "}
                {order.orderId}
              </p>
              <p className="mb-3">
                <strong className="text-customBlue">Name :</strong>{" "}
                {order.user.username}
              </p>
              <p className="mb-3">
                <strong className="text-customBlue">Email :</strong>{" "}
                {order.user.email}
              </p>
              <p className="mb-3">
                <strong className="text-customBlue">Contact NO :</strong>{" "}
                {order.user.contactNo}
              </p>
              <p className="mb-3">
                <strong className="text-customBlue">Address :</strong>{" "}
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              <p className="mb-3">
                <strong className="text-customBlue">Payment Method :</strong>{" "}
                {order.paymentMethod}
              </p>
          
            </div>

            <h2 className="text-xl font-semibold mb-4 mt-6">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="dark:text-gray-400 text-black">Items</span>
                <span className="dark:text-gray-300 text-black">
                  {order.orderItems.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="dark:text-gray-400 text-black">
                  Items Price
                </span>
                <span className="dark:text-gray-300 text-black">
                  &#8377;{order.itemsPrice?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="dark:text-gray-400 text-black">Shipping</span>
                <span className="dark:text-gray-300 text-black">
                  &#8377;{order.shippingPrice?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="dark:text-gray-400 text-black">Tax</span>
                <span className="dark:text-gray-300 text-black">
                  &#8377;{order.taxPrice?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="dark:text-gray-400 text-black">Total</span>
                <span className="dark:text-gray-300 text-black font-bold">
                  &#8377;{order.totalPrice?.toFixed(2)}
                </span>
              </div>
            </div>

            {loadingDeliver && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <div className="mt-6">
                  <button
                    type="button"
                    className="bg-customBlue/80 text-white w-full py-3 rounded-lg hover:bg-customBlue/80 focus:outline-none"
                    onClick={deliverHandler}
                  >
                    Mark As Delivered
                  </button>
                </div>
              )}
          </div>
        </div>
        
      </section>
    </div>
  );
};

export default Order;