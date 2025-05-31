import { apiSlice } from "./apiSlice";
import { BASE_URL, USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PATCH",
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: ({ page, limit }) => ({
        url: `${USERS_URL}/getAllUsers?page=${page}&limit=${limit}`,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),

    getOnlyBuyers: builder.query({
      query: ({ page, limit }) => ({
        url: `${USERS_URL}/get-users?page=${page}&limit=${limit}`,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),

    getBuyers: builder.query({
      query: ({ page, limit }) => ({
        url: `${USERS_URL}/get-all-Buyers/?page=${page}&limit=${limit}`,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),

    getUserActivity: builder.query({
      query: ({ userId, page = 1, limit = 10 }) => ({
        url: `${BASE_URL}/api/user-activity/${userId}?page=${page}&limit=${limit}`,
      }),
      keepUnusedDataFor: 5,
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    approvedUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/user/approve`,
        method: "PATCH",
        body: data,
      }),
    }),
    addUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/add-user`,
        method: "POST",
        body: data,
      }),
    }),
    // Forgot Password Mutation
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/forgot-password`,
        method: "POST",
        body: data,
      }),
    }),
    // Verify OTP Mutation
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verify-otp`,
        method: "POST",
        body: data,
      }),
    }),
    // Change Password Mutation
    changePassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/change-password`,
        method: "POST",
        body: data,
      }),
    }),

    updateAlterContact: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/update-alternative-contact`,
        method: "POST",
        body: data,
      }),
    }),

    addAddresses: builder.mutation({
      query: ({ userId, addresses }) => ({
        url: `${USERS_URL}/add-addresses/${userId}`,
        method: "POST",
        body: { addresses },
      }),
    }),
    verifyOtpForAdmin: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verify-otp-admin`, // Replace USERS_URL with the actual base URL
        method: "POST",
        body: data,
      }),
    }),
    updateAddress: builder.mutation({
      query: ({ userId, addressId, addressData }) => ({
        url: `${BASE_URL}/api/users/${userId}/address/${addressId}`,
        method: "PATCH",
        body: addressData,
      }),
    }),

    deleteAddress: builder.mutation({
      query: ({ userId, addressId }) => ({
        url: `${USERS_URL}/${userId}/address/${addressId}`,
        method: "DELETE",
      }),
    }),
    submitBugReport: builder.mutation({
      query: ({ formData }) => ({
        url: `${BASE_URL}/api/bug-report/`,
        method: "POST",
        body: formData,
        formData: true, // Important for file uploads
      }),
      invalidatesTags: ["User"],
    }),
    getBugReports: builder.query({
      query: ({ page, limit }) =>
        `${BASE_URL}/api/bug-report/?page=${page}&limit=${limit}`,
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),
    getUsersWithCart: builder.query({
      query: () => ({
        url: `${USERS_URL}/admin/users-with-cart`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),

    adminRemoveUserCartItem: builder.mutation({
      query: ({ userId, productId }) => ({
        url: `${USERS_URL}/admin/remove-cart-item/${userId}/${productId}`,
        method: "DELETE",
      }),
    }),

    removeAllCartItemsOfUser: builder.mutation({
      query: ({ userId }) => ({
        url: `${USERS_URL}/admin/clear-cart/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useGetBuyersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useApprovedUserMutation,
  useAddUserMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useChangePasswordMutation,
  useUpdateAlterContactMutation,
  useAddAddressesMutation,
  useVerifyOtpForAdminMutation,
  useGetOnlyBuyersQuery,
  useGetUserActivityQuery,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSubmitBugReportMutation,
  useGetBugReportsQuery,
  useGetUsersWithCartQuery,
  useAdminRemoveUserCartItemMutation,
  useRemoveAllCartItemsOfUserMutation,
} = userApiSlice;
