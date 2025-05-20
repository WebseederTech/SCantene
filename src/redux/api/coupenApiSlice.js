import { COUPON_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const couponApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query({
      query: () => `${COUPON_URL}`,
    }),
    createCoupon: builder.mutation({
      query: (couponData) => ({
        url: `${COUPON_URL}`,
        method: "POST",
        body: couponData,
      }),
    }),
    updateCoupon: builder.mutation({
      query: ({ id, ...couponData }) => ({
        url: `${COUPON_URL}/${id}`,
        method: "PUT",
        body: couponData,
      }),
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `${COUPON_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
