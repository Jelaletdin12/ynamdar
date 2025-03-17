import { baseApi } from "./baseApi";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => {
        const authToken = localStorage.getItem("authToken");
        return {
          url: "profile",
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
        };
      },
    }),
    updateProfile: builder.mutation({
      query: (profileData) => {
        const authToken = localStorage.getItem("authToken");
        return {
          url: "profile",
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: profileData,
        };
      },
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
