import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  brands: [],
  isLoading: false,
  error: null,
};

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    setBrands: (state, action) => {
      state.brands = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setBrands, setLoading, setError } = brandsSlice.actions;
export default brandsSlice.reducer;
