import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL, USERS_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => {
        // Check if we're handling file uploads (Bank Transfer) or plain JSON (Razorpay)
        const isFormData = orderData instanceof FormData;

        return {
          url: `${ORDERS_URL}/`,
          method: "POST",
          body: orderData,
          // Set headers only if NOT FormData — otherwise, browser sets boundaries for us
          headers: isFormData
            ? undefined
            : { "Content-Type": "application/json" },
        };
      },
      invalidatesTags: ["Order"],
    }),
    createBankTransferOrder: builder.mutation({
      query: (formData) => ({
        url: `${ORDERS_URL}/bank-transfer`,
        method: "POST",
        body: formData,
        formData: true, // Important for multipart/form-data
      }),
      invalidatesTags: ["Order"],
    }),
    createRazorpayOrder: builder.mutation({
      query: (orderData) => {
        // Check if we're handling file uploads (Bank Transfer) or plain JSON (Razorpay)
        const isFormData = orderData instanceof FormData;

        return {
          url: `${ORDERS_URL}/create-razorpay-order`,
          method: "POST",
          body: orderData,
          // Set headers only if NOT FormData — otherwise, browser sets boundaries for us
          headers: isFormData
            ? undefined
            : { "Content-Type": "application/json" },
        };
      },
      invalidatesTags: ["Order"],
    }),

    // Create a Bank Transfer order with document upload
    // createRazorpayOrder: builder.mutation({
    //   query: (formData) => ({
    //     url: `${ORDERS_URL}/create-razorpay-order`,
    //     method: "POST",
    //     body: formData,
    //     formData: true, // Important for multipart/form-data
    //   }),
    //   invalidatesTags: ["Order"],
    // }),

    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
    }),

    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),

    deleteUserCartItems: builder.mutation({
      query: ({ userId }) => ({
        url: `${USERS_URL}/cartDelete/${userId}`,
        method: "DELETE",
      }),
    }),

    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
    }),

    getMyOrders: builder.query({
      query: ({ id, page = 1, limit = 10 }) => ({
        url: `${ORDERS_URL}/user/${id}?page=${page}&limit=${limit}`,
      }),
      keepUnusedDataFor: 5,
    }),

    getOrders: builder.query({
      query: ({ page, limit }) => ({
        url: `${ORDERS_URL}?page=${page}&limit=${limit}`,
      }),
    }),

    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),

    getTotalOrders: builder.query({
      query: () => `${ORDERS_URL}/admin/total-orders`,
    }),

    getTotalSalesman: builder.query({
      query: () => `${ORDERS_URL}/admin/total-Salesman`,
    }),

    getTotalSalesmanByDate: builder.query({
      query: () => `${ORDERS_URL}/admin/total-Salesman-by-date`,
    }),
    // New endpoint to get user's order count
    getUserOrdersCount: builder.query({
      query: (userId) => ({
        url: `${ORDERS_URL}/count/${userId}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.count;
      },
    }),
    // Add the updateOrderStatus mutation here
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `${ORDERS_URL}/admin/orders/${orderId}/status`, // Adjust the URL as needed for your API
        method: "PATCH",
        body: { status },
      }),
    }),
    // In orderApiSlice.js
    getInvoiceProforma: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/invoice`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetTotalOrdersQuery,
  useGetTotalSalesmanQuery,
  useGetTotalSalesmanByDateQuery,
  useDeleteUserCartItemsMutation,
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  useGetOrdersQuery,
  // Export the updateOrderStatus mutation hook
  useUpdateOrderStatusMutation,
  useCreateBankTransferOrderMutation,
  useCreateRazorpayOrderMutation,
  useGetUserOrdersCountQuery,
  useGetInvoiceProformaMutation
} = orderApiSlice;
