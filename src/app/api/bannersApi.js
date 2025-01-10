import { baseApi } from './baseApi';

export const mediaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      getBanners: builder.query({
        query: () => '/media/banners',
      }),
      getCarousels: builder.query({
        query: () => '/media/carousels',
      }),
    }),
  });
  