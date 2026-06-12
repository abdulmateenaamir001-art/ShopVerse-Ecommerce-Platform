import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeCart, removeFromCart, updateQuantity } from '../redux/slices/cartSlice';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isOpen = useSelector((state) => state.cart.isCartOpen);
  const cartItems = useSelector((state) => state.cart.items);
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/50 z-[110]"
          />

          {/* The Sliding Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-dark-card shadow-2xl z-[120] flex flex-col"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-dark-border">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FiShoppingBag /> Your Cart
                <span className="bg-primary-100 text-primary-700 text-xs py-1 px-2 rounded-full ml-2">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </span>
              </h2>
              <button 
                onClick={() => dispatch(closeCart())}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-500 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Cart Items Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 space-y-4">
                  <FiShoppingBag size={64} className="opacity-20" />
                  <p className="text-lg font-medium">Your cart is empty.</p>
                  <button onClick={() => { dispatch(closeCart()); navigate('/products'); }} className="text-primary-600 font-bold hover:underline">
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
<div key={item.variantId || item.id} className="flex gap-4 bg-gray-50 dark:bg-dark-bg p-3 rounded-xl border border-gray-100 dark:border-dark-border">
                    <img src={item.image} alt={item.title} className="w-20 h-20 object-contain bg-white dark:bg-gray-800 rounded-lg p-1 mix-blend-multiply dark:mix-blend-normal" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{item.title}</h3>
                        <p className="text-primary-600 font-bold mt-1">${item.price.toFixed(2)}</p>

                        {(item.selectedSize || item.selectedColor || item.selectedCapacity) && (
                          <div className="mt-1 text-[11px] text-gray-500 font-medium flex flex-wrap gap-x-2 gap-y-0.5">
                            {item.selectedSize && <span>Size: <strong className="text-gray-700 dark:text-gray-300">{item.selectedSize}</strong></span>}
                            {item.selectedColor && <span>Color: <strong className="text-gray-700 dark:text-gray-300">{item.selectedColor}</strong></span>}
                            {item.selectedCapacity && <span>Option: <strong className="text-gray-700 dark:text-gray-300">{item.selectedCapacity}</strong></span>}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                          <button
                            onClick={() => dispatch(updateQuantity({ id: item.variantId || item.id, quantity: item.quantity - 1 }))}
                            className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >-</button>
                          <span className="px-2 text-sm font-medium dark:text-white">{item.quantity}</span>
                          <button
                            onClick={() => dispatch(updateQuantity({ id: item.variantId || item.id, quantity: item.quantity + 1 }))}
                            className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >+</button>
                        </div>
                        
                        <button
                          onClick={() => dispatch(removeFromCart(item.variantId || item.id))}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer (Subtotal & Checkout) */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg/50">
                <div className="flex justify-between items-center mb-4 text-lg">
                  <span className="text-gray-600 dark:text-gray-300 font-medium">Subtotal</span>
                  <span className="text-gray-900 dark:text-white font-extrabold">${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 text-center">Shipping, taxes, and discounts calculated at checkout.</p>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-primary-600/30"
                >
                  Proceed to Checkout <FiArrowRight />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}