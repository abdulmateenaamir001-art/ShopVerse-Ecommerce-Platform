import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk to fetch administrative summary metrics
export const fetchAdminSummary = createAsyncThunk(
  'admin/fetchSummary',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Pull token out of your existing authenticated auth user state
      const {
        auth: { user },
      } = getState();

      const token = user?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get('http://localhost:5000/api/orders/summary', config);
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

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    summary: {
      totalRevenue: 0,
      numOrders: 0,
      numUsers: 0,
      numProducts: 0,
      lowStockProducts: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminState: (state) => {
      state.summary = {
        totalRevenue: 0,
        numOrders: 0,
        numUsers: 0,
        numProducts: 0,
        lowStockProducts: 0,
      };
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchAdminSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminState } = adminSlice.actions;
export default adminSlice.reducer;

