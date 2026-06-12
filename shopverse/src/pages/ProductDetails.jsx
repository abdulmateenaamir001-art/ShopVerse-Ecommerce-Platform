import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiArrowLeft, FiShoppingCart, FiCheck, FiX, FiLoader, FiZoomIn } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { addToCart } from '../redux/slices/cartSlice'; 
import { motion } from 'framer-motion';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [imageZoom, setImageZoom] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await response.json();
        if (response.ok) {
          setProduct(data);
          setSize(data?.sizes?.[0] || '');
          setColor(data?.colors?.[0] || '');
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

  const addToCartHandler = () => {
    if (!auth.isAuthenticated) {
      toast.error('Please sign in to add items to your cart.');
      navigate('/login');
      return;
    }

    if (product.countInStock === 0) {
      toast.error('Out of stock');
      return;
    }

    dispatch(addToCart({
      ...product,
      quantity: Number(qty),
      selectedSize: size,
      selectedColor: color,
    }));

    toast.success('Added to cart!');
    navigate('/cart');
  };

  if (isLoading) return <div className="py-32 flex justify-center"><FiLoader className="animate-spin text-6xl text-indigo-600" /></div>;
  if (!product) return <div className="py-32 text-center text-gray-500 font-bold text-2xl">Product not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-12 transition-colors font-semibold group">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Products
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
        >
          {/* Left: Product Image */}
          <div className="flex flex-col gap-8">
            <motion.div
              className="relative bg-white dark:bg-gray-800 rounded-3xl p-12 flex items-center justify-center border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden group cursor-zoom-in"
              onHoverStart={() => setImageZoom(true)}
              onHoverEnd={() => setImageZoom(false)}
            >
              <motion.img
                src={product.image}
                alt={product.title}
                className="w-full max-w-sm object-contain"
                animate={{ scale: imageZoom ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              />
              {imageZoom && (
                <div className="absolute top-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg">
                  <FiZoomIn size={20} />
                </div>
              )}
            </motion.div>
          </div>

          {/* Right: Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col"
          >
            {/* Brand */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm font-bold text-indigo-600 tracking-widest uppercase mb-3 bg-indigo-100 dark:bg-indigo-900/30 w-fit px-4 py-1 rounded-full"
            >
              {product.brand}
            </motion.span>

            {/* Title */}
            <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-yellow-400 text-2xl">
                {"★".repeat(Math.round(product.rating || 0))}
                {"☆".repeat(5 - Math.round(product.rating || 0))}
              </div>
              <span className="text-gray-600 dark:text-gray-400 font-semibold">
                ({product.numReviews} {product.numReviews === 1 ? 'Review' : 'Reviews'})
              </span>
            </div>

            {/* Price */}
            <motion.div className="mb-8">
              <p className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ${product.price.toFixed(2)}
              </p>
            </motion.div>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Stock & Variants Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8 border-2 border-gray-100 dark:border-gray-700 shadow-lg"
            >
              {/* Stock Status */}
              <div className="flex items-center justify-between mb-8 pb-8 border-b-2 border-gray-100 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300 font-bold text-lg">Stock Status:</span>
                <motion.span
                  className={`font-bold flex items-center gap-2 text-lg px-4 py-2 rounded-full ${
                    product.countInStock > 0
                      ? 'text-green-600 bg-green-100 dark:bg-green-900/30'
                      : 'text-red-600 bg-red-100 dark:bg-red-900/30'
                  }`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {product.countInStock > 0 ? <><FiCheck size={20} /> In Stock</> : <><FiX size={20} /> Out of Stock</>}
                </motion.span>
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <label className="text-gray-700 dark:text-gray-300 font-bold text-lg block mb-4">
                    Select Size
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((s) => (
                      <motion.button
                        key={s}
                        onClick={() => setSize(s)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-3 text-sm font-bold rounded-xl border-2 transition-all transform ${
                          size === s
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/50'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                        }`}
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="mb-8"
                >
                  <label className="text-gray-700 dark:text-gray-300 font-bold text-lg block mb-4">
                    Select Color
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((c) => (
                      <motion.button
                        key={c}
                        onClick={() => setColor(c)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-3 text-sm font-bold rounded-xl border-2 transition-all transform ${
                          color === c
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/50'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                        }`}
                      >
                        {c}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quantity */}
              {product.countInStock > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-between"
                >
                  <label className="text-gray-700 dark:text-gray-300 font-bold text-lg">
                    Quantity:
                  </label>
                  <motion.select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    whileHover={{ scale: 1.05 }}
                    className="bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-300 dark:border-indigo-700 text-gray-900 dark:text-white font-bold rounded-lg px-6 py-3 outline-none cursor-pointer hover:border-indigo-500 transition-colors"
                  >
                    {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                    {product.countInStock > 10 && <option value={product.countInStock}>Max ({product.countInStock})</option>}
                  </motion.select>
                </motion.div>
              )}
            </motion.div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(79, 70, 229, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 text-lg shadow-xl"
            >
              <FiShoppingCart size={28} />
              {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-24"
          >
            <h2 className="text-4xl font-black mb-12 text-gray-900 dark:text-white">Customer Reviews</h2>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
              {product.reviews.map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">{review.name}</p>
                      <div className="flex text-yellow-400 text-2xl mt-2">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}