import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk to fetch logged-in user's orders
export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Pulling token directly from your auth state
      const { auth: { user } } = getState();
      const token = user?.token;

      if (!token) {
        return rejectWithValue('Not authorized');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        'http://localhost:5000/api/orders/myorders',
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetOrderHistory: (state) => {
      state.orders = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderHistory } = orderSlice.actions;
export default orderSlice.reducer;

