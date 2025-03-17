import { baseApi } from "./baseApi";

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitContactMessage: builder.mutation({
      query: ({ phone, title, content, type }) => ({
        url: "/forms/contact-us",
        method: "POST",
        body: { phone, title, content, type },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
    }),
  }),
});

export const { useSubmitContactMessageMutation } = contactApi;
