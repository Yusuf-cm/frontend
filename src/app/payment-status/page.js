// src/app/payment-status/page.js
&apo:use client&apo:;

import React, { useEffect, useState, Suspense } from &apo:react&apo:;
import Link from &apo:next/link&apo:;
import { useSearchParams } from &apo:next/navigation&apo:;
import { useCart } from &apo:@/context/CartContext&apo:;
import { useAuth } from &apo:@/auth/useAuth&apo:;
import { getAuthenticatedApi } from &apo:@/utils/api&apo:;
import { FiCheckCircle, FiClock, FiXCircle, FiShoppingBag, FiTruck, FiMail, FiPhone } from &apo:react-icons/fi&apo:;
import Image from &apo:next/image&apo:;
import { format } from &apo:date-fns&apo:;

function StatusPageContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const { authTokens, setAuthTokens, logoutUser, loading: authLoading } = useAuth();

  const [status, setStatus] = useState(&apo:loading&apo:); // &apo:loading&apo:, &apo:success&apo:, &apo:processing&apo:, &apo:error&apo:
  const [message, setMessage] = useState(&apo:&apo:);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isProcessed, setIsProcessed] = useState(false); // To prevent re-processing on re-renders

  useEffect(() => {
    // Only proceed if authTokens are loaded and it hasn&apo:t been processed yet
    if (authLoading || isProcessed || !authTokens) {
        // If authLoading is true, wait. If no authTokens after loading, something is wrong.
        if (!authLoading && !authTokens) {
            setStatus(&apo:error&apo:);
            setMessage(&apo:You must be logged in to view order details. Please log in.&apo:);
        }
        return;
    }

    const orderId = searchParams.get(&apo:order_id&apo:);
    const paymentStatus = searchParams.get(&apo:redirect_status&apo:); // &apo:succeeded&apo:, &apo:processing&apo:, &apo:requires_payment_method&apo:, etc.

    if (!orderId) {
      setStatus(&apo:error&apo:);
      setMessage(&apo:No order information found in the URL. This page might have been accessed incorrectly.&apo:);
      setIsProcessed(true); // Mark as processed even if error, to prevent infinite loops
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const api = getAuthenticatedApi({ authTokens, setAuthTokens, logoutUser });
        const data = await api(`/orders/${orderId}/`); // Fetch real order data
        setOrderDetails(data);
        
        // Determine final status based on Stripe redirect_status and fetched order data
        if (paymentStatus === &apo:succeeded&apo: && data.paid) {
          setStatus(&apo:success&apo:);
          setMessage(&apo:Your payment was successful and your order is confirmed!&apo:);
          clearCart(); // Clear cart only after successful confirmation and data fetch
        } else if (paymentStatus === &apo:processing&apo: && !data.paid) {
          setStatus(&apo:processing&apo:);
          setMessage(&apo:Your payment is processing. We will notify you when it is confirmed.&apo:);
        } else if (paymentStatus === &apo:requires_payment_method&apo: || paymentStatus === &apo:requires_action&apo:) {
            setStatus(&apo:error&apo:);
            setMessage(&apo:Your payment could not be completed. Please try again or contact support.&apo:);
        }
        else {
          // Fallback for any other status or mismatch between Stripe status and DB status
          setStatus(&apo:error&apo:);
          setMessage(&apo:There was an issue with your payment. Please try again or contact support.&apo:);
          console.warn(&apo:Payment status mismatch or unhandled case:&apo:, {paymentStatus, orderPaid: data.paid});
        }
      } catch (err) {
        setStatus(&apo:error&apo:);
        setMessage(&apo:Could not retrieve your order details. Please check your account order history or contact support.&apo:);
        console.error("Fetch order error:", err);
      } finally {
        setIsProcessed(true); // Mark as processed once the API call is done
      }
    };

    fetchOrderDetails();
  }, [searchParams, clearCart, isProcessed, authTokens, setAuthTokens, logoutUser, authLoading]); // Add authLoading to dependencies

  const renderStatusIcon = () => {
    switch (status) {
      case &apo:success&apo::
        return <FiCheckCircle className="h-16 w-16 text-green-500 mx-auto animate-bounce" />;
      case &apo:processing&apo::
        return <FiClock className="h-16 w-16 text-yellow-500 mx-auto animate-pulse" />;
      case &apo:error&apo::
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
                  <span>Discount ({orderDetails.coupon_code || &apo:Applied&apo:})</span>
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
                <p className="font-medium">{orderDetails.estimated_delivery ? format(new Date(orderDetails.estimated_delivery), &apo:PPP&apo:) : &apo:Not yet specified&apo:}</p>
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
        {status === &apo:success&apo: && (
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
        
        {status === &apo:processing&apo: && (
          <Link 
            href="/account/orders" 
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            Check Order Status
          </Link>
        )}
        
        {status === &apo:error&apo: && (
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
            status === &apo:success&apo: ? &apo:text-green-600&apo: : 
            status === &apo:processing&apo: ? &apo:text-yellow-600&apo: : 
            status === &apo:error&apo: ? &apo:text-red-600&apo: : &apo:text-gray-900&apo:
          }`}>
            {status === &apo:success&apo: && &apo:Order Confirmed!&apo:}
            {status === &apo:processing&apo: && &apo:Payment Processing&apo:}
            {status === &apo:error&apo: && &apo:Payment Failed&apo:}
            {status === &apo:loading&apo: && &apo:Processing Payment...&apo:}
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