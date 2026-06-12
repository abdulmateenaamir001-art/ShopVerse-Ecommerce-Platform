import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiUser, FiPackage, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Profile() {
  const auth = useSelector((state) => state.auth);
  
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders/myorders', {
          headers: { Authorization: `Bearer ${auth.user.token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        } else {
          toast.error(data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        toast.error('Network error fetching orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyOrders();
  }, [auth.user.token]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">My Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Side: User Info Card */}
        <div className="md:w-1/3">
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border text-center sticky top-24">
            <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
              <FiUser />
            </div>
            <h2 className="text-xl font-bold dark:text-white">{auth.user.name}</h2>
            <p className="text-gray-500 mb-6">{auth.user.email}</p>
            <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Orders</p>
              <p className="text-3xl font-extrabold text-primary-600">{orders.length}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Order History Table */}
        <div className="md:w-2/3">
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
            <h2 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2"><FiPackage /> Order History</h2>
            
            {isLoading ? (
              <div className="flex justify-center py-12"><FiLoader className="animate-spin text-4xl text-primary-600" /></div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-dark-bg rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                <Link to="/products" className="bg-primary-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-700 transition-colors">Start Shopping</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 text-sm uppercase tracking-wider">
                      <th className="pb-3 font-bold">ID</th>
                      <th className="pb-3 font-bold">Date</th>
                      <th className="pb-3 font-bold">Total</th>
                      <th className="pb-3 font-bold text-center">Paid</th>
                      <th className="pb-3 font-bold text-center">Delivered</th>
                      <th className="pb-3 font-bold text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="py-4 text-sm font-medium dark:text-gray-300">{order._id.substring(0, 8)}...</td>
                        <td className="py-4 text-sm dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 text-sm font-bold text-gray-900 dark:text-white">${order.totalPrice.toFixed(2)}</td>
                        <td className="py-4 text-center">
                          {order.isPaid ? <FiCheck className="mx-auto text-green-500 text-xl" /> : <FiX className="mx-auto text-red-500 text-xl" />}
                        </td>
                        <td className="py-4 text-center">
                          {order.isDelivered ? <FiCheck className="mx-auto text-green-500 text-xl" /> : <FiX className="mx-auto text-red-500 text-xl" />}
                        </td>
                        <td className="py-4 text-right">
                          <Link to={`/dashboard/orders/${order._id}`} className="bg-gray-100 dark:bg-gray-700 hover:bg-primary-100 hover:text-primary-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                            View
                          </Link>
                        </td>
                      </tr>
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