import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/slices/cartSlice';

export default function Checkout() {
  const { register, handleSubmit } = useForm();
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // If cart is empty, send them back to the shop
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Your cart is empty.</h2>
        <button onClick={() => navigate('/products')} className="bg-primary-600 text-white px-6 py-2 rounded-lg">Go Shopping</button>
      </div>
    );
  }

  const onSubmit = (data) => {
    console.log("Order Placed:", data);
    alert("Payment Successful! Order placed.");
    dispatch(clearCart()); // Empty the cart
    navigate('/dashboard'); // Send user to dashboard
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Forms */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Shipping Info */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input {...register('fullName', { required: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-dark-bg dark:border-gray-700 dark:text-white" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                  <input {...register('address', { required: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-dark-bg dark:border-gray-700 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input {...register('city', { required: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-dark-bg dark:border-gray-700 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP Code</label>
                  <input {...register('zip', { required: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-dark-bg dark:border-gray-700 dark:text-white" required />
                </div>
              </div>
            </div>

            {/* Mock Payment Info */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Payment Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                  <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-dark-bg dark:border-gray-700 dark:text-white" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-dark-bg dark:border-gray-700 dark:text-white" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVC</label>
                    <input type="text" placeholder="123" className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-dark-bg dark:border-gray-700 dark:text-white" required />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl text-lg transition-colors">
              Pay ${subtotal.toFixed(2)}
            </button>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{item.quantity}x {item.title}</span>
                  <span className="font-medium dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <hr className="my-4 border-gray-200 dark:border-dark-border" />
            
            <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}