import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiTrash2, FiCheck, FiX, FiLoader, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminCustomers() {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${auth.user.token}` },
      });
      const data = await response.json();
      if (response.ok) setUsers(data);
      else toast.error(data.message || 'Failed to fetch users');
    } catch (err) {
      toast.error('Network error fetching users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Security check: Kick them out if not admin
    if (!auth.user || !auth.user.isAdmin) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [auth.user, navigate]);

  // Handle User Deletion
  const deleteHandler = async (id) => {
    if (window.confirm('Are you SURE you want to delete this customer?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${auth.user.token}` },
        });

        const data = await response.json();

        if (response.ok) {
          toast.success('User deleted successfully');
          fetchUsers(); // Refresh the table
        } else {
          toast.error(data.message || 'Failed to delete user');
        }
      } catch (err) {
        toast.error('Network error deleting user');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <FiUsers className="text-4xl text-indigo-600" />
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Customer Management</h1>
          <p className="text-gray-500 font-medium">View and manage all registered users.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-border">
        {isLoading ? (
          <div className="flex justify-center py-12"><FiLoader className="animate-spin text-4xl text-indigo-600" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 text-sm uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">
                  <th className="p-4 font-bold rounded-tl-lg">ID</th>
                  <th className="p-4 font-bold">Name</th>
                  <th className="p-4 font-bold">Email</th>
                  <th className="p-4 font-bold text-center">Admin Status</th>
                  <th className="p-4 font-bold text-right rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 text-sm font-medium dark:text-gray-300">{user._id.substring(0, 8)}...</td>
                    <td className="p-4 text-sm font-bold dark:text-white">{user.name}</td>
                    <td className="p-4 text-sm text-indigo-600"><a href={`mailto:${user.email}`}>{user.email}</a></td>
                    <td className="p-4 text-center">
                      {user.isAdmin ? (
                        <FiCheck className="mx-auto text-green-500 text-xl" />
                      ) : (
                        <FiX className="mx-auto text-red-500 text-xl" />
                      )}
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      {/* Only allow deleting if they are NOT an admin */}
                      {!user.isAdmin && (
                        <button 
                          onClick={() => deleteHandler(user._id)}
                          className="bg-gray-100 dark:bg-gray-700 hover:bg-red-100 hover:text-red-600 text-gray-700 dark:text-gray-300 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
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