// features/brands/brandsApi.js
import { baseApi } from "./baseApi";

export const brandsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: (params = {}) => {
        // Build query string from params
        const queryParams = new URLSearchParams();

        // Add type if provided
        if (params.type) {
          queryParams.append("type", params.type);
        }

        // Add pagination params if provided
        if (params.page) {
          queryParams.append("page", params.page);
        }

        if (params.limit) {
          queryParams.append("limit", params.limit);
        }

        const queryString = queryParams.toString();
        return `/brands${queryString ? `?${queryString}` : ""}`;
      },
      transformResponse: (response) => response.data || response,
    }),

    // New endpoint to get details of a specific brand
    getBrandDetails: builder.query({
      query: (brandId) => `/brands/${brandId}`,
      transformResponse: (response) => response.data || response,
    }),
    getBrandProducts: builder.query({
      query: (brandId) => {
        return `/brands/${brandId}/products`;
      },
      transformResponse: (response) => {
        return response.data || response;
      },
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useLazyGetBrandsQuery,
  useGetBrandDetailsQuery,
  useGetBrandProductsQuery,
} = brandsApi;
