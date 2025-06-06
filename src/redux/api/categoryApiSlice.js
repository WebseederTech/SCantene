import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Create Category
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: `${CATEGORY_URL}/createCategory`,
        method: "POST",
        body: newCategory,
      }),
    }),

    // Update Category by ID
    updateCategory: builder.mutation({
      query: ({ categoryId, updatedCategory }) => ({
        url: `${CATEGORY_URL}/updateCategoryById/${categoryId}`,
        method: "PUT",
        body: updatedCategory,
      }),
    }),

    // Delete Category by ID
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${CATEGORY_URL}/deleteCategoryById/${categoryId}`,
        method: "DELETE",
      }),
    }),

    // Get All Categories
    fetchCategories: builder.query({
      query: () => `${CATEGORY_URL}/getAllCategories`,
    }),

    // Get Category by ID (optional)
    fetchCategoryById: builder.query({
      query: (id) => `${CATEGORY_URL}/readCategoriesById/${id}`,
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
  useFetchCategoryByIdQuery, // if needed
} = categoryApiSlice;
