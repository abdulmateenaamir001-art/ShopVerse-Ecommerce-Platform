import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import Paginate from '../components/Paginate'; 
import { FiFilter, FiX, FiSliders, FiLoader } from 'react-icons/fi';

const CATEGORIES = [
  'Mens Fashion', 
  'Womens Fashion', 
  'Kids', 
  'Accessories', 
  'Perfumes', 
  'Games', 
  'Home Decor', 
  'Stationery', 
  'Electronics'
];

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: 99999 },
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 to $100', min: 50, max: 100 },
  { label: '$100 to $500', min: 100, max: 500 },
  { label: 'Over $500', min: 500, max: 99999 },
];

export default function Products() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword') || ''; 
  const urlCategory = searchParams.get('category') || ''; 
  const pageNumber = searchParams.get('pageNumber') || 1;

  // --- Database State ---
  const [dbProducts, setDbProducts] = useState([]);
  const [page, setPage] = useState(1);   
  const [pages, setPages] = useState(1); 
  const [isLoading, setIsLoading] = useState(true);

  // --- Filter States ---
  const [selectedCategories, setSelectedCategories] = useState(
    urlCategory ? [urlCategory] : []
  );
  const [selectedPrice, setSelectedPrice] = useState('All Prices');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Synchronize state if the user performs a completely fresh search from the Top Nav Search Box
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategories([urlCategory]);
    } else {
      setSelectedCategories([]);
    }
  }, [urlCategory, keyword]);

  // --- Fetch Data from Node.js Backend with Filter Parameters ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true); 
        
        // Convert selected filters array into a comma-separated string for backend processing
        const categoryParam = selectedCategories.length > 0 ? selectedCategories.join(',') : '';
        
        const response = await fetch(
          `http://localhost:5000/api/products?keyword=${keyword}&pageNumber=${pageNumber}&category=${categoryParam}`
        );
        const data = await response.json();
        
        setDbProducts(data.products || []);
        setPage(data.page || 1);
        setPages(data.pages || 1);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching from backend:", error);
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, pageNumber, selectedCategories]);

  // --- The Frontend Client Sorting & Pricing Engine ---
  const filteredAndSortedProducts = useMemo(() => {
    let result = dbProducts; 
    
    // Price Range Filter Execution
    const range = PRICE_RANGES.find(r => r.label === selectedPrice);
    if (range) {
      result = result.filter(p => p.price >= range.min && p.price <= range.max);
    }
    
    // Featured Toggle Filter
    if (featuredOnly) {
      result = result.filter(p => p.featured);
    }

    // Sort Selection Execution
    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedPrice, featuredOnly, sortBy, dbProducts]);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPrice('All Prices');
    setFeaturedOnly(false);
    setSortBy('recommended');
  };

  // --- Filter Sidebar Component ---
  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-sm tracking-wider flex items-center gap-2">
          <FiSliders /> Categories
        </h3>
        <div className="space-y-3">
          {CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5">
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes(cat)} 
                  onChange={() => toggleCategory(cat)} 
                  className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-colors cursor-pointer" 
                />
                <FiX size={14} className="text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none rotate-45" />
              </div>
              <span className={`text-sm transition-colors ${selectedCategories.includes(cat) ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-600 dark:text-gray-400 group-hover:text-indigo-600'}`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>
      <hr className="border-gray-200 dark:border-dark-border" />
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-sm tracking-wider">Price</h3>
        <div className="space-y-3">
          {PRICE_RANGES.map(range => (
            <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5">
                <input 
                  type="radio" 
                  name="price" 
                  checked={selectedPrice === range.label} 
                  onChange={() => setSelectedPrice(range.label)} 
                  className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full checked:border-indigo-600 transition-colors cursor-pointer" 
                />
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <span className={`text-sm transition-colors ${selectedPrice === range.label ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-600 dark:text-gray-400 group-hover:text-indigo-600'}`}>
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>
      <hr className="border-gray-200 dark:border-dark-border" />
      
      {/* Featured Filtering Constraint Option */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={featuredOnly} 
            onChange={(e) => setFeaturedOnly(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 accent-indigo-600"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured Items Only</span>
        </label>
      </div>

      {/* Client Sorting Options dropdown */}
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-2 uppercase text-sm tracking-wider">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm"
        >
          <option value="recommended">Recommended</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      <button onClick={clearAllFilters} className="w-full py-3 text-sm font-bold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-500/10 rounded-xl transition-colors mt-6">
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            <Link to="/" className="hover:text-indigo-600">Home</Link> / <span className="text-gray-900 dark:text-gray-200 ml-1">Products</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {keyword ? `Search: "${keyword}"` : 'Shop All Products'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Showing {filteredAndSortedProducts.length} results on this page
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMobileFiltersOpen(true)} className="lg:hidden flex items-center gap-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border px-4 py-2.5 rounded-lg text-sm font-bold dark:text-white shadow-sm">
            <FiFilter /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border sticky top-24">
            <FilterContent />
          </div>
        </aside>

        <AnimatePresence>
          {isMobileFiltersOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileFiltersOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] lg:hidden" />
              <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.3 }} className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white dark:bg-dark-card shadow-2xl z-[160] flex flex-col lg:hidden">
                <div className="p-4 border-b border-gray-100 dark:border-dark-border flex justify-between items-center bg-gray-50 dark:bg-dark-bg/50">
                  <h2 className="text-lg font-bold dark:text-white flex items-center gap-2"><FiFilter /> Filters</h2>
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-white dark:bg-gray-800 rounded-full text-gray-500 hover:text-red-500 shadow-sm"><FiX size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6"><FilterContent /></div>
                <div className="p-4 border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg/50">
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-md">Show Results</button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FiLoader className="animate-spin text-indigo-600 text-4xl mb-4" />
              <h2 className="text-xl font-bold dark:text-white">Fetching database...</h2>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="bg-white dark:bg-dark-card rounded-2xl p-16 text-center border border-gray-100 dark:border-dark-border shadow-sm flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-6"><FiFilter size={32} /></div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No products match your filters</h2>
              <button onClick={clearAllFilters} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 mt-4">Clear All Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredAndSortedProducts.map((product) => (
                    <motion.div key={product._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Paginate handles the clean page shifting navigation layout buttons */}
              <div className="mt-8">
                <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}