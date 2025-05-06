import { baseApi } from "./baseApi";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (type = "tree") => `/categories?type=${type}`,
    }),
    getCategoryProducts: builder.query({
      query: ({ categoryId, page = 1, limit }) => {
        let url = `categories/${categoryId}/products?page=${page}`;
        if (limit) url += `&limit=${limit}`;
        return url;
      },
      transformResponse: (response) => ({
        data: response.data || [],
        pagination: response.pagination || {},
      }),
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
    // New lazy version for subcategory pagination
    getAllCategoryProductsPaginated: builder.query({
      async queryFn({ category, page = 1, limit = 6 }, queryApi, extraOptions, baseQuery) {
        if (!category) return { data: [] };
        
        try {
          // For first page, fetch products for the category and all children
          if (page === 1) {
            const fetchProducts = async (categoryId) => {
              const result = await baseQuery(`categories/${categoryId}/products?page=1&limit=${limit}`);
              return result.data ? result.data.data : [];
            };
    
            let allProducts = await fetchProducts(category.id);
    
            if (category.children && category.children.length > 0) {
              for (const child of category.children) {
                const childProducts = await fetchProducts(child.id);
                allProducts = [...allProducts, ...childProducts];
              }
            }
    
            return { 
              data: {
                data: allProducts,
                pagination: {
                  currentPage: 1,
                  hasMorePages: allProducts.length >= limit
                }
              }
            };
          } 
          // For subsequent pages, just fetch from the main category
          else {
            const result = await baseQuery(`categories/${category.id}/products?page=${page}&limit=${limit}`);
            return { 
              data: {
                data: result.data ? result.data.data : [],
                pagination: result.data ? result.data.pagination : {}
              }
            };
          }
        } catch (error) {
          return { error };
        }
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
  useGetAllCategoryProductsPaginatedQuery,
  useLazyGetAllCategoryProductsPaginatedQuery,
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
} = categoriesApi;