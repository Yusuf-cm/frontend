'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/useAuth';
import { getAuthenticatedApi } from '@/utils/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Enhanced Stat Card with animations
const StatCard = ({ title, value, icon, color = 'indigo', isLoading = false }) => {
  const colorClasses = {
    indigo: 'bg-indigo-500',
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  };
  
  const textColors = {
    indigo: 'text-indigo-600',
    green: 'text-green-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden h-28">
        <div className="p-5">
          <div className="flex items-center">
            <Skeleton circle width={48} height={48} />
            <div className="ml-4 w-3/4">
              <Skeleton width="60%" height={16} />
              <Skeleton width="80%" height={24} className="mt-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className={`${colorClasses[color]} rounded-lg p-3 shadow-lg`}>
            {icon}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className={`mt-1 text-2xl font-bold ${textColors[color]}`}>{value}</h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        <div className="mt-2 space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm font-medium text-gray-600 capitalize">{entry.name}:</span>
              <span className="text-sm font-semibold ml-1">Ksh {entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Loading skeleton
const DashboardSkeleton = () => (
  <div className="bg-gray-50 p-4 sm:p-8">
    <div className="animate-pulse space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-56 mt-4 sm:mt-0"></div>
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white p-5 rounded-xl h-28">
            <div className="flex items-center">
              <div className="bg-gray-200 rounded-lg w-12 h-12"></div>
              <div className="ml-4 w-2/3">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="h-80 bg-gray-200 rounded-xl mb-8"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-96 bg-gray-200 rounded-xl"></div>
        <div className="h-96 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const { authTokens, setAuthTokens, logoutUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30');
  const [activeTab, setActiveTab] = useState('sales');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async (days) => {
    if (!authTokens) {
      return;
    }
    try {
      setLoading(true);
      setIsRefreshing(true);
      const api = getAuthenticatedApi({ authTokens, setAuthTokens, logoutUser });
      const data = await api(`/admin/stats/?days=${days}`);
      setStats(data);
      setError('');
    } catch (err) {
      // Handle specific JSON error
      if (err.message.includes('Unexpected token') || err.message.includes('Invalid response')) {
        setError('Server returned invalid data format. Please check backend configuration.');
      } else {
        setError('Failed to load dashboard statistics. Please try again.');
      }
      console.error("API Error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats(timeRange);
  }, [timeRange, authTokens, setAuthTokens, logoutUser]);

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };

  if (loading && !isRefreshing) return <DashboardSkeleton />;
  
  if (error && !stats) {
    return (
      <div className="bg-gray-50 min-h-screen p-8 flex items-center justify-center">
        <motion.div 
          className="max-w-md text-center bg-white p-8 rounded-xl shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => fetchStats(timeRange)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center justify-center"
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : 'Retry'}
            </button>
            <a 
              href="/admin/dashboard" 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition flex items-center justify-center"
            >
              Refresh Page
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            If the problem persists, check your backend API at:
            <br />
            <code className="bg-gray-100 p-1 rounded text-xs mt-1 inline-block">
              {process.env.NEXT_PUBLIC_BACKEND_URL}/admin/stats/
            </code>
          </p>
        </motion.div>
      </div>
    );
  }

  if (!stats) return null;

  // Format data for charts
  const salesData = stats.sales_over_time ? stats.sales_over_time.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Revenue: parseFloat(item.revenue),
    Profit: parseFloat(item.profit),
  })) : [];

  const orderData = stats.orders_over_time ? stats.orders_over_time.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Orders: parseInt(item.order_count),
    Customers: parseInt(item.customer_count),
  })) : [];

  const totalRevenue = stats.total_revenue ? parseFloat(stats.total_revenue).toLocaleString('en-US') : '0';
  const totalProfit = stats.total_profit ? parseFloat(stats.total_profit).toLocaleString('en-US') : '0';
  const inventoryValue = stats.total_inventory_value ? parseFloat(stats.total_inventory_value).toLocaleString('en-US') : '0';
  
  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <motion.h1 
            className="text-3xl font-bold text-gray-900 font-serif"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Admin Dashboard
          </motion.h1>
          <p className="text-gray-600 mt-1">Overview of your store's performance.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border">
            {[{label: '7 Days', value: '7'}, {label: '30 Days', value: '30'}, {label: '90 Days', value: '90'}].map(range => (
              <button
                key={range.value}
                onClick={() => handleTimeRangeChange(range.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range.value
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => fetchStats(timeRange)}
            className="flex items-center px-3 py-1.5 text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 rounded-md border shadow-sm transition-colors"
            disabled={isRefreshing}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard 
          title="Total Revenue" 
          value={`Ksh ${totalRevenue}`} 
          color="indigo"
          isLoading={isRefreshing}
          icon={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
            </svg>
          } 
        />
        <StatCard 
          title="Total Profit" 
          value={`Ksh ${totalProfit}`} 
          color="green"
          isLoading={isRefreshing}
          icon={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          } 
        />
        <StatCard 
          title="Total Orders" 
          value={stats.total_orders ? stats.total_orders.toLocaleString() : '0'} 
          color="amber"
          isLoading={isRefreshing}
          icon={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          } 
        />
        <StatCard 
          title="Inventory Value" 
          value={`Ksh ${inventoryValue}`} 
          color="red"
          isLoading={isRefreshing}
          icon={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          } 
        />
      </div>

      {/* Chart Section */}
      <motion.div 
        className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 font-serif">
            {activeTab === 'sales' ? 'Sales Performance' : 'Orders & Customers'} ({timeRange} Days)
          </h2>
          
          <div className="flex flex-wrap gap-3 mt-3 sm:mt-0">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('sales')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'sales'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sales
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Orders
              </button>
            </div>
            
            <div className="flex items-center">
              {activeTab === 'sales' ? (
                <>
                  <div className="flex items-center mr-4">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Revenue</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Profit</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center mr-4">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Orders</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Customers</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'sales' ? (
              <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }} 
                  tickFormatter={(value) => `Ksh ${value >= 1000 ? `${value/1000}k` : value}`} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="Revenue" 
                  name="Revenue"
                  stroke="#4f46e5" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Profit" 
                  name="Profit"
                  stroke="#10b981" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                />
              </AreaChart>
            ) : (
              <BarChart data={orderData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="Orders" 
                  name="Orders"
                  fill="#4f46e5" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="Customers" 
                  name="Customers"
                  fill="#f59e0b" 
                  radius={[4, 4, 0, 0]}
                />
                <Legend 
                  iconType="circle" 
                  iconSize={10} 
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={(value) => <span className="text-gray-600 text-sm">{value}</span>}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Other Info Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900 font-serif">Top Selling Products</h2>
          </div>
          <div className="p-6">
            {stats.top_selling_products && stats.top_selling_products.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {stats.top_selling_products.map((p, i) => (
                  <motion.li 
                    key={i} 
                    className="py-4 flex items-center justify-between"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center">
                      <span className="text-gray-500 text-sm w-6">#{i+1}</span>
                      <span className="ml-2 font-medium text-gray-900 truncate max-w-[160px]">{p.product__name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">{p.total_sold.toLocaleString()} sold</span>
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Ksh {parseFloat(p.total_revenue).toLocaleString()}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No sales data available</h3>
                <p className="mt-2 text-gray-500">No products have been sold in this period</p>
              </div>
            )}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 font-serif">Inventory Alerts</h2>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {stats.out_of_stock_count || 0} out of stock
              </span>
            </div>
          </div>
          <div className="p-6">
            {stats.low_stock_products && stats.low_stock_products.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {stats.low_stock_products.map((p, i) => (
                  <motion.li 
                    key={i} 
                    className="py-4 flex items-center justify-between"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="font-medium text-gray-900 truncate max-w-[200px]">{p.name}</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className={`h-2 rounded-full ${
                            p.stock > 3 ? 'bg-green-500' : 
                            p.stock > 1 ? 'bg-amber-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${(p.stock / 10) * 100}%` }} 
                        ></div>
                      </div>
                      <span className={`font-medium ${
                        p.stock > 3 ? 'text-green-600' : 
                        p.stock > 1 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {p.stock} left
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">All inventory levels are healthy</h3>
                <p className="mt-2 text-gray-500">No low stock alerts at this time</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}