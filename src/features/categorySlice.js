import { createSlice } from '@reduxjs/toolkit';
import { categoriesApi } from '../app/api/categories';

const initialState = {
  categories: [],
  selectedCategory: null,
  selectedSubCategory: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.selectedSubCategory = null;
    },
    setSelectedSubCategory: (state, action) => {
      state.selectedSubCategory = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      categoriesApi.endpoints.getCategories.matchFulfilled,
      (state, action) => {
        if (action.payload.message === "success") {
          state.categories = action.payload.data;
        }
      }
    );
  }
});

export const {
  setSelectedCategory,
  setSelectedSubCategory
} = categorySlice.actions;


export const selectCategories = (state) => state?.category?.categories || [];
export const selectSelectedCategory = (state) => state?.category?.selectedCategory || null;
export const selectSelectedSubCategory = (state) => state?.category?.selectedSubCategory || null;

export default categorySlice.reducer;