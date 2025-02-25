import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => "/orders",
      transformResponse: (response) => response.data || [],
    }),

    getOrderById: builder.query({
      query: (orderId) => `/orders/${orderId}`,
      transformResponse: (response) => response.data || null,
    }),
    placeOrder: builder.mutation({
      query: (orderDetails) => ({
        url: "/orders",
        method: "POST",
        body: new URLSearchParams(orderDetails),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
      // Add better handling for various response types
      transformResponse: (response, meta, arg) => {
        if (response && response.data) {
          return response.data;
        }
        return "Order placed";
      },
      // Handle errors, especially HTML responses
      transformErrorResponse: (response, meta, arg) => {
        if (
          typeof response.data === "string" &&
          response.data.includes("<!doctype html>")
        ) {
          return {
            status: "CUSTOM_ERROR",
            data: {
              message:
                "Server returned HTML instead of expected response format",
            },
          };
        }
        return response;
      },
      // This will affect how RTK Query determines if the response is an error
      validateStatus: (response, result) => {
        return (
          response.status >= 200 && response.status < 300 && !result?.error
        );
      },
    }),

    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => response.data || "Order cancelled",
    }),

    getOrderTimes: builder.query({
      query: () => "/order-time",
      transformResponse: (response) => response.data || [],
    }),

    getOrderPayments: builder.query({
      query: () => "/order-payments",
      transformResponse: (response) => response.data || [],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  usePlaceOrderMutation,
  useCancelOrderMutation,
  useGetOrderTimesQuery,
  useGetOrderPaymentsQuery,
} = orderApi;
