import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  // 1. Try to get user info from Redux State
  const { userInfo: reduxUser } = useSelector((state) => state.auth);

  // 2. Backup: Try to get user info from LocalStorage if Redux refreshed
  const localStorageUser = JSON.parse(localStorage.getItem('userInfo'));

  // Use whichever one is available
  const currentUser = reduxUser || localStorageUser;

  // 🚦 Check if user exists AND is an admin
  return currentUser && currentUser.isAdmin ? (
    <Outlet /> // Unlocks access to the layout child components cleanly
  ) : (
    <Navigate to="/login" replace /> // Kicks non-admins straight back to login
  );
};

export default AdminRoute;