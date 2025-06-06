import {
  BASE_URL,
  DASHBOARD_ID,
  PRODUCT_URL,
  UPLOAD_URL,
  USERS_URL,
} from "../constants";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword }) => ({
        url: `${PRODUCT_URL}/fetchProducts`,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Products"],
    }),

    getProductById: builder.query({
      query: (productId) => `${PRODUCT_URL}/getProductById/${productId}`,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    allProducts: builder.query({
      query: ({ page = 1, limit = 10,search='' } = {}) => ({
        url: `${PRODUCT_URL}/allProducts?page=${page}&limit=${limit}&search=${search}`,
      }),
      providesTags: ["Products"],
    }),

    allProductsWithoutPagination: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/products-without-pagination`,
      }),
      providesTags: ["Products"],
    }),

    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/getProductById/${productId}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    createProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCT_URL}/addProduct`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Products"],
    }),

    addProductClick: builder.mutation({
      query: (productId) => ({
        url: `${BASE_URL}/api/user-activity/click`,
        method: "POST",
        body: productId,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `${PRODUCT_URL}/updateProductById/${productId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),

    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/deleteProductById/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),

    getTopProducts: builder.query({
      query: () => `${PRODUCT_URL}/top`,
      keepUnusedDataFor: 5,
    }),

    getNewProducts: builder.query({
      query: () => `${PRODUCT_URL}/new`,
      keepUnusedDataFor: 5,
    }),

    getFilteredProducts: builder.query({
      query: ({ checked, radio }) => ({
        url: `${PRODUCT_URL}/filtered-products`,
        method: "POST",
        body: { checked, radio },
      }),
      providesTags: ["Products"],
    }),

    LowStockProducts: builder.query({
      query: () => `${PRODUCT_URL}/low-stock`,
      providesTags: ["Products"],
    }),

    updateStock: builder.mutation({
      query: ({ id, countInStock }) => ({
        url: `${PRODUCT_URL}/update-stock/${id}`,
        method: "PATCH",
        body: { countInStock },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),

    requestSlab: builder.mutation({
      query: ({ productId, requestedQuantity, requestedBy }) => ({
        url: `${PRODUCT_URL}/request-slab/${productId}`,
        method: "POST",
        body: { requestedQuantity, requestedBy },
      }),
    }),
    saveSlabSelection: builder.mutation({
      query: ({ userId, productId, slabId, qty, price }) => ({
        url: `${USERS_URL}/save-selection`,
        method: "POST",
        body: { userId, productId, slabId, qty, price },
      }),
    }),
    getSlabRequests: builder.query({
      query: ({ page, limit }) =>
        `${PRODUCT_URL}/request-slab/all-slabs?page=${page}&limit=${limit}`, // Note: removed the '/' before the '?'

      providesTags: ["SlabRequests"],
    }),

    getRetailerDashboardById: builder.query({
      query: () => ({
        url: `${BASE_URL}/api/Buyer-dashboard/${DASHBOARD_ID}`,
      }),
    }),

    // Update slab request status
    updateSlabRequestStatus: builder.mutation({
      query: ({ requestId, status }) => ({
        url: `${PRODUCT_URL}/request-slab/${requestId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["SlabRequests"],
    }),

    getCouponCode: builder.query({
      query: () => ({
        url: `${BASE_URL}/api/coupon`,
      }),
    }),
  }),
});

export const {
  useGetProductByIdQuery,
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useUploadProductImageMutation,
  useGetFilteredProductsQuery,
  useRequestSlabMutation,
  useLowStockProductsQuery,
  useUpdateStockMutation,
  useSaveSlabSelectionMutation,
  useGetSlabRequestsQuery,
  useUpdateSlabRequestStatusMutation,
  useAllProductsWithoutPaginationQuery,
  useGetRetailerDashboardByIdQuery,
  useAddProductClickMutation,
  useGetCouponCodeQuery,
} = productApiSlice;
