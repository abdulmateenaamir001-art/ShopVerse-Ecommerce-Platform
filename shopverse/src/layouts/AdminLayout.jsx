import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { FiHome, FiBox, FiShoppingBag, FiUsers, FiLogOut } from 'react-icons/fi';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: FiHome },
    { name: 'Products', path: '/admin/products', icon: FiBox },
    { name: 'Orders', path: '/admin/orders', icon: FiShoppingBag },
    { name: 'Customers', path: '/admin/customers', icon: FiUsers },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-bg">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <span className="text-2xl font-bold text-primary-500">ShopVerse<span className="text-white">.</span></span>
          <span className="ml-2 text-xs bg-primary-600 px-2 py-0.5 rounded-full">ADMIN</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                location.pathname === link.path 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <link.icon className="text-lg" />
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Admin Top Header */}
        <header className="h-16 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border flex items-center justify-between px-8 z-10">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Admin Control Panel</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
              A
            </div>
            <span className="text-sm font-medium dark:text-white">Admin User</span>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}