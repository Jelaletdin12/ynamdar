import { baseApi } from "./baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => `/carts`,
      providesTags: ["cartItems"],
      // Use polling with a reasonable interval instead of constantly refetching
      pollingInterval: 5000, // Poll every 30 seconds
      refetchOnMountOrArgChange: true, // Refetch when component mounts or query args change
      // Minimize refetches for other window events
      refetchOnFocus: false,
      refetchOnReconnect: true,
      transformResponse: (response) => {
        // Check if response is HTML (starts with <!DOCTYPE or <html)
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

        // Rest of your existing transformResponse code...
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
      // Use pessimistic updates for data integrity
      invalidatesTags: ["cartItems"],
      async onQueryStarted(
        { productId, quantity },
        { dispatch, queryFulfilled }
      ) {
        try {
          // Wait for the mutation to complete
          await queryFulfilled;
        } catch {
          // If the mutation fails, we don't need to do anything as our optimistic update
          // in the component will handle reverting
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
          // Wait for the mutation to complete
          await queryFulfilled;
        } catch {
          // If the mutation fails, we don't need to do anything as our optimistic update
          // in the component will handle reverting
        }
      },
      transformResponse: (response) => {
        // Check if response is already parsed
        if (typeof response === "object" && response.data) {
          return response.data;
        }

        // If response is a string, try to parse it
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
        // Check if response is already parsed
        if (typeof response === "object" && response.data) {
          return response.data;
        }

        // If response is a string, try to parse it
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
      async onQueryStarted({ productId, quantity }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          console.error("API update failed, retrying...");
        }
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
