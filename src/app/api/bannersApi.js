import { baseApi } from './baseApi';

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCarousels: builder.query({
      query: () => '/media/carousels',
    }),
    getBanners: builder.query({
      query: () => '/media/banners',
    }),
  }),
});

export const { useGetCarouselsQuery, useGetBannersQuery } = mediaApi;