import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, openCart } from '../redux/slices/cartSlice'; 
import { toggleWishlist } from '../redux/slices/wishlistSlice'; 
import toast from 'react-hot-toast';
import { FiEye, FiHeart } from 'react-icons/fi'; 
import QuickViewModal from './QuickViewModal';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // <-- Added navigate

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Grab auth and wishlist states
  const { isAuthenticated } = useSelector((state) => state.auth); // <-- Added Auth check
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const isWishlisted = wishlistItems.some((item) => (item._id || item.id) === (product._id || product.id));

  // --- NEW: Protected Add To Cart Handler ---
  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    // The Intercept: Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart.');
      navigate('/login');
      return; 
    }

    dispatch(addToCart({ ...product, quantity: 1 }));
    toast.success(`${product.title} added to cart!`);
    dispatch(openCart()); 
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    dispatch(toggleWishlist(product));
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -5 }} 
        whileTap={{ scale: 0.95 }} 
        className="bg-white dark:bg-dark-card rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-dark-border overflow-hidden transition-all duration-300 group flex flex-col h-full relative"
      >
        {/* Image Container with Hover Overlay */}
        <div className="h-56 overflow-hidden bg-gray-50 dark:bg-gray-800 relative flex items-center justify-center p-4">
          
          {/* Top Left: HOT Badge */}
          {product.featured && <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded z-10">HOT</span>}
          
          {/* Top Right: Wishlist Heart */}
          <button 
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            aria-label="Toggle Wishlist"
          >
            <FiHeart 
              size={18} 
              className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500 hover:text-red-500'}`} 
            />
          </button>

          <img src={product.image} alt={product.title} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500" />
          
          {/* Quick View Hover Action Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary-600 hover:text-white transition-colors translate-y-4 group-hover:translate-y-0 duration-300"
            >
              <FiEye size={18} /> Quick View
            </button>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <p className="text-xs text-primary-600 font-bold mb-2 uppercase tracking-wider">{product.category}</p>
          <Link to={`/products/${product._id || product.id}`} className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-3 flex-grow hover:text-primary-600 transition-colors" title={product.title}>
            {product.title}
          </Link>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-dark-border">
            <span className="text-xl font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
            <Link to={`/products/${product._id || product.id}`} className="bg-gray-100 dark:bg-gray-800 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              View
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Render the Modal completely outside the motion.div flow */}
      <QuickViewModal 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </>
  );
}