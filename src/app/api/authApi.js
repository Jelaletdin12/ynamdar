import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGuestToken: builder.mutation({
      query: () => ({
        url: "auth/guest-token",
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
            localStorage.setItem("guestToken", token);
          }
        } catch (error) {
          console.error("Error fetching guest token:", error);
        }
      },
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    verifyToken: builder.mutation({
      query: ({ phone_number, code }) => ({
        url: "/auth/verify",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: { phone_number, code },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data.data;
          console.log("Full Response:", data);
          console.log("New TOken:", token);
          if (token) {
            localStorage.removeItem("guestToken");
            document.cookie =
              "guestToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            localStorage.setItem("authToken", token);
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
