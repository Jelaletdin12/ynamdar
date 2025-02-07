import { baseApi } from "./baseApi";

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchProduct: builder.query({
      query: (query) => ({
        url: "/search-product",
        params: { q: query }
      }),
    }),
    searchProductByBarcode: builder.query({
      query: (barcode) => ({
        url: "/search-product-barcode",
        params: { barcode },
      }),
    }),
  }),
});

export const {
  useSearchProductQuery,
  useSearchProductByBarcodeQuery,
} = searchApi;