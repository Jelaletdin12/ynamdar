import { baseApi } from "./baseApi";

export const brandsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.type) {
          queryParams.append("type", params.type);
        }
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

    getBrandDetails: builder.query({
      query: (brandId) => `/brands/${brandId}`,
      transformResponse: (response) => response.data || response,
    }),
    
    getBrandProducts: builder.query({
      query: (params) => {
        // Handle both string ID and object with pagination params
        if (typeof params === 'string' || typeof params === 'number') {
          return `/brands/${params}/products`;
        }
        
        // Handle object with pagination
        const { id, page = 1, limit } = params;
        let url = `/brands/${id}/products?page=${page}`;
        
        if (limit) {
          url += `&limit=${limit}`;
        }
        
        return url;
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
  useLazyGetBrandProductsQuery,
} = brandsApi;