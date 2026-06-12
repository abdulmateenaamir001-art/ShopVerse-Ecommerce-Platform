import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

export default function Register() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // 1. Send registration data to your Node.js backend
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      // 2. Check if registration was successful
      if (response.ok) {
        dispatch(login(resData)); // Automatically log them in!
        toast.success(`Account created! Welcome, ${resData.name}!`);
        navigate('/'); // Go to home page
      } else {
        toast.error(resData.message || 'Failed to create account');
      }
    } catch (error) {
      toast.error('Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
      <p className="text-gray-500 mb-6">Start your premium shopping experience.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
          <input 
            type="text" 
            {...register('name', { required: true })} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none dark:bg-dark-bg dark:border-gray-700 dark:text-white" 
            placeholder="John Doe" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input 
            type="email" 
            {...register('email', { required: true })} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none dark:bg-dark-bg dark:border-gray-700 dark:text-white" 
            placeholder="john@example.com" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input 
            type="password" 
            {...register('password', { required: true })} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none dark:bg-dark-bg dark:border-gray-700 dark:text-white" 
            placeholder="••••••••" 
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account? <Link to="/login" className="text-primary-600 hover:underline font-medium">Sign in</Link>
      </p>
    </div>
  );
}