import { apiSlice } from "./apiSlice";
import { BRAND_URL } from "../constants";

export const brandApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBrand: builder.mutation({
      query: (newBrand) => ({
        url: `${BRAND_URL}/createBrand`,
        method: "POST",
        body: newBrand,
      }),
    }),
    updateBrand: builder.mutation({
      query: ({ brandId, updatedBrand }) => ({
        url: `${BRAND_URL}/updateBrand/${brandId}`,
        method: "PUT",
        body: updatedBrand,
      }),
    }),
    deleteBrand: builder.mutation({
      query: (brandId) => ({
        url: `${BRAND_URL}/deleteBrand/${brandId}`,
        method: "DELETE",
      }),
    }),
    fetchBrands: builder.query({
      query: () => `${BRAND_URL}/getAllBrands`,
    }),
    getBrandById: builder.query({
      query: (id) => `${BRAND_URL}/getBrandById/${id}`,
    }),
  }),
});

export const {
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useFetchBrandsQuery,
  useGetBrandByIdQuery,
} = brandApiSlice;
