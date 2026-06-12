import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiHeart, FiArrowRight } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';

export default function Wishlist() {
  // Grab the saved items from Redux
  const { wishlistItems } = useSelector((state) => state.wishlist);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <FiHeart className="text-red-500 fill-red-500" /> My Wishlist
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later.
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-card rounded-2xl p-16 text-center border border-gray-100 dark:border-dark-border shadow-sm flex flex-col items-center justify-center mt-12"
        >
          <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600 mb-6">
            <FiHeart size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Save items you love to your wishlist so you can keep track of them and buy them later!
          </p>
          <Link to="/products" className="bg-primary-600 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-700 transition-colors inline-flex items-center gap-2">
            Explore Products <FiArrowRight />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <motion.div key={item._id || item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <ProductCard product={item} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}