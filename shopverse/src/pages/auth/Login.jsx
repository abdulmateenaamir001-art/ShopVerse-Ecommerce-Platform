import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google'; 

export default function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Helper utility to route authenticated accounts relative to database structural flags
  const handleRoleRedirection = (userRecord) => {
    if (userRecord?.isAdmin) {
      toast.success(`Access Granted: Admin Panel Enabled`);
      navigate('/admin/dashboard'); // Redirects straight to your Control Panel analytics charts
    } else {
      toast.success(`Welcome, ${userRecord.name}!`);
      navigate('/'); // Redirects standard consumers straight to the marketplace catalog index
    }
  };

  // --- Google Login Handler ---
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const resData = await response.json();

      if (response.ok) {
        dispatch(login(resData)); // Saves Google user to Redux
        handleRoleRedirection(resData); // Execute smart redirection check
      } else {
        toast.error(resData.message || 'Google login failed');
      }
    } catch (error) {
      toast.error('Network error during Google login');
    }
  };

  // --- Standard Login Handler ---
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (response.ok) {
        dispatch(login(resData)); 
        handleRoleRedirection(resData); // Execute smart redirection check
      } else {
        toast.error(resData.message || 'Invalid email or password');
      }
    } catch (error) {
      toast.error('Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h2>
      <p className="text-gray-500 mb-6">Please enter your details to sign in.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input 
            type="email" 
            {...register('email', { required: true })} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dark:bg-dark-bg dark:border-gray-700 dark:text-white"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input 
            type="password" 
            {...register('password', { required: true })} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dark:bg-dark-bg dark:border-gray-700 dark:text-white"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      {/* --- Google Button UI --- */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-dark-card text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google Sign In was unsuccessful')}
            useOneTap
          />
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account? <Link to="/register" className="text-primary-600 hover:underline font-medium">Sign up</Link>
      </p>
    </div>
  );
}