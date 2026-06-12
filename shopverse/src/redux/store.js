import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice';



// 1. Bulletproof custom storage for Vite to bypass the import error
const customStorage = {
  getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key, item) => Promise.resolve(window.localStorage.setItem(key, item)),
  removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
};

// 2. Tell Redux to save the 'cart' slice using our custom storage
const cartPersistConfig = {
  key: 'cart',
  storage: customStorage, 
};

// 3. Wrap our cart reducer
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: persistedCartReducer,
    wishlist: wishlistReducer,
    orders: orderReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);