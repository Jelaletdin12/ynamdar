import { baseApi } from './baseApi';

export const locationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query({
      query: () => '/provinces',
    }),
  }),
});

export const { useGetLocationsQuery } = locationApi;