import { baseApi } from "./baseApi";

export const favoritesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query({
      query: () => `/favorites`,
      providesTags: ["Favorites"],
      transformResponse: (response) => {
        if (typeof response === "object" && response.data) {
          return response.data;
        }

        if (typeof response === "string") {
          try {
            const parsed = JSON.parse(response);
            return parsed.data || [];
          } catch (error) {
            console.error("Failed to parse favorites response:", error);
            return [];
          }
        }

        return [];
      },
    }),

    addFavorite: builder.mutation({
      query: (productId) => ({
        url: `/favorites`,
        method: "POST",
        body: new URLSearchParams({ product_id: productId }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        invalidatesTags: ["Favorites"],
      }),
      transformResponse: (response) => {
        if (typeof response === "object" && response.data) {
          return response.data;
        }

        if (typeof response === "string") {
          try {
            const parsed = JSON.parse(response);
            return parsed.data || "Added";
          } catch (error) {
            // If we can't parse the response, check if it's HTML
            if (response.includes("<!doctype html>")) {
              return "Added"; // Assume success if we got HTML back
            }
            console.error("Failed to parse add favorite response:", error);
            return "Added";
          }
        }
        return "Added";
      },
    }),

    removeFavorite: builder.mutation({
      query: (productId) => ({
        url: `/favorites`,
        method: "POST",
        body: new URLSearchParams({
          product_id: productId,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        invalidatesTags: ["Favorites"],
      }),
      transformResponse: (response) => {
        if (typeof response === "object" && response.data) {
          return response.data;
        }

        if (typeof response === "string") {
          try {
            const parsed = JSON.parse(response);
            return parsed.data || "Removed";
          } catch (error) {
            if (response.includes("<!doctype html>")) {
              return "Removed"; // Assume success if we got HTML back
            }
            console.error("Failed to parse remove favorite response:", error);
            return "Removed";
          }
        }
        return "Removed";
      },
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoritesApi;
