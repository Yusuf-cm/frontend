'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/auth/useAuth';
import { getAuthenticatedApi } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// ======================== IMPROVEMENT SUMMARY ========================
// 1. Added animations with Framer Motion for better UX
// 2. Improved accessibility with ARIA attributes and focus management
// 3. Enhanced error handling with retry mechanism
// 4. Optimized loading states with better skeletons
// 5. Added logout functionality
// 6. Improved responsive design
// 7. Added order status details
// 8. Performance optimizations
// 9. Better empty state design
// =====================================================================

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const AccountHeader = ({ user, onLogout }) => (
  <div className="mb-10 text-center relative">
    <div className="absolute top-0 right-0">
      <button
        onClick={onLogout}
        className="text-sm px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors flex items-center"
        aria-label="Log out of account"
      >
        Logout
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
    
    <motion.h1 
      className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      My Account
    </motion.h1>
    
    <motion.div 
      className="bg-gradient-to-r from-indigo-500 to-purple-600 w-16 h-1 rounded-full mx-auto"
      initial={{ width: 0 }}
      animate={{ width: 64 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    />
    
    <motion.p 
      className="mt-6 text-lg text-gray-700 max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      Welcome back,{' '}
      <span className="font-semibold text-indigo-600">
        {user?.first_name || user?.username}
      </span>
      !
    </motion.p>
  </div>
);

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
      variants={cardVariants}
      whileHover={{ y: -5 }}
    >
      {/* Order Header - Clickable area */}
      <button 
        className="w-full text-left bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-3 border-b border-gray-200"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={`order-details-${order.id}`}
      >
        <div>
          <p className="font-bold text-gray-900 flex items-center">
            <OrderIcon />
            Order #{order.id}
          </p>
          <p className="text-sm text-gray-500 mt-1 pl-7">
            Placed on: {format(new Date(order.created_at), 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-semibold text-lg text-gray-900">
            Ksh{Number(order.get_total_cost).toFixed(2)}
          </p>
          <StatusBadge paid={order.paid} />
          <ChevronIcon expanded={expanded} />
        </div>
      </button>
      
      {/* Collapsible details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            id={`order-details-${order.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <AddressSection order={order} />
              <ItemsSection order={order} />
            </div>
            
            {/* Additional order metadata */}
            <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-indigo-50 p-3 rounded-lg">
                <p className="font-medium text-indigo-700">Payment Method</p>
                <p className="text-gray-700">{order.payment_method || 'Credit Card'}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="font-medium text-green-700">Delivery Status</p>
                <p className="text-gray-700">{order.delivery_status || 'Processing'}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="font-medium text-purple-700">Estimated Delivery</p>
                <p className="text-gray-700">
                  {order.estimated_delivery 
                    ? format(new Date(order.estimated_delivery), 'MMM d, yyyy') 
                    : 'Within 5 business days'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ChevronIcon = ({ expanded }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
    viewBox="0 0 20 20" 
    fill="currentColor"
    aria-hidden="true"
  >
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const OrderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

const StatusBadge = ({ paid }) => (
  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
    paid 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800'
  }`}>
    {paid ? 'Paid' : 'Pending'}
  </span>
);

const AddressSection = ({ order }) => (
  <div>
    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
      <LocationIcon />
      Shipped To:
    </h4>
    <address className="not-italic text-gray-600 text-sm bg-gray-50 rounded-lg p-4 border border-gray-100">
      {order.first_name} {order.last_name}<br/>
      {order.address_line_1}<br/>
      {order.address_line_2 && <>{order.address_line_2}<br/></>}
      {order.city}, {order.county_state}<br/>
      Phone: {order.phone}
    </address>
  </div>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const ItemsSection = ({ order }) => (
  <div>
    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
      <ItemsIcon />
      Items:
    </h4>
    <ul className="space-y-3">
      {order.items.map(item => (
        <li key={item.id} className="flex justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100">
          <span>
            {item.quantity} ×{' '}
            <Link 
              href={`/products/${item.product}`} 
              className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
              aria-label={`View ${item.product_name} product page`}
            >
              {item.product_name || `Product ID: ${item.product}`}
            </Link>
          </span>
          <span className="font-medium text-gray-800">Ksh{(item.price * item.quantity).toFixed(2)}</span>
        </li>
      ))}
    </ul>
  </div>
);

const ItemsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
  </svg>
);

const EmptyOrderState = () => (
  <motion.div 
    className="text-center py-12"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-serif font-medium text-gray-900 mb-2">No orders yet</h3>
    <p className="text-gray-500 max-w-md mx-auto mb-6">
      You haven't placed any orders. Start shopping to see your order history here.
    </p>
    <Link 
      href="/products" 
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      aria-label="Browse our products"
    >
      Browse Products
      <ArrowIcon />
    </Link>
  </motion.div>
);

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const LoadingSkeleton = () => (
  <div className="space-y-6" aria-label="Loading orders">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-16 w-full" />
          <div className="p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-100 rounded"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="h-10 bg-gray-100 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ErrorMessage = ({ error, onRetry }) => (
  <motion.div 
    className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    role="alert"
    aria-live="assertive"
  >
    <p className="text-red-700 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {error}
    </p>
    <button 
      onClick={onRetry}
      className="mt-2 text-sm font-medium text-red-600 hover:text-red-800 underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
      aria-label="Retry loading orders"
    >
      Try again
    </button>
  </motion.div>
);

export default function AccountPage() {
    const { user, authTokens, logoutUser, setAuthTokens } = useAuth();
    const router = useRouter();
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrderHistory = useCallback(async () => {
        if (!user || !authTokens) return;
        
        try {
            setLoading(true);
            setError('');
            const api = getAuthenticatedApi({ authTokens, setAuthTokens, logoutUser });
            const data = await api('/orders/history/');
            setOrders(data);
        } catch (err) {
            console.error("Failed to fetch order history:", err);
            setError('Could not load your order history. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [user, authTokens, setAuthTokens, logoutUser]);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchOrderHistory();
    }, [user, router, fetchOrderHistory]);

    const handleLogout = () => {
        logoutUser();
        router.push('/');
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
            <AccountHeader user={user} onLogout={handleLogout} />
    
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 font-serif">
                        Order History
                    </h2>
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                </div>
    
                {error && (
                    <ErrorMessage 
                        error={error} 
                        onRetry={fetchOrderHistory} 
                    />
                )}
    
                {loading ? (
                    <LoadingSkeleton />
                ) : orders.length > 0 ? (
                    <motion.div 
                        className="space-y-6"
                        initial="hidden"
                        animate="visible"
                        variants={{
                          visible: {
                            transition: {
                              staggerChildren: 0.1
                            }
                          }
                        }}
                    >
                        {orders.map(order => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </motion.div>
                ) : (
                    <EmptyOrderState />
                )}
            </div>
        </div>
    );
}