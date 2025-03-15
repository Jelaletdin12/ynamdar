import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import { categoriesApi } from "./api/categories";
import { searchApi } from "./api/searchApi";
import { cartApi } from "./api/cartApi";
import { brandsApi } from "./api/brandsApi";
import { collectionsApi } from "./api/collectionsApi";
import { favoritesApi } from "./api/favoritesApi";
import { legalPagesApi } from "./api/legalPagesApi";
import { locationApi } from "./api/locationApi";
import { orderApi } from "./api/orderApi";
import { mediaApi } from "./api/bannersApi";
import { reviewsApi } from "./api/reviewApi";
import { profileApi } from "./api/myProfileApi";
import { contactApi } from "./api/contactUs";

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [brandsApi.reducerPath]: brandsApi.reducer,
    [collectionsApi.reducerPath]: collectionsApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
    [legalPagesApi.reducerPath]: legalPagesApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
      categoriesApi.middleware,
      searchApi.middleware,
      brandsApi.middleware,
      collectionsApi.middleware,
      favoritesApi.middleware,
      legalPagesApi.middleware,
      locationApi.middleware,
      orderApi.middleware,
      reviewsApi.middleware,
      mediaApi.middleware,
      profileApi.middleware,
      contactApi.middleware,
    ),
});

export default store;
