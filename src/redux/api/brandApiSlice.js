import { apiSlice } from "./apiSlice";
import { BRAND_URL } from "../constants";


export const brandApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBrand: builder.mutation({
      query: (newBrand) => ({
        url: `${BRAND_URL}`,
        method: "POST",
        body: newBrand,
      }),
    }),
    updateBrand: builder.mutation({
      query: ({ brandId, updatedBrand }) => ({
        url: `${BRAND_URL}/${brandId}`,
        method: "PUT",
        body: updatedBrand,
      }),
    }),
    
    deleteBrand: builder.mutation({
      query: (brandId) => ({
        url: `${BRAND_URL}/${brandId}`,
        method: "DELETE",
      }),
    }),

    fetchBrands: builder.query({  // Changed to query
      query: () => `${BRAND_URL}/brands`,
    }),
  }),
});

export const {
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useFetchBrandsQuery,  // Now properly defined
} = brandApiSlice;
