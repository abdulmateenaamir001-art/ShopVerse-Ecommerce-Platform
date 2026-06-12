import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlistItems: [],
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const item = action.payload;
      // Check if the product is already in the wishlist
      const existItem = state.wishlistItems.find((x) => x._id === item._id);

      if (existItem) {
        // If it exists, remove it
        state.wishlistItems = state.wishlistItems.filter((x) => x._id !== item._id);
        toast.success('Removed from wishlist');
      } else {
        // If it doesn't exist, add it
        state.wishlistItems.push(item);
        toast.success('Added to wishlist!');
      }
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;