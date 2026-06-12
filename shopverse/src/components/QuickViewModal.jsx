import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar } from 'react-icons/fi';

import { useDispatch } from 'react-redux';
import { addToCart, openCart } from '../redux/slices/cartSlice'; // <-- Added openCart
import toast from 'react-hot-toast';

export default function QuickViewModal({ product, isOpen, onClose }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    toast.success(`${quantity}x ${product.title} added to cart!`);
    dispatch(openCart()); // <-- Open sliding drawer
    onClose(); // Close the quick view modal
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="bg-white dark:bg-dark-card w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row pointer-events-auto relative max-h-[90vh]"
            >
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-500 transition-colors z-10"
              >
                <FiX size={20} />
              </button>

              {/* Left Side: Image */}
              <div className="w-full md:w-1/2 bg-gray-50 dark:bg-dark-bg/50 p-8 flex items-center justify-center border-r border-gray-100 dark:border-dark-border">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-64 md:h-80 object-contain mix-blend-multiply dark:mix-blend-normal"
                />
              </div>

              {/* Right Side: Details */}
              <div className="w-full md:w-1/2 p-8 overflow-y-auto">
                <p className="text-xs text-primary-600 font-bold uppercase tracking-wider mb-2">{product.category}</p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{product.title}</h2>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400 text-sm">
                    <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="text-gray-300" />
                  </div>
                  <span className="text-gray-500 text-xs">(128 Reviews)</span>
                </div>

                <div className="text-3xl font-black text-gray-900 dark:text-white mb-6">
                  ${product.price.toFixed(2)}
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 leading-relaxed">
                  Experience unmatched quality with this premium item. Designed for the modern user, it combines sleek aesthetics with cutting-edge functionality.
                </p>

                {/* Controls */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-dark-bg h-12">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 hover:text-primary-600 font-bold">-</button>
                    <span className="w-8 text-center font-bold dark:text-white">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-4 hover:text-primary-600 font-bold">+</button>
                  </div>

                  {/* Removed Add to Cart button (variant handled on ProductDetails) */}
                  <div className="flex-1 h-12 flex items-center justify-center text-sm font-bold text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    Select options on the product page
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}