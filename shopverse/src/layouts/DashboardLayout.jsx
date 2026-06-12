import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get the user from our Redux store
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // Send back to login screen
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border p-6 sticky top-24">
          
          {/* User Avatar & Info */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3 uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">{user?.name || 'Test User'}</h3>
            <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <Link 
              to="/dashboard" 
              className={`block px-4 py-2 rounded-lg font-medium transition-colors ${location.pathname === '/dashboard' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              Overview
            </Link>
            <Link 
              to="/dashboard/profile" 
              className={`block px-4 py-2 rounded-lg font-medium transition-colors ${location.pathname === '/dashboard/profile' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              My Profile
            </Link>
            
            <button 
              onClick={handleLogout} 
              className="w-full text-left px-4 py-2 rounded-lg font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-4"
            >
              Log Out
            </button>
          </nav>

        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

    </div>
  );
}