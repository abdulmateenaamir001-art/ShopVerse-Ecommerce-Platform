import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProductCarousel() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/top');
        const data = await response.json();
        if (response.ok) setProducts(data);
        else toast.error('Failed to load top products');
      } catch (error) {
        console.error('Error fetching top products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopProducts();
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [products.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));

  if (isLoading) return <div className="h-96 flex items-center justify-center bg-gray-50 dark:bg-dark-card rounded-3xl"><FiLoader className="animate-spin text-4xl text-indigo-600" /></div>;
  if (!products || products.length === 0) return null;

  return (
    <div className="relative h-[400px] sm:h-[500px] w-full bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl overflow-hidden shadow-2xl mb-12 group mt-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center"
        >
          <div className="container mx-auto px-8 md:px-16 flex flex-col-reverse md:flex-row items-center justify-between h-full gap-8">
            
            {/* Text Content */}
            <div className="w-full md:w-1/2 flex flex-col justify-center text-white z-10">
              <span className="text-yellow-400 font-bold tracking-widest uppercase text-sm mb-2 drop-shadow-md">★ Top Rated</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg line-clamp-2">
                {products[currentIndex].title}
              </h2>
              <p className="text-indigo-200 text-lg sm:text-xl mb-8 font-medium">
                Only ${products[currentIndex].price.toFixed(2)}
              </p>
              <Link 
                to={`/products/${products[currentIndex]._id}`}
                className="bg-white text-indigo-900 px-8 py-3 rounded-full font-extrabold hover:bg-indigo-50 hover:scale-105 transition-all w-max shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                Shop Now
              </Link>
            </div>

            {/* Image */}
            <div className="w-full md:w-1/2 h-[200px] md:h-full flex items-center justify-center z-10 mt-8 md:mt-0">
              <img 
                src={products[currentIndex].image} 
                alt={products[currentIndex].title} 
                className="max-h-full max-w-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
          
          {/* Decorative Background Blob */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons (Appear on Hover) */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-20">
        <FiChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-20">
        <FiChevronRight size={24} />
      </button>

      {/* Progress Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {products.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}