import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../redux/slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

export default function Payment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod } = cart;

  // 1. SECURITY: If they don't have a shipping address, send them back!
  useEffect(() => {
    if (!shippingAddress || !shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  // 2. Set the default choice to whatever is in Redux (defaults to PayPal)
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod || 'PayPal');

  const submitHandler = (e) => {
    e.preventDefault();
    // 3. Save their choice to Redux
    dispatch(savePaymentMethod(selectedMethod));
    // 4. Move to the final review screen!
    navigate('/placeorder');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <CheckoutSteps step1 step2 step3 /> {/* Turns on 3 out of 4 progress bar steps! */}
      
      <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border mt-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Payment Method</h2>
        <p className="text-gray-500 mb-6">Select how you would like to pay for your order.</p>
        
        <form onSubmit={submitHandler} className="space-y-6">
          
          {/* Option 1: PayPal */}
          <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-primary-500 transition-colors bg-gray-50 dark:bg-dark-bg">
            <div className="flex items-center gap-3">
              <input 
                type="radio" 
                name="paymentMethod" 
                value="PayPal" 
                checked={selectedMethod === 'PayPal'} 
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-5 h-5 text-primary-600 focus:ring-primary-500"
              />
              <span className="font-bold text-gray-900 dark:text-white">PayPal or Credit Card</span>
            </div>
            {/* Fake PayPal Logo using text for now */}
            <span className="font-extrabold text-blue-800 italic text-xl tracking-tighter">Pay<span className="text-blue-400">Pal</span></span>
          </label>

          {/* Option 2: Stripe */}
          <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-primary-500 transition-colors bg-gray-50 dark:bg-dark-bg">
            <div className="flex items-center gap-3">
              <input 
                type="radio" 
                name="paymentMethod" 
                value="Stripe" 
                checked={selectedMethod === 'Stripe'} 
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-5 h-5 text-primary-600 focus:ring-primary-500"
              />
              <span className="font-bold text-gray-900 dark:text-white">Stripe (Direct Credit Card)</span>
            </div>
            {/* Fake Stripe Logo using text */}
            <span className="font-extrabold text-indigo-500 text-xl tracking-tighter">stripe</span>
          </label>

          <button 
            type="submit" 
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors mt-4"
          >
            Continue to Review
          </button>
        </form>
      </div>
    </div>
  );
}