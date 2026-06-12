import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import { FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get cart items from Redux
  const cartItems = useSelector((state) => state.cart.items);

  // Calculate Subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const checkoutHandler = () => {
    // If they aren't logged in, they go to login. If they are, they go to shipping!
    navigate('/shipping');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-6">
          <FiShoppingBag size={40} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2">
          <FiArrowLeft /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Cart Items List */}
        <div className="lg:w-2/3 space-y-4">
          {cartItems.map((item) => (
            <div key={item.variantId || item._id} className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-dark-card p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
              
              <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-xl" />
              
              <div className="flex-1 text-center sm:text-left">
                <Link to={`/products/${item._id}`} className="text-lg font-bold text-gray-900 dark:text-white hover:text-primary-600 transition-colors">
                  {item.title}
                </Link>
                <div className="text-primary-600 font-bold mt-1">${item.price}</div>

                {(item.selectedSize || item.selectedColor || item.selectedCapacity) && (
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-gray-500 font-medium">
                    {item.selectedSize && (
                      <span>Size: <strong className="text-gray-700 dark:text-gray-300">{item.selectedSize}</strong></span>
                    )}
                    {item.selectedColor && (
                      <span>Color: <strong className="text-gray-700 dark:text-gray-300">{item.selectedColor}</strong></span>
                    )}
                    {item.selectedCapacity && (
                      <span>Option: <strong className="text-gray-700 dark:text-gray-300">{item.selectedCapacity}</strong></span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Quantity Selector */}
                {/* --- NEW: Proper +/- Quantity Selector --- */}
                <div className="flex items-center gap-1 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg p-1">
  <button 
    // This stops them from going below 1!
    onClick={() => dispatch(updateQuantity({ id: item.variantId || item._id, quantity: Math.max(1, item.quantity - 1) }))}

    className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors text-lg font-bold"
  >
    −
  </button>
  
  <span className="w-8 text-center font-bold text-gray-900 dark:text-white">
    {item.quantity}
  </span>
  
  <button 
    onClick={() => dispatch(updateQuantity({ id: item.variantId || item._id, quantity: item.quantity + 1 }))}
    className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors text-lg font-bold"
  >
    +
  </button>
</div>
{/* --- END NEW SELECTOR --- */}

                {/* Delete Button */}
                <button 
                  onClick={() => dispatch(removeFromCart(item.variantId || item._id))}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-border sticky top-24">
            <h2 className="text-xl font-bold dark:text-white mb-6 border-b border-gray-100 dark:border-dark-border pb-4">Order Summary</h2>
            
            <div className="flex justify-between items-center mb-4 text-gray-600 dark:text-gray-400">
              <span>Subtotal ({totalItems} items)</span>
              <span className="text-gray-900 dark:text-white font-bold">${subtotal}</span>
            </div>
            
            <p className="text-xs text-gray-500 mb-6">Taxes and shipping calculated at checkout.</p>

            <button 
              onClick={checkoutHandler}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-md transition-all"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}