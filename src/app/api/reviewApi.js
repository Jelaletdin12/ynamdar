import { baseApi } from "./baseApi";

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitReview: builder.mutation({
      query: ({ productId, rating, title, source }) => ({
        url: `/products/${productId}/reviews`,
        method: "POST",
        body: { rating: rating, title: title, source: source },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getReviewsByProduct: builder.query({
      query: (productId) => `/reviews?product_id=${productId}`,
    }),
  }),
});

export const { useSubmitReviewMutation, useGetReviewsByProductQuery } =
  reviewsApi;
