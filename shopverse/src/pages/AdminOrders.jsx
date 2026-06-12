import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiCheck, FiX, FiLoader, FiShield, FiBox } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Security Check: Kick them out if they aren't an admin!
    if (!auth.user || !auth.user.isAdmin) {
      toast.error('Not authorized as an admin');
      navigate('/');
      return;
    }

    const fetchAllOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders', {
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

    fetchAllOrders();
  }, [auth.user, navigate]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
          <FiShield className="text-4xl text-indigo-600" />
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Admin Orders Registry</h1>
          <p className="text-gray-500 font-medium">Audit complete checkout funnels, payment settlements, and tracking tags</p>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-border">
        <h2 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2">
          <FiBox /> All Global Orders ({orders.length})
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center py-12"><FiLoader className="animate-spin text-4xl text-indigo-600" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No orders found in the database.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 text-sm uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">
                  <th className="p-4 font-bold rounded-tl-lg">ID</th>
                  <th className="p-4 font-bold">User</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Total</th>
                  <th className="p-4 font-bold text-center">Paid</th>
                  <th className="p-4 font-bold text-center">Delivered</th>
                  <th className="p-4 font-bold text-right rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 text-sm font-medium dark:text-gray-300">{order._id.substring(0, 8)}...</td>
                    {/* Notice we can see the user's name because of .populate() in the backend! */}
                    <td className="p-4 text-sm font-bold dark:text-white">{order.user ? order.user.name : 'Deleted User'}</td>
                    <td className="p-4 text-sm dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-sm font-bold text-indigo-600">${order.totalPrice.toFixed(2)}</td>
                    <td className="p-4 text-center">
                      {order.isPaid ? <FiCheck className="mx-auto text-green-500 text-xl" /> : <FiX className="mx-auto text-red-500 text-xl" />}
                    </td>
                    <td className="p-4 text-center">
                      {order.isDelivered ? <FiCheck className="mx-auto text-green-500 text-xl" /> : <FiX className="mx-auto text-red-500 text-xl" />}
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        to={`/dashboard/orders/${order._id}`} 
                        className="bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 hover:text-indigo-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-bold transition-colors inline-block"
                      >
                        Details
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
  );
}