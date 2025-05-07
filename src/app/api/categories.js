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
      async queryFn(
        { category, page = 1, limit = 6 },
        queryApi,
        extraOptions,
        baseQuery
      ) {
        if (!category) return { data: [] };

        try {
          // Her kategori için "daha fazla ürün var mı" durumunu takip etmek için obje
          const hasMoreByCategory = {};

          // Her sayfada tüm kategori ve alt kategoriler için ürünleri sayfalandırarak getir
          const fetchProductsForPage = async (categoryIds, currentPage) => {
            let allPageProducts = [];
            const perCategoryLimit = Math.ceil(limit / categoryIds.length); // Limit'i kategoriler arasında dağıt

            for (const categoryId of categoryIds) {
              const result = await baseQuery(
                `categories/${categoryId}/products?page=${currentPage}&limit=${perCategoryLimit}`
              );
              if (result.data && result.data.data) {
                allPageProducts = [...allPageProducts, ...result.data.data];

                // Kategori bazında hasMore kontrolü
                hasMoreByCategory[categoryId] =
                  !!result.data.pagination.next_page_url;
              }
            }

            return allPageProducts;
          };

          // Ana kategori ve tüm alt kategorilerin ID'lerini topla
          const categoryIds = [category.id];
          if (category.children && category.children.length > 0) {
            category.children.forEach((child) => categoryIds.push(child.id));
          }

          // Seçilen sayfa için tüm kategorilerin ürünlerini getir
          const productsForPage = await fetchProductsForPage(categoryIds, page);

          // En az bir kategoride daha fazla ürün varsa hasMorePages true olsun
          const hasMorePages = Object.values(hasMoreByCategory).some(
            (hasMore) => hasMore
          );

          return {
            data: {
              data: productsForPage,
              pagination: {
                currentPage: page,
                hasMorePages: hasMorePages,
              },
            },
          };
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
