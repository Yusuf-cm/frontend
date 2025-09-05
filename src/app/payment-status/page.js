// src/app/payment-status/page.js
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/auth/useAuth';
import { getAuthenticatedApi } from '@/utils/api';
import { FiCheckCircle, FiClock, FiXCircle, FiShoppingBag, FiTruck, FiMail, FiPhone } from 'react-icons/fi';
import Image from 'next/image';
import { format } from 'date-fns';

function StatusPageContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const { authTokens, setAuthTokens, logoutUser, loading: authLoading } = useAuth();

  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'processing', 'error'
  const [message, setMessage] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [isProcessed, setIsProcessed] = useState(false); // To prevent re-processing on re-renders

  useEffect(() => {
    // Only proceed if authTokens are loaded and it hasn't been processed yet
    if (authLoading || isProcessed || !authTokens) {
        // If authLoading is true, wait. If no authTokens after loading, something is wrong.
        if (!authLoading && !authTokens) {
            setStatus('error');
            setMessage('You must be logged in to view order details. Please log in.');
        }
        return;
    }

    const orderId = searchParams.get('order_id');
    const paymentStatus = searchParams.get('redirect_status'); // 'succeeded', 'processing', 'requires_payment_method', etc.

    if (!orderId) {
      setStatus('error');
      setMessage('No order information found in the URL. This page might have been accessed incorrectly.');
      setIsProcessed(true); // Mark as processed even if error, to prevent infinite loops
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const api = getAuthenticatedApi({ authTokens, setAuthTokens, logoutUser });
        const data = await api(`/orders/${orderId}/`); // Fetch real order data
        setOrderDetails(data);
        
        // Determine final status based on Stripe redirect_status and fetched order data
        if (paymentStatus === 'succeeded' && data.paid) {
          setStatus('success');
          setMessage('Your payment was successful and your order is confirmed!');
          clearCart(); // Clear cart only after successful confirmation and data fetch
        } else if (paymentStatus === 'processing' && !data.paid) {
          setStatus('processing');
          setMessage('Your payment is processing. We will notify you when it is confirmed.');
        } else if (paymentStatus === 'requires_payment_method' || paymentStatus === 'requires_action') {
            setStatus('error');
            setMessage('Your payment could not be completed. Please try again or contact support.');
        }
        else {
          // Fallback for any other status or mismatch between Stripe status and DB status
          setStatus('error');
          setMessage('There was an issue with your payment. Please try again or contact support.');
          console.warn('Payment status mismatch or unhandled case:', {paymentStatus, orderPaid: data.paid});
        }
      } catch (err) {
        setStatus('error');
        setMessage('Could not retrieve your order details. Please check your account order history or contact support.');
        console.error("Fetch order error:", err);
      } finally {
        setIsProcessed(true); // Mark as processed once the API call is done
      }
    };

    fetchOrderDetails();
  }, [searchParams, clearCart, isProcessed, authTokens, setAuthTokens, logoutUser, authLoading]); // Add authLoading to dependencies

  const renderStatusIcon = () => {
    switch (status) {
      case 'success':
        return <FiCheckCircle className="h-16 w-16 text-green-500 mx-auto animate-bounce" />;
      case 'processing':
        return <FiClock className="h-16 w-16 text-yellow-500 mx-auto animate-pulse" />;
      case 'error':
        return <FiXCircle className="h-16 w-16 text-red-500 mx-auto animate-shake" />;
      default:
        return <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>;
    }
  };

  const renderOrderDetailsSection = () => {
    if (!orderDetails) return null; // Only render if orderDetails are fetched

    return (
      <div className="mt-10 bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order #{orderDetails.id} Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Items */}
          <div>
            <h3 className="font-medium text-gray-900 flex items-center"><FiShoppingBag className="mr-2" /> Items Purchased</h3>
            <ul className="mt-3 space-y-2">
              {orderDetails.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.product_name} × {item.quantity}</span>
                  <span className="font-medium">Ksh{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
              {orderDetails.discount > 0 && (
                <li className="flex justify-between text-sm text-green-600">
                  <span>Discount ({orderDetails.coupon_code || 'Applied'})</span>
                  <span>-Ksh{Number(orderDetails.discount).toFixed(2)}</span>
                </li>
              )}
              <li className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>Ksh{Number(orderDetails.shipping).toFixed(2)}</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>Ksh{Number(orderDetails.tax).toFixed(2)}</span>
              </li>
              <li className="flex justify-between pt-4 border-t border-gray-200 font-bold">
                <span>Grand Total</span>
                <span>Ksh{Number(orderDetails.grand_total).toFixed(2)}</span>
              </li>
            </ul>
          </div>
          
          {/* Delivery & Contact Info */}
          <div>
            <h3 className="font-medium text-gray-900 flex items-center"><FiTruck className="mr-2" /> Delivery & Contact</h3>
            <div className="mt-3 space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Delivery Status</p>
                <p className="font-medium capitalize">{orderDetails.delivery_status}</p>
              </div>
              <div>
                <p className="text-gray-500">Estimated Delivery Date</p>
                <p className="font-medium">{orderDetails.estimated_delivery ? format(new Date(orderDetails.estimated_delivery), 'PPP') : 'Not yet specified'}</p>
              </div>
              <div>
                <p className="text-gray-500">Shipping Address</p>
                <p className="font-medium">
                  {orderDetails.address_line_1}, {orderDetails.city}, {orderDetails.county_state}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Contact Email</p>
                <p className="font-medium flex items-center">
                  <FiMail className="mr-1" />{orderDetails.email}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Contact Phone</p>
                <p className="font-medium flex items-center">
                  <FiPhone className="mr-1" />{orderDetails.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderActionButtons = () => {
    return (
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        {status === 'success' && (
          <>
            <Link 
              href="/products" 
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              Continue Shopping
            </Link>
            <Link 
              href="/account/orders" 
              className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-lg border border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              View Order History
            </Link>
          </>
        )}
        
        {status === 'processing' && (
          <Link 
            href="/account/orders" 
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            Check Order Status
          </Link>
        )}
        
        {status === 'error' && (
          <>
            <Link 
              href="/cart/checkout" 
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              Try Again
            </Link>
            <Link 
              href="/cart" 
              className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-lg border border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Review Cart
            </Link>
          </>
        )}
        
        <Link 
          href="/" 
          className="px-8 py-3 bg-gray-100 text-gray-800 font-bold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
        <div className="text-center">
          {renderStatusIcon()}
          
          <h1 className={`mt-6 text-3xl font-bold ${
            status === 'success' ? 'text-green-600' : 
            status === 'processing' ? 'text-yellow-600' : 
            status === 'error' ? 'text-red-600' : 'text-gray-900'
          }`}>
            {status === 'success' && 'Order Confirmed!'}
            {status === 'processing' && 'Payment Processing'}
            {status === 'error' && 'Payment Failed'}
            {status === 'loading' && 'Processing Payment...'}
          </h1>
          
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            {message}
          </p>
        </div>

        {orderDetails && renderOrderDetailsSection()}
        {renderActionButtons()}
      </div>

      <div className="mt-12 text-center text-gray-600">
        <p>Have questions about your order?</p>
        <p className="mt-2 font-medium">
          Contact us at <a href="mailto:support@ronohsdecor.com" className="text-indigo-600 hover:underline">support@ronohsdecor.com</a> or 
          call <a href="tel:+254712345678" className="text-indigo-600 hover:underline">+254 712 345 678</a>
        </p>
      </div>
    </div>
  );
}

// Wrapper to use Suspense
export default function PaymentStatusPage() {
    return (
        // The Suspense fallback helps manage loading states before useSearchParams is ready
        <Suspense fallback={
          <div className="max-w-4xl mx-auto py-12 px-4 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-6"></div>
            <p className="text-lg text-gray-600">Loading payment status...</p>
          </div>
        }>
            <StatusPageContent />
        </Suspense>
    )
}