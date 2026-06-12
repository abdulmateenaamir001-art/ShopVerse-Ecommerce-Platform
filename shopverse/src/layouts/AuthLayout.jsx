import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark-bg">
      {/* Left side - Blue Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 text-white flex-col justify-center px-16">
        <h1 className="text-5xl font-bold mb-4">ShopVerse.</h1>
        <p className="text-lg text-primary-100">Discover your next favorite thing. Join millions of shoppers today.</p>
      </div>

      {/* Right side - The Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white dark:bg-dark-card p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-border">
          <div className="text-center mb-8 lg:hidden">
             <h1 className="text-3xl font-bold text-primary-600">ShopVerse.</h1>
          </div>
          <Outlet /> {/* Login or Register form will appear here */}
        </div>
      </div>
    </div>
  );
}