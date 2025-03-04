import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Guest Token
    getGuestToken: builder.mutation({
      query: () => ({
        url: "/auth/guest-token",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          console.error("Error fetching guest token:", error);
        }
      },
    }),

    // Login (Sadece doğrulama kodu gönderir, token yok!)
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Register (Sadece doğrulama kodu gönderir, token yok!)
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    // Verify Token (Burada token dönecek!)
    verifyToken: builder.mutation({
      query: ({ phone_number, code }) => ({
        url: "/auth/verify",
        method: "POST",
        body: { phone_number, code },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data?.token;

          if (token) {
            // Guest token'i temizle
            document.cookie =
              "guestToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            // Auth token'i kaydet
            document.cookie = `authToken=${token}; path=/; secure; SameSite=Strict`;
          }
        } catch (error) {
          console.error("Error verifying token:", error);
        }
      },
    }),
  }),
});

export const {
  useGetGuestTokenMutation,
  useLoginMutation,
  useRegisterMutation,
  useVerifyTokenMutation,
} = authApi;
