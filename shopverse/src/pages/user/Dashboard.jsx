export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
          <h3 className="text-gray-500 dark:text-gray-400 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
        </div>
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
          <h3 className="text-gray-500 dark:text-gray-400 mb-2">Saved Items</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          You haven't placed any orders yet.
        </div>
      </div>
    </div>
  );
}