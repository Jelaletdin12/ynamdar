import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import { categoriesApi } from './api/categories'; 
import { searchApi } from './api/searchApi'; 


const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer, 
   
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, categoriesApi.middleware, searchApi.middleware), 
});

export default store;