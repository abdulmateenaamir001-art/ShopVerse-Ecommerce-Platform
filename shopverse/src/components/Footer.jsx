import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiArrowRight } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border pt-16 pb-8 mt-12 transition-colors">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand & Newsletter */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight flex items-center gap-2 mb-6">
              ShopVerse.
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              Your premium destination for the latest tech, fashion, and lifestyle products. We deliver quality directly to your doorstep.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm dark:text-white"
                required
              />
              <button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-r-xl transition-colors flex items-center justify-center"
              >
                <FiArrowRight />
              </button>
            </form>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-6 uppercase tracking-wider text-sm">Shop</h3>
            <ul className="space-y-4">
              <li><Link to="/products?keyword=Electronics" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors">Electronics</Link></li>
              <li><Link to="/products?keyword=Accessories" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors">Accessories</Link></li>
              <li><Link to="/products?keyword=Fashion" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors">Fashion</Link></li>
              <li><Link to="/products" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors">All Products</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
           <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-6 uppercase tracking-wider text-sm">Support</h3>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors">Contact Us</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors">Shipping & Returns</Link></li>
             <li><Link to="/about" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors">About Us</Link></li>
              <li><Link to="/dashboard/orders" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors">Order Tracking</Link></li>
            </ul>
          </div>
            
          {/* Column 4: Contact Info & Socials */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-6 uppercase tracking-wider text-sm">Get in Touch</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm">
                <FiMail className="text-indigo-600" /> support@shopverse.com
              </li>
            </ul>
            
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-indigo-600 hover:text-white transition-all">
                <FiFacebook />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-indigo-600 hover:text-white transition-all">
                <FiTwitter />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-indigo-600 hover:text-white transition-all">
                <FiInstagram />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-indigo-600 hover:text-white transition-all">
                <FiYoutube />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} ShopVerse. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}