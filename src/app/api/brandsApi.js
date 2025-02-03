// features/brands/brandsApi.js
import { baseApi } from './baseApi';

export const brandsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: (type = 'market') => `/brands?type=${type}`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetBrandsQuery, useLazyGetBrandsQuery } = brandsApi;