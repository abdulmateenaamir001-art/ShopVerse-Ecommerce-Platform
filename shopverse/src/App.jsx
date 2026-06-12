import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from './redux/slices/authSlice';
import toast from 'react-hot-toast';

// --- Route Guard Wrapper ---
import AdminRoute from './components/AdminRoute'; 

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import AdminProducts from './pages/AdminProducts';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Shipping from './pages/Shipping'; 
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import Payment from './pages/Payment'; 
import PlaceOrder from './pages/PlaceOrder'; 
import OrderDetails from './pages/OrderDetails';
import AdminOrders from './pages/AdminOrders'; 
import ProductEdit from './pages/admin/ProductEdit';
import AdminCustomers from './pages/AdminCustomers';
import Wishlist from './pages/Wishlist'; 
import Contact from './pages/Contact';
import About from './pages/About';

// User Pages
import Dashboard from './pages/user/Dashboard';
import ProfileScreen from './screens/ProfileScreen';

// Admin Pages
import AdminDashboardScreen from './screens/AdminDashboardScreen';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyUser = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo?.token) {
        try {
          const res = await fetch('http://localhost:5000/api/users/profile', {
            headers: { Authorization: `Bearer ${userInfo.token}` }
          });
          
          if (res.status === 401) {
            dispatch(logout());
            toast.error('Session expired, please log in again.');
          }
        } catch (err) {
          console.error("Session verification failed");
        }
      }
    };
    verifyUser();
  }, [dispatch]);

  return (
    <ThemeProvider>
      <Toaster position="bottom-right" reverseOrder={false} />

      <BrowserRouter>
        <Routes>

          {/* 🌐 MAIN PUBLIC MARKETPLACE ENVIRONMENT */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="payment" element={<Payment />} />
            <Route path="placeorder" element={<PlaceOrder />} />
            
            {/* 👤 PROTECTED CUSTOMER HISTORY PROFILE STACK */}
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<ProfileScreen />} />
              <Route path="orders/:id" element={<OrderDetails />} />
            </Route>
          </Route>

          {/* 🔐 AUTHENTICATION INTERFACES */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* 👑 🛡️ SECURE ADMIN ONLY ENGINE CONTROL CONSOLE */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboardScreen />} />
              <Route path="dashboard" element={<AdminDashboardScreen />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/:id/edit" element={<ProductEdit />} />
              <Route path="customers" element={<AdminCustomers />} /> 
            </Route>
          </Route>

          {/* 🚨 RECOVERY TESTING & BALANCING INDEX PATH */}
          <Route path="/testadmin" element={<AdminDashboardScreen />} />

          {/* 🌌 UNIFIED ROOT LEVEL GLOBAL CATCH-ALL FOR MISSING PAGES */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}