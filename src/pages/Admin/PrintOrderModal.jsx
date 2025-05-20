import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import logo from "../../Assets/logo.png";

const PrintOrderModal = ({ order, onClose }) => {
  const contentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Order-${order.orderId}`,
    onAfterPrint: () => onClose(),
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <h2 className="text-xl font-semibold">Order Invoice</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="bg-customBlue text-white px-4 py-2 rounded hover:bg-customBlue/90"
            >
              Print Invoice
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable content */}
        <div className="p-4" ref={contentRef}>
          <OrderInvoice order={order} />
        </div>
      </div>
    </div>
  );
};

const OrderInvoice = ({ order }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white text-black p-2 max-w-4xl mx-auto font-exo">
      {/* Header - Company and Invoice Title in two columns */}
      <div className="flex justify-between mb-2">
        {/* Left column - Company info */}
        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <img src={logo} alt="Company Logo" className="h-6" />
          </div>
          <div className="text-sm">
            <p>{order.company?.address1 || "241/4 Kailod Hala, behind Hotal Fagun, "}</p>
            <p>{order.company?.address2 || "Sda Compound, Lasudia Mori,"}</p>
            <p>{order.company?.cityState || "Indore, Madhya Pradesh 452001"}</p>
            <p>{order.company?.country || "India"}</p>
            <p className="">
              GST Reg #: {order.company?.gstNumber || "23ADUPK6292PIZM"}
            </p>
          </div>
        </div>

        {/* Right column - Invoice title and details */}
        <div className="text-right ">
          <h1 className="text-xl font-bold mb-2">INVOICE</h1>
          <div className="text-lg">
            <p className="mb-1 text-sm">
              <span className="font-semibold ">Invoice #</span> {order.orderId}
            </p>
            <p className="mb-1 text-sm">
              <span className="font-semibold">Invoice Issued #</span>{" "}
              {formatDate(order.createdAt)}
            </p>
            <p className="mb-1 text-sm">
              <span className="font-semibold">Invoice Amount #</span> &#8377;
              {order.totalPrice.toFixed(2)} (INR)
            </p>
            {order.nextBillingDate && (
              <p className="mb-1 text-sm">
                <span className="font-semibold">Next Billing Date #</span>{" "}
                {formatDate(order.nextBillingDate)}
              </p>
            )}
            <p className=" text-sm">
              <span className="font-semibold">Order Nr. #</span> {order.orderId}
            </p>
            <p className="text-green-600 font-bold text-md mt-1 ">
              {order.status.toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal Line */}
      <div className="border-t border-gray-300 mb-1"></div>

      {/* Billed To Section */}
      <div className="mb-2">
        <h2 className="text-md font-bold ">BILLED TO</h2>
        <div className="text-md">
          <p className="font-semibold">{order.user.username}</p>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city} {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
          <p>{order.user.email}</p>
          <p>{order.user.contactNo}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="border-t border-gray-300 "></div>

      <div className="mb-1">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-2">DESCRIPTION</th>
              <th className="text-center py-3 px-2">QTY</th>
              <th className="text-right py-3 px-2">PRICE</th>
              <th className="text-right py-3 px-2">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 px-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    )}
                  </div>
                </td>
                <td className="py-3 px-2 text-center">{item.qty}</td>
                <td className="py-3 px-2 text-right">
                  &#8377;{item.price.toFixed(2)}
                </td>
                <td className="py-3 px-2 text-right">
                  &#8377;{(item.price * item.qty).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end mb-2">
        <div className="w-72">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>&#8377;{order.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between  py-1">
            <span>Shipping:</span>
            <span>&#8377;{order.shippingPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between  py-1">
            <span>Tax (GST):</span>
            <span>&#8377;{order.taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 font-bold border-t border-gray-300 ">
            <span>Total:</span>
            <span>&#8377;{order.totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Payments:</span>
            <span>
              (&#8377;{order.isPaid ? order.totalPrice.toFixed(2) : "0.00"})
            </span>
          </div>
          <div className="flex justify-between py-1 font-bold border-t border-gray-300 ">
            <span>Amount Due (INR):</span>
            <span>
              &#8377;{order.isPaid ? "0.00" : order.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="border-t pt-3 text-xs mt-8">
        <p className="font-medium mb-1">Terms & Conditions:</p>
        <p className="mb-2">
          Payment is due within 30 days. Please make checks payable to Your
          Company Name or Bank Transfer.
        </p>
        <p className="text-center mt-4 text-gray-500">
          Thank you for your business!
        </p>
      </div>
    </div>
  );
};

export default PrintOrderModal;
