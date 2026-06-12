import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiEdit, FiTrash2, FiPlus, FiLoader, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch All Products
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.message || 'Failed to fetch products');
        return;
      }

      // Normalize API response to always be an array
      // Possible shapes:
      // - [{...}, {...}] (already an array)
      // - { products: [...] }
      // - { products: [...], page: 1, pages: N }
      // - { product: [...] }
      const normalized = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data?.product)
            ? data.product
            : [];

      setProducts(normalized);
    } catch (err) {
      toast.error('Network error fetching products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!auth.user || !auth.user.isAdmin) {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [auth.user, navigate]);

  // 2. Handler to Create a "Sample" Product
  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        const response = await fetch('http://localhost:5000/api/products', {
          method: 'POST',
          headers: { Authorization: `Bearer ${auth.user.token}` },
        });
        const data = await response.json();

        if (response.ok) {
          toast.success('Sample Product Created!');
          // Immediately redirect the admin to the edit page for this new product!
          navigate(`/admin/products/${data._id}/edit`);
        } else {
          toast.error(data.message || 'Failed to create product');
        }
      } catch (err) {
        toast.error('Network Error during creation');
      }
    }
  };

  // 3. Handler to Delete a Product
  const deleteHandler = async (id) => {
    if (window.confirm('Are you SURE you want to delete this product? This cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${auth.user.token}` },
        });

        if (response.ok) {
          toast.success('Product Deleted');
          fetchProducts(); // Refresh the table so the deleted item disappears
        } else {
          toast.error('Failed to delete product');
        }
      } catch (err) {
        toast.error('Network error deleting product');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <FiPackage className="text-4xl text-indigo-600" />
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Product Inventory</h1>
            <p className="text-gray-500 font-medium">Manage your store's catalog.</p>
          </div>
        </div>
        <button 
          onClick={createProductHandler}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all flex items-center gap-2"
        >
          <FiPlus /> Create Product
        </button>
      </div>

      <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-border">
        {isLoading ? (
          <div className="flex justify-center py-12"><FiLoader className="animate-spin text-4xl text-indigo-600" /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No products found. Click 'Create Product' to add one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 text-sm uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">
                  <th className="p-4 font-bold rounded-tl-lg">ID</th>
                  <th className="p-4 font-bold">Name</th>
                  <th className="p-4 font-bold">Price</th>
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold">Brand</th>
                  <th className="p-4 font-bold text-right rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 text-sm font-medium dark:text-gray-300">{product._id.substring(0, 8)}...</td>
                    <td className="p-4 text-sm font-bold dark:text-white">{product.title}</td>
                    <td className="p-4 text-sm font-bold text-indigo-600">${product.price.toFixed(2)}</td>
                    <td className="p-4 text-sm dark:text-gray-300">{product.category}</td>
                    <td className="p-4 text-sm dark:text-gray-300">{product.brand}</td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <Link 
                        to={`/admin/products/${product._id}/edit`} 
                        className="bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 hover:text-blue-600 text-gray-700 dark:text-gray-300 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <FiEdit size={18} />
                      </Link>
                      <button 
                        onClick={() => deleteHandler(product._id)}
                        className="bg-gray-100 dark:bg-gray-700 hover:bg-red-100 hover:text-red-600 text-gray-700 dark:text-gray-300 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <FiTrash2 size={18} />
                      </button>
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