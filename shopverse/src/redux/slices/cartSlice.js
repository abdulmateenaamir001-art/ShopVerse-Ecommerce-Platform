import { createSlice } from '@reduxjs/toolkit';

// Pull saved data from local storage so it survives page refreshes!
const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {};
const paymentMethodFromStorage = localStorage.getItem('paymentMethod') ? JSON.parse(localStorage.getItem('paymentMethod')) : 'PayPal';

const initialState = {
  items: cartItemsFromStorage,
  shippingAddress: shippingAddressFromStorage,
  paymentMethod: paymentMethodFromStorage,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      // Create a unique composite key combining product ID and selected variant options.
      const variantId = `${item._id}-${item.selectedSize || ''}-${item.selectedColor || ''}-${item.selectedCapacity || ''}`;

      const existingItem = state.items.find((x) => x.variantId === variantId);

      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1, variantId });
      }

      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((x) => (x.variantId || x._id) !== id);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((x) => (x.variantId || x._id) === id);
      if (item) item.quantity = quantity;
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cartItems');
    },
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
    
    // --- NEW: Checkout Reducers ---
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, openCart, closeCart, saveShippingAddress, savePaymentMethod } = cartSlice.actions;
export default cartSlice.reducer;