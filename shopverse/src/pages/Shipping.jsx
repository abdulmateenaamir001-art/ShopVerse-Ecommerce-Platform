import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

export default function Shipping() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // If user is not logged in, kick them back to login!
  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/login?redirect=/shipping');
    }
  }, [auth.isAuthenticated, navigate]);

  // Pre-fill the form with data from Redux if it exists
  const { register, handleSubmit } = useForm({
    defaultValues: {
      address: shippingAddress.address || '',
      city: shippingAddress.city || '',
      postalCode: shippingAddress.postalCode || '',
      country: shippingAddress.country || '',
    }
  });

  const onSubmit = (data) => {
    // 1. Save the address to Redux and Local Storage
    dispatch(saveShippingAddress(data));
    // 2. Move to the next step!
    navigate('/payment');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <CheckoutSteps step1 step2 /> {/* Turns on the first two steps in the progress bar! */}
      
      <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border mt-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Shipping Address</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
            <input 
              type="text" 
              {...register('address', { required: true })} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dark:bg-dark-bg dark:border-gray-700 dark:text-white" 
              placeholder="123 Main St" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
              <input 
                type="text" 
                {...register('city', { required: true })} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dark:bg-dark-bg dark:border-gray-700 dark:text-white" 
                placeholder="New York" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postal Code</label>
              <input 
                type="text" 
                {...register('postalCode', { required: true })} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dark:bg-dark-bg dark:border-gray-700 dark:text-white" 
                placeholder="10001" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
            <input 
              type="text" 
              {...register('country', { required: true })} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dark:bg-dark-bg dark:border-gray-700 dark:text-white" 
              placeholder="United States" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors mt-4"
          >
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
}