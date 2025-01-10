import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Guest Token
    getGuestToken: builder.mutation({
      query: () => ({
        url: '/auth/guest-token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data?.token;

          if (token) {
            document.cookie = `guestToken=${token}; path=/; secure; SameSite=Strict`;
          }
        } catch (error) {
          console.error('Error fetching guest token:', error);
        }
      },
    }),

    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data?.token;

          if (token) {
            document.cookie = `authToken=${token}; path=/; secure; SameSite=Strict`;
          }
        } catch (error) {
          console.error('Error during login:', error);
        }
      },
    }),

    // Register
    register: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/register',
        method: 'POST',
        body: userInfo,
      }),
    }),

    // Verify Token
    verifyToken: builder.query({
      query: (token) => ({
        url: '/auth/verify',
        method: 'POST',
        body: { token },
      }),
    }),
  }),
});

export const {
  useGetGuestTokenMutation,
  useLoginMutation,
  useRegisterMutation,
  useVerifyTokenQuery,
} = authApi;
