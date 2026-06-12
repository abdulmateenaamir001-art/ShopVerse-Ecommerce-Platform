import { createSlice } from '@reduxjs/toolkit';

// Helper to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp < Date.now() / 1000;
  } catch (e) {
    return true;
  }
};

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

// Validate on load
const initialState = {
  user: userInfoFromStorage && !isTokenExpired(userInfoFromStorage.token) ? userInfoFromStorage : null,
  isAuthenticated: !!(userInfoFromStorage && !isTokenExpired(userInfoFromStorage.token)),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('userInfo');
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;