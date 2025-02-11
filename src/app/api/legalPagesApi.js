import { baseApi } from "./baseApi";

export const legalPagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLegalPages: builder.query({
      query: () => `/legal-pages`,
    }),
    getLegalPageBySlug: builder.query({
      query: (slug) => `/legal-pages/${slug}`,
    }),
  }),
});

export const {
  useGetLegalPagesQuery,
  useGetLegalPageBySlugQuery,
} = legalPagesApi;