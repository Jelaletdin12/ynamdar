import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://142.93.17.78/api/v1/',

    prepareHeaders: (headers) => {
      // Cookie'deki guest token'i ekle
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});

      if (cookies.guestToken) {
        headers.set('Authorization', `Bearer ${cookies.guestToken}`);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
});
