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
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useGetCollectionByIdQuery,
  useGetCollectionProductsQuery,
} = collectionsApi;
