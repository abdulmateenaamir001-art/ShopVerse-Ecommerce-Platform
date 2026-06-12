import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiShoppingBag, FiPackage, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';
import DashboardCharts from '../../components/DashboardCharts.jsx';

export default function AdminDashboard() {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==== 📡 LIVE DB SYNC EFFECT LOOP ====
  useEffect(() => {
    const fetchSummaryMetrics = async () => {
      try {
        const { data } = await axios.get('/api/orders/summary'); 
        setSummaryData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error connecting to summary telemetry:', error);
        setLoading(false);
      }
    };
    fetchSummaryMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Extract variables safely from your MongoDB payload
  const totalRevenue = summaryData?.totalRevenue || 0;
  const totalOrders = summaryData?.numOrders || 0;
  const totalProducts = summaryData?.numProducts || 0;
  
  // NOTE: If your backend summary route doesn't send 'lowStockCount' yet, 
  // you may need to add it to your Express controller, or we can fetch it separately later!
  const lowStockCount = summaryData?.lowStockCount || 10; 

  return (
    <div className="space-y-6 animate-fade-in p-1">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Admin Control Panel</h1>
        <p className="text-sm text-gray-500 mt-1">Live system metrics and marketplace overview.</p>
      </div>

      {/* 🚀 Top Row: Minimalist KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Revenue Card */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gross Revenue</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <FiTrendingUp className="text-lg" />
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Sales</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{totalOrders}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FiShoppingBag className="text-lg" />
            </div>
          </div>
        </div>

        {/* Catalog Card */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Catalog</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{totalProducts}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FiPackage className="text-lg" />
            </div>
          </div>
        </div>

        {/* Sleek Low Stock Alert Card */}
        <div className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${
          lowStockCount > 0 
            ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/50' 
            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${lowStockCount > 0 ? 'text-amber-700 dark:text-amber-500' : 'text-gray-400'}`}>
                Low Stock Alert
              </p>
              <h3 className={`text-2xl font-black mt-1 ${lowStockCount > 0 ? 'text-amber-900 dark:text-amber-400' : 'text-gray-900 dark:text-white'}`}>
                {lowStockCount} Items
              </h3>
            </div>
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${lowStockCount > 0 ? 'bg-amber-200/50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-700'}`}>
              <FiAlertCircle className="text-lg" />
            </div>
          </div>
          {lowStockCount > 0 && (
            <Link to="/admin/products" className="text-xs font-bold text-amber-700 dark:text-amber-500 hover:text-amber-800 flex items-center gap-1 mt-3 transition-colors">
              Review Inventory <FiArrowRight />
            </Link>
          )}
        </div>

      </div>

      {/* 📈 Main Content Area: Your Live Chart Component */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Sales Performance</h2>
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-bold rounded-lg text-gray-600 dark:text-gray-300">
            Live Metrics
          </span>
        </div>
        
        {/* Your original chart component, cleanly integrated */}
        <DashboardCharts summaryData={summaryData} />

      </div>
    </div>
  );
}