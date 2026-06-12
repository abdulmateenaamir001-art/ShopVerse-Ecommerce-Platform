import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

const CATEGORIES = [
  'All Categories',
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

export default function SearchBox() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All Categories');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    
    let url = '/products?';
    const params = [];

    if (keyword.trim()) {
      params.push(`keyword=${encodeURIComponent(keyword.trim())}`);
    }
    
    // Only append category filter if it's not the generic "All Categories" flag
    if (category !== 'All Categories') {
      params.push(`category=${encodeURIComponent(category)}`);
    }

    if (params.length > 0) {
      url += params.join('&');
    }

    navigate(url);
  };

  return (
    <form onSubmit={submitHandler} className="flex w-full max-w-2xl items-center bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-300 dark:border-gray-600 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-indigo-500">
      {/* Category Selection Dropdown */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-3 md:px-4 py-2.5 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium border-r border-gray-300 dark:border-gray-600 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Input Field Text */}
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="What are you looking for today?..."
        className="w-full px-4 py-2 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm"
      />

      {/* Search Submission Icon Action */}
      <button
        type="submit"
        className="px-5 py-3.5 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center shrink-0"
      >
        <FiSearch size={18} />
      </button>
    </form>
  );
}