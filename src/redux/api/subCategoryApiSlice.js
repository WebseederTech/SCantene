// redux/api/subCategoryApiSlice.js
import { apiSlice } from "./apiSlice";
import { SUBCATEGORY_URL } from "../constants";

export const subCategoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({


    createSubCategory: builder.mutation({
      query: (newSubCategory) => ({
        url: `${SUBCATEGORY_URL}/addSubCategory`,
        method: "POST",
        body: newSubCategory,
      }),
    }),

    updateSubCategory: builder.mutation({
      query: ({ subCategoryId, updatedSubCategory }) => ({
        url: `${SUBCATEGORY_URL}/updateSubCategory/${subCategoryId}`,
        method: "PUT",
        body: updatedSubCategory,
      }),
    }),

    deleteSubCategory: builder.mutation({
      query: (subCategoryId) => ({
        url: `${SUBCATEGORY_URL}/deleteSubCategoryById/${subCategoryId}`,
        method: "DELETE",
      }),
    }),

    fetchSubCategories: builder.query({
      query: () => `${SUBCATEGORY_URL}/getAllsubCategoriesList`,
    }),
  }),
});

export const {
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useFetchSubCategoriesQuery,
} = subCategoryApiSlice;
