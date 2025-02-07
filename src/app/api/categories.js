import { baseApi } from "./baseApi";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (type = "tree") => `/categories?type=${type}`,
    }),
    getCategoryProducts: builder.query({
      query: (category) => `categories/${category}/products`,
    }),
    getAllCategoryProducts: builder.query({
      async queryFn(category, queryApi, extraOptions, baseQuery) {
        const fetchProducts = async (categoryId) => {
          const result = await baseQuery(`categories/${categoryId}/products`);
          return result.data ? result.data.data : [];
        };

        let allProducts = await fetchProducts(category.id);

        for (const child of category.children) {
          const childProducts = await fetchProducts(child.id);
          allProducts = [...allProducts, ...childProducts];
        }

        return { data: allProducts };
      },
    }),
    getProductById: builder.query({
      query: (productId) => `/products/${productId}`,
    }),
    getRelatedProducts: builder.query({
      query: (productId) => `/products/${productId}/related`,
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryProductsQuery,
  useGetAllCategoryProductsQuery,
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
} = categoriesApi;
