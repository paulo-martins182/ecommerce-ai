import api from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchAddress = createAsyncThunk(
  "address/fetchAddress",
  async ({}, thunkAPI) => {
    try {
      const { data } = await api.get("/address");
      return data ? data?.address : [];
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    list: [],
  },
  reducers: {
    addAddress: (state, action) => {
      state.list.push(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchAddress.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export const { addAddress } = addressSlice.actions;

export default addressSlice.reducer;
