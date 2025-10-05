import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ storeId }, thunkAPI) => {
    try {
      const { data } = await api(
        "/products" + (storeId ? `?storeId=${storeId}` : "")
      );
      return data.products;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    list: [],
  },
  reducers: {
    setProduct: (state, action) => {
      state.list = action.payload;
    },
    clearProduct: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export const { setProduct, clearProduct } = productSlice.actions;

export default productSlice.reducer;
