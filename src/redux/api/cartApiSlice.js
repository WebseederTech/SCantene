import { apiSlice } from "./apiSlice";
import { CART_URL } from "../constants";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new cart item
    createCartItem: builder.mutation({
      query: (newCartItem) => ({
        url: `${CART_URL}`,
        method: "POST",
        body: newCartItem,
      }),
    }),

    // Update an existing cart item
    updateCartItem: builder.mutation({
      query: ({ cartId, updatedCartItem }) => ({
        url: `${CART_URL}/${cartId}`,
        method: "PATCH",
        body: updatedCartItem,
      }),
    }),

    // Delete a cart item
    deleteCartItem: builder.mutation({
      query: (cartId) => ({
        url: `${CART_URL}/${cartId}`,
        method: "DELETE",
      }),
    }),

    // Fetch all cart items
    fetchCartItems: builder.query({
      query: () => `${CART_URL}`,
    }),

    // Fetch a single cart item by ID
    fetchCartItem: builder.query({
      query: (cartId) => `${CART_URL}/${cartId}`,
    }),
  }),
});

export const {
  useCreateCartItemMutation,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  useFetchCartItemsQuery,
  useFetchCartItemQuery,
} = cartApiSlice;
