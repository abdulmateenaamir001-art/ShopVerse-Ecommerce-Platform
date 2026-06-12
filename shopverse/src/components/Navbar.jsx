import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import { FiSun, FiMoon, FiShoppingCart, FiUser, FiSearch, FiHeart, FiChevronDown, FiPhoneCall, FiLogOut, FiSettings } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux'; 
import { clearCart } from '../redux/slices/cartSlice';
import { logout } from '../redux/slices/authSlice';
import { clearAdminState } from '../redux/slices/adminSlice';

import toast from 'react-hot-toast';


// Curated array containing your 9 balanced production categories
const CATEGORIES = [
  'Mens Fashion', 
  'Womens Fashion', 
  'Kids', 
  'Accessories', 
  'Perfumes', 
  'Games', 
  'Home Decor', 
  'Stationery', 
  'Electronics'
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch(); 
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  
  const wishlistItems = useSelector((state) => state.wishlist?.wishlistItems || []);
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const [searchCategory, setSearchCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false); 

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // FIXED: Submission handler now structures URL strings to match your active query filters
  const handleSearch = (e) => {
    e.preventDefault();
    let url = `/products?`;
    const params = [];

    if (searchTerm.trim() !== '') {
      params.push(`keyword=${encodeURIComponent(searchTerm.trim())}`);
    }

    if (searchCategory !== 'All') {
      params.push(`category=${encodeURIComponent(searchCategory)}`);
    }

    if (params.length > 0) {
      url += params.join('&');
    }

    navigate(url); 
  };

  const handleLogout = () => {
    dispatch(logout()); 
    dispatch(clearCart()); 
    dispatch(clearAdminState());
    setIsProfileOpen(false); 
    toast.success("Successfully logged out");
    navigate('/'); 
  };


  return (
    <header className="w-full relative z-50">
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-xs py-2 hidden sm:block transition-colors">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><FiPhoneCall /> +1 (800) 123-4567</span>
            <span>|</span>
            <span className="hover:text-primary-600 cursor-pointer">Get the ShopVerse App</span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <Link to="/dashboard/orders" className="hover:text-primary-600">Track Order</Link>
            <span className="cursor-pointer hover:text-primary-600">Help & Support</span>
            <span>|</span>
            <span className="cursor-pointer font-bold">USD $</span>
            <span className="cursor-pointer">English</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border py-4 transition-colors">
        <div className="container mx-auto px-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 md:gap-8">
          
          <Link to="/" className="text-3xl font-extrabold text-primary-600 tracking-tight flex-shrink-0">
            ShopVerse<span className="text-gray-900 dark:text-white text-4xl leading-none">.</span>
          </Link>

          <div className="flex-1 flex w-full md:w-auto order-3 md:order-none">
            <form onSubmit={handleSearch} className="flex w-full max-w-3xl mx-auto border-2 border-primary-600 rounded-lg overflow-hidden bg-white dark:bg-dark-bg focus-within:ring-2 focus-within:ring-primary-300 transition-shadow">
              
              {/* FIXED: Dropdown menu dynamically maps all 9 of your inventory departments */}
              <select 
                className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 border-r border-gray-300 dark:border-gray-700 outline-none text-sm hidden sm:block cursor-pointer font-medium"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="What are you looking for today?" 
                className="flex-1 px-4 py-2.5 outline-none text-gray-700 dark:text-white bg-transparent w-full text-sm"
              />
              <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 flex items-center justify-center transition-colors">
                <FiSearch size={20} />
              </button>
            </form>
          </div>

          <div className="flex items-center gap-5 sm:gap-7 flex-shrink-0 order-2 md:order-none">
            <button onClick={toggleTheme} className="text-gray-500 hover:text-primary-600 transition-colors">
              {theme === 'light' ? <FiMoon size={24} /> : <FiSun size={24} />}
            </button>
            
            <div className="relative" ref={dropdownRef}>
              {isAuthenticated ? (
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 group outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold border border-primary-200 dark:border-primary-800">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-tight">Welcome</p>
                    <p className="font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-1">
                      {user?.name?.split(' ')[0]} <FiChevronDown size={14} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </p>
                  </div>
                </button>
              ) : (
                <Link to="/login" className="flex items-center gap-2 group">
                  <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <FiUser size={20} />
                  </div>
                  <div className="hidden lg:block text-sm">
                    <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-tight">Welcome</p>
                    <p className="font-bold text-gray-900 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">
                      Sign In / Join
                    </p>
                  </div>
                </Link>
              )}

              {isProfileOpen && isAuthenticated && (
                <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-dark-card rounded-xl shadow-xl border border-gray-100 dark:border-dark-border overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg/50">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <Link to="/dashboard/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors">
                      <FiSettings size={16} /> My Account
                    </Link>

                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left font-medium">
                      <FiLogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link 
              to="/wishlist" 
              className="flex items-center gap-2 group relative text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors mr-2 sm:mr-0"
            >
              <div className="relative">
                <FiHeart size={24} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white dark:border-dark-card">
                    {wishlistItems.length}
                  </span>
                )}
              </div>
              <div className="hidden lg:block text-sm font-bold mt-1">Wishlist</div>
            </Link>

            <Link 
              to="/cart" 
              className="flex items-center gap-2 group relative text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors"
            >
              <div className="relative">
                <FiShoppingCart size={24} />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white dark:border-dark-card">
                    {totalCartItems}
                  </span>
                )}
              </div>
              <div className="hidden lg:block text-sm font-bold mt-1">Cart</div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}