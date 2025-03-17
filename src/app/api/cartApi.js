import { baseApi } from "./baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => `/carts`,
      providesTags: ["cartItems"],
      pollingInterval: 5000,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: false,
      refetchOnReconnect: true,
      transformResponse: (response) => {
        if (
          typeof response === "string" &&
          (response.trim().startsWith("<!DOCTYPE") ||
            response.trim().startsWith("<html"))
        ) {
          console.error(
            "Received HTML response instead of JSON:",
            response.substring(0, 100)
          );
          return {
            message: "error",
            data: [],
            errorDetails:
              "Server returned HTML instead of JSON. The server might be down or experiencing issues.",
          };
        }
        if (typeof response === "object") {
          if (response.data) {
            return response;
          }
          return { message: "success", data: [] };
        }

        if (typeof response === "string") {
          try {
            const parsed = JSON.parse(response);
            return parsed;
          } catch (error) {
            console.error("Failed to parse response:", error);
            return { message: "error", data: [] };
          }
        }

        return { message: "unknown", data: [] };
      },
    }),

    addToCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `/carts`,
        method: "POST",
        body: new URLSearchParams({
          product_id: productId,
          product_quantity: quantity,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
      invalidatesTags: ["cartItems"],
      async onQueryStarted(
        { productId, quantity },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
        } catch {}
      },
      transformResponse: (response) => {
        if (typeof response === "object" && response.data) {
          return response;
        }

        if (typeof response === "string") {
          try {
            const parsed = JSON.parse(response);
            return parsed;
          } catch (error) {
            console.error("Failed to parse add to cart response:", error);
            return { message: "success", data: "Added to cart" };
          }
        }

        return { message: "success", data: "Added to cart" };
      },
    }),

    removeFromCart: builder.mutation({
      query: ({ productId }) => ({
        url: `/carts`,
        method: "PATCH",
        body: new URLSearchParams({ product_id: productId }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
      invalidatesTags: ["cartItems"],
      async onQueryStarted({ productId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      transformResponse: (response) => {
        if (typeof response === "object" && response.data) {
          return response.data;
        }

        if (typeof response === "string") {
          try {
            const parsed = JSON.parse(response);
            return parsed.data || [];
          } catch (error) {
            console.error("Failed to parse cart response:", error);
            return [];
          }
        }

        return [];
      },
    }),

    cleanCart: builder.mutation({
      query: () => ({
        url: `/carts`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
      invalidatesTags: ["cartItems"],
      transformResponse: (response) => {
        if (typeof response === "object" && response.data) {
          return response.data;
        }

        if (typeof response === "string") {
          try {
            const parsed = JSON.parse(response);
            return parsed.data || [];
          } catch (error) {
            console.error("Failed to parse cart response:", error);
            return [];
          }
        }

        return [];
      },
    }),

    updateCartItem: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `/carts`,
        method: "POST",
        body: new URLSearchParams({
          product_id: productId,
          product_quantity: quantity,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
      invalidatesTags: ["cartItems"],
      async onQueryStarted(
        { productId, quantity },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
        } catch {
          console.error("API update failed, retrying...");
        }
      },
      transformResponse: (response) => {
        if (typeof response === "object" && response.data) {
          return response;
        }

        if (typeof response === "string") {
          try {
            const parsed = JSON.parse(response);
            return parsed;
          } catch (error) {
            console.error("Failed to parse update cart response:", error);
            return { message: "success", data: "Updated cart" };
          }
        }

        return { message: "success", data: "Updated cart" };
      },
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useCleanCartMutation,
} = cartApi;
