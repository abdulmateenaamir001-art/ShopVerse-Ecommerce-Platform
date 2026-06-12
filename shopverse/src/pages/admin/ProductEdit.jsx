import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiArrowLeft, FiSave, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProductEdit() {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // 1. Fetch the existing product data to fill the form
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await response.json();

        if (response.ok) {
          setTitle(data.title);
          setPrice(data.price);
          setImage(data.image);
          setBrand(data.brand);
          setCategory(data.category);
          setCountInStock(data.countInStock);
          setDescription(data.description);
        } else {
          toast.error(data.message || 'Product not found');
        }
      } catch (error) {
        toast.error('Network error fetching product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 2. Handle the Form Submission to Update MongoDB
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.user.token}`,
        },
        body: JSON.stringify({
          title, price, image, brand, category, countInStock, description,
        }),
      });

      if (response.ok) {
        toast.success('Product Updated Successfully!');
        navigate('/admin/products'); // Send admin back to the product list!
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update product');
      }
    } catch (err) {
      toast.error('Network error during update');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div className="py-20 text-center"><FiLoader className="animate-spin text-5xl mx-auto text-indigo-600" /></div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link to="/admin/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
        <FiArrowLeft /> Back to Products
      </Link>

      <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-dark-border">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Edit Product</h1>

        <form onSubmit={submitHandler} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Product Name</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Price ($)</label>
              <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            {/* Count In Stock */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Stock Quantity</label>
              <input 
                type="number" 
                value={countInStock} 
                onChange={(e) => setCountInStock(e.target.value)}
                className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Brand</label>
              <input 
                type="text" 
                value={brand} 
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <input 
                type="text" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
              <input 
                type="text" 
                value={image} 
                onChange={(e) => setImage(e.target.value)}
                className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="https://images.unsplash.com/photo-..."
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isUpdating}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-8"
          >
            {isUpdating ? <FiLoader className="animate-spin" /> : <><FiSave /> Save Changes</>}
          </button>
        </form>

      </div>
    </div>
  );
}