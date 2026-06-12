import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchMyOrders } from '../redux/slices/orderSlice';
import {
  FiUser,
  FiShoppingBag,
  FiLoader,
  FiCheckCircle,
  FiXCircle,
  FiArrowRight,
} from 'react-icons/fi';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.orders);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setName(user?.name || '');
    setEmail(user?.email || '');

    dispatch(fetchMyOrders());
  }, [dispatch, isAuthenticated, navigate, user?.email, user?.name]);

  const submitProfileHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container mx-auto px-4 py-10 mt-16 min-h-screen max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* LEFT COLUMN: USER INFO CARD */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border text-center">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 font-extrabold text-2xl mx-auto mb-4 border border-indigo-100 dark:border-indigo-800">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{user?.name}</h2>
            <p className="text-xs text-gray-500 truncate mt-1">{user?.email}</p>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <FiUser /> Account Settings
            </h3>
            <form onSubmit={submitProfileHandler} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDERS HISTORY LEDGER */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border h-full flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-4 mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                  <FiShoppingBag className="text-indigo-600" /> Order History
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">Track your past PayPal and Stripe processing items</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-bold">
                {orders.length} Orders
              </span>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20">
                <FiLoader className="animate-spin text-indigo-600 text-4xl mb-4" />
                <h3 className="font-bold text-gray-700 dark:text-gray-300">
                  Retrieving secure ledger entries...
                </h3>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">{error}</div>
            ) : orders.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-full flex items-center justify-center mb-4">
                  <FiShoppingBag size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No orders found</h3>
                <p className="text-sm text-gray-500 max-w-xs mb-4">You haven't purchased anything from ShopVerse yet.</p>
                <button
                  onClick={() => navigate('/products')}
                  className="bg-indigo-600 text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-dark-border text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50/50 dark:bg-dark-bg/20">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Paid</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                    {orders.map((order) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="py-4 px-4 font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                          #{order._id.substring(0, 10)}...
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                          {new Date(order.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">
                          ${Number(order.totalPrice).toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          {order.isPaid ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold bg-green-50 dark:bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full">
                              <FiCheckCircle size={12} />{' '}
                              {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : 'Paid'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-50 dark:bg-red-500/10 text-red-500 px-2.5 py-1 rounded-full">
                              <FiXCircle size={12} /> Pending
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                            className="inline-flex items-center gap-1.5 bg-gray-900 dark:bg-gray-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white text-white dark:text-gray-200 px-3.5 py-1.5 rounded-xl font-semibold text-xs shadow-sm transition-all group"
                          >
                            Details <FiArrowRight className="transform group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

