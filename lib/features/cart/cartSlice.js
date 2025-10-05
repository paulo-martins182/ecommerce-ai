import api from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

let debounceTimer = null;

export const uploadCart = createAsyncThunk(
  "cart/uploadCart",
  async ({}, thunkAPI) => {
    try {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        const { cartItems } = thunkAPI.getState().cart;
        await api.post("/cart", {
          cart: cartItems,
        });
        console.log("cart2", cartItems);
      }, 1000);
    } catch (e) {
      console.log("cart3", e);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({}, thunkAPI) => {
    try {
      const { data } = await api.get("/cart");
      return data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    total: 0,
    cartItems: {},
  },
  reducers: {
    addToCart: (state, action) => {
      const { productId } = action.payload;
      if (state.cartItems[productId]) {
        state.cartItems[productId]++;
      } else {
        state.cartItems[productId] = 1;
      }
      state.total += 1;
    },
    removeFromCart: (state, action) => {
      const { productId } = action.payload;
      if (state.cartItems[productId]) {
        state.cartItems[productId]--;
        if (state.cartItems[productId] === 0) {
          delete state.cartItems[productId];
        }
      }
      state.total -= 1;
    },
    deleteItemFromCart: (state, action) => {
      const { productId } = action.payload;
      state.total -= state.cartItems[productId]
        ? state.cartItems[productId]
        : 0;
      delete state.cartItems[productId];
    },
    clearCart: (state) => {
      state.cartItems = {};
      state.total = 0;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.cartItems = action.payload.cart;
      state.total = Object.values(action.payload.cart).reduce(
        (acc, item) => acc + item,
        0
      );
    });
  },
});

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart } =
  cartSlice.actions;

export default cartSlice.reducer;
