import { baseApi } from "./baseApi";

export const collectionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCollections: builder.query({
      query: () => `/collections`,
    }),
    getCollectionById: builder.query({
      query: (collectionId) => `/collections/${collectionId}`,
    }),
    getCollectionProducts: builder.query({
      query: (collectionId) => `/collections/${collectionId}/products`,
      // Ürünleri dönüştürerek boş kontrol edilebilir
      transformResponse: (response) => {
        return {
          data: response.data || [],
          isEmpty: !response.data || response.data.length === 0,
        };
      },
    }),
    // Yeni endpoint: Koleksiyonun ürün içerip içermediğini kontrol eder
    checkCollectionHasProducts: builder.query({
      query: (collectionId) => `/collections/${collectionId}/products?limit=1`,
      transformResponse: (response) => {
        return {
          hasProducts: response.data && response.data.length > 0,
        };
      },
    }),
    // Sayfalı koleksiyon ürünleri için endpoint
    getCollectionProductsPaginated: builder.query({
      query: ({ collectionId, page = 1, limit = 6 }) => 
        `/collections/${collectionId}/products?page=${page}${limit ? `&limit=${limit}` : ''}`,
      transformResponse: (response) => ({
        data: response.data || [],
        pagination: response.pagination || {},
        isEmpty: !response.data || response.data.length === 0,
      }),
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useGetCollectionByIdQuery,
  useGetCollectionProductsQuery,
  useCheckCollectionHasProductsQuery,
  useGetCollectionProductsPaginatedQuery,
  useLazyGetCollectionProductsPaginatedQuery,
  useLazyCheckCollectionHasProductsQuery,
} = collectionsApi;