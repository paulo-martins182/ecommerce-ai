import api from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchRating = createAsyncThunk(
  "rating/fetchRating",
  async ({}, thunkAPI) => {
    try {
      const { data } = await api.get("/rating");
      return data ? data.ratings : [];
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const ratingSlice = createSlice({
  name: "rating",
  initialState: {
    ratings: [],
  },
  reducers: {
    addRating: (state, action) => {
      state.ratings.push(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchRating.fulfilled, (state, action) => {
      state.ratings = action.payload;
    });
  },
});

export const { addRating } = ratingSlice.actions;

export default ratingSlice.reducer;
