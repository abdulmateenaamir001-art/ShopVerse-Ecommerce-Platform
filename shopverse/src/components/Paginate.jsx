import { Link } from 'react-router-dom';

export default function Paginate({ pages, page, keyword = '' }) {
  // Don't show the pagination bar if there is only 1 page of products!
  if (pages <= 1) return null; 

  return (
    <div className="flex justify-center mt-12 mb-4">
      <nav className="flex gap-2 bg-white dark:bg-dark-card px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
        {[...Array(pages).keys()].map((x) => (
          <Link
            key={x + 1}
            to={keyword ? `/products?keyword=${keyword}&pageNumber=${x + 1}` : `/products?pageNumber=${x + 1}`}
            className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${
              x + 1 === page
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-50 dark:bg-dark-bg text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-600'
            }`}
          >
            {x + 1}
          </Link>
        ))}
      </nav>
    </div>
  );
}