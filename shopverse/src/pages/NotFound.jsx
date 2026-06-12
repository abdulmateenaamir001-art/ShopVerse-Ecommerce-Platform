import { Link } from 'react-router-dom';
import { FiAlertCircle, FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center min-h-[60vh]">
      <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-8">
        <FiAlertCircle size={48} />
      </div>
      
      <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
        404
      </h1>
      <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-6">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-10 text-lg">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Link 
        to="/" 
        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-full transition-transform hover:-translate-y-1 shadow-lg shadow-primary-600/30"
      >
        <FiArrowLeft size={20} />
        Return to Storefront
      </Link>
    </div>
  );
}