import { Link } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';

export default function CheckoutSteps({ step1, step2, step3, step4 }) {
  return (
    <div className="flex justify-center items-center mb-8 space-x-2 sm:space-x-4 text-xs sm:text-sm font-bold">
      
      {/* Step 1: Sign In */}
      <div className={`flex items-center ${step1 ? 'text-primary-600' : 'text-gray-400'}`}>
        {step1 ? <Link to="/login" className="hover:underline">Sign In</Link> : <span>Sign In</span>}
      </div>
      <div className={`w-8 sm:w-16 h-1 rounded-full ${step2 ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>

      {/* Step 2: Shipping */}
      <div className={`flex items-center ${step2 ? 'text-primary-600' : 'text-gray-400'}`}>
        {step2 ? <Link to="/shipping" className="hover:underline">Shipping</Link> : <span>Shipping</span>}
      </div>
      <div className={`w-8 sm:w-16 h-1 rounded-full ${step3 ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>

      {/* Step 3: Payment */}
      <div className={`flex items-center ${step3 ? 'text-primary-600' : 'text-gray-400'}`}>
        {step3 ? <Link to="/payment" className="hover:underline">Payment</Link> : <span>Payment</span>}
      </div>
      <div className={`w-8 sm:w-16 h-1 rounded-full ${step4 ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>

      {/* Step 4: Place Order */}
      <div className={`flex items-center ${step4 ? 'text-primary-600' : 'text-gray-400'}`}>
        <span>Place Order</span>
      </div>
    </div>
  );
}