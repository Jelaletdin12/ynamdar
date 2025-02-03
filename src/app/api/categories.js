import { baseApi } from './baseApi';

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (type = 'tree') => `/categories?type=${type}`,
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;


