'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/auth/useAuth';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiShoppingBag, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { kenyanCounties } from '@/utils/KenyanCounties';
import OrderSummary from '@/components/OrderSummary';
import { getAuthenticatedApi } from '@/utils/api';
import { useSearchParams, useRouter } from 'next/navigation';

// Load Stripe outside component
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState(null);
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const { user, authTokens, setAuthTokens, logoutUser } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [isValidating, setIsValidating] = useState(true);
  const [validationErrors, setValidationErrors] = useState([]);
  const [step, setStep] = useState(1); // 1: Contact, 2: Shipping, 3: Payment
  const [paymentComplete, setPaymentComplete] = useState(false);

  const searchParams = useSearchParams();
  const couponCode = searchParams.get('coupon');

  // Customer details state
  const [customerDetails, setCustomerDetails] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    county: ''
  });

  // Calculate totals (for display only)
  const tax = cartTotal * 0.16;
  const shippingCost = 300;
  const orderTotal = cartTotal + tax + shippingCost;

  useEffect(() => {
    if (user) {
        setCustomerDetails(prev => ({
            ...prev,
            firstName: user.first_name || '',
            lastName: user.last_name || '',
            email: user.email || '',
        }));
    }
  }, [user]);

  useEffect(() => {
    if (cartItems.length === 0 && !isValidating && !paymentComplete) {
      toast.error('Your cart is empty!');
      router.push('/products');
    }
  }, [cartItems, isValidating, paymentComplete, router]);


  useEffect(() => {
    if (!authTokens) {
        if (!user && !isValidating) { // Prevent redirection while auth is still loading
             router.push('/login?next=/cart/checkout');
        }
        setIsValidating(false);
        return;
    }

    const validateCart = async () => {
      if (cartItems.length === 0) {
        setIsValidating(false);
        return;
      }

      const productIds = cartItems.map(item => item.id);
      try {
        const api = getAuthenticatedApi({ authTokens, setAuthTokens, logoutUser });
        const liveProducts = await api('/products/validate-cart/', {
          method: 'POST',
          body: JSON.stringify({ product_ids: productIds }),
        });

        const errors = [];
        cartItems.forEach(cartItem => {
          const liveProduct = liveProducts.find(p => p.id === cartItem.id);
          if (!liveProduct) {
            errors.push(`"${cartItem.name}" is no longer available and was removed.`);
            removeFromCart(cartItem.id);
          } else if (liveProduct.stock < cartItem.quantity) {
            errors.push(`"${cartItem.name}" quantity updated to ${liveProduct.stock} due to limited stock.`);
            updateQuantity(cartItem.id, liveProduct.stock);
          }
        });

        if (errors.length > 0) {
          setValidationErrors(errors);
          toast.error('Your cart was updated due to stock changes');
        }
      } catch (error) {
        console.error("Cart validation failed:", error);
        setFormError("Could not verify your cart. Please try again later.");
      } finally {
        setIsValidating(false);
      }
    };

    validateCart();
  }, [cartItems, authTokens, setAuthTokens, logoutUser, removeFromCart, updateQuantity, user, isValidating]);


  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!customerDetails.firstName.trim()) { newErrors.firstName = 'First name is required'; isValid = false; }
    if (!customerDetails.lastName.trim()) { newErrors.lastName = 'Last name is required'; isValid = false; }
    if (!/^\S+@\S+\.\S+$/.test(customerDetails.email)) { newErrors.email = 'Email is invalid'; isValid = false; }
    if (!/^[0-9]{10,15}$/.test(customerDetails.phone)) { newErrors.phone = 'Phone number is invalid'; isValid = false; }

    if (step >= 2) {
      if (!customerDetails.address_line_1.trim()) { newErrors.address_line_1 = 'Address is required'; isValid = false; }
      if (!customerDetails.city.trim()) { newErrors.city = 'City is required'; isValid = false; }
      if (!customerDetails.county) { newErrors.county = 'County is required'; isValid = false; }
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handlePaymentIntent = async () => {
    setIsSubmitting(true);
    setFormError('');

    if (cartItems.length === 0) {
      setFormError("Your cart is empty.");
      setIsSubmitting(false);
      return false; // Indicate failure
    }
    
    const itemsForBackend = cartItems.map(item => ({ id: item.id, quantity: item.quantity }));
    
    try {
      const api = getAuthenticatedApi({ authTokens, setAuthTokens, logoutUser });
      const res = await api('/create-payment-intent/', {
        method: 'POST',
        body: JSON.stringify({
          items: itemsForBackend,
          customer_details: customerDetails,
          coupon_code: couponCode
        }),
      });
      setClientSecret(res.clientSecret);
      setOrderId(res.orderId);
      setIsSubmitting(false);
      return true; // Indicate success
    } catch (err) {
      setFormError(err.message);
      toast.error(err.message);
      setIsSubmitting(false);
      return false; // Indicate failure
    }
  };

  const handleProceed = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    if (step < 2) {
      setStep(step + 1);
    } else if (step === 2) {
      const success = await handlePaymentIntent();
      if (success) {
        setStep(3);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input type="text" id="firstName" name="firstName" value={customerDetails.firstName} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'}`} />
                {formErrors.firstName && <p className="mt-1 text-sm text-red-600 flex items-center"><FiAlertCircle className="mr-1" /> {formErrors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input type="text" id="lastName" name="lastName" value={customerDetails.lastName} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'}`} />
                {formErrors.lastName && <p className="mt-1 text-sm text-red-600 flex items-center"><FiAlertCircle className="mr-1" /> {formErrors.lastName}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input type="email" id="email" name="email" value={customerDetails.email} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`} />
                {formErrors.email && <p className="mt-1 text-sm text-red-600 flex items-center"><FiAlertCircle className="mr-1" /> {formErrors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input type="tel" id="phone" name="phone" value={customerDetails.phone} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g. 0712345678" />
                {formErrors.phone && <p className="mt-1 text-sm text-red-600 flex items-center"><FiAlertCircle className="mr-1" /> {formErrors.phone}</p>}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
            <div>
              <label htmlFor="address_line_1" className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
              <input type="text" id="address_line_1" name="address_line_1" value={customerDetails.address_line_1} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg ${formErrors.address_line_1 ? 'border-red-500' : 'border-gray-300'}`} placeholder="House number and street name" />
              {formErrors.address_line_1 && <p className="mt-1 text-sm text-red-600 flex items-center"><FiAlertCircle className="mr-1" /> {formErrors.address_line_1}</p>}
            </div>
            <div>
              <label htmlFor="address_line_2" className="block text-sm font-medium text-gray-700 mb-1">Apartment, suite, etc. (Optional)</label>
              <input type="text" id="address_line_2" name="address_line_2" value={customerDetails.address_line_2} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Apartment, suite, unit, building, floor, etc." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input type="text" id="city" name="city" value={customerDetails.city} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg ${formErrors.city ? 'border-red-500' : 'border-gray-300'}`} />
                {formErrors.city && <p className="mt-1 text-sm text-red-600 flex items-center"><FiAlertCircle className="mr-1" /> {formErrors.city}</p>}
              </div>
              <div>
                <label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-1">County *</label>
                <select id="county" name="county" value={customerDetails.county} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg ${formErrors.county ? 'border-red-500' : 'border-gray-300'}`}>
                  <option value="">Select County</option>
                  {kenyanCounties.map(county => <option key={county} value={county}>{county}</option>)}
                </select>
                {formErrors.county && <p className="mt-1 text-sm text-red-600 flex items-center"><FiAlertCircle className="mr-1" /> {formErrors.county}</p>}
              </div>
            </div>
          </div>
        );
      case 3:
        return clientSecret && orderId ? (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
            <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
              <CheckoutForm orderId={orderId} />
            </Elements>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="h-12 w-12 mx-auto border-t-4 border-indigo-600 rounded-full animate-spin mb-4"></div>
            <p>Preparing payment gateway...</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (isValidating) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="h-12 w-12 mx-auto border-t-4 border-indigo-600 rounded-full animate-spin mb-4"></div>
        <h1 className="text-xl font-semibold">Verifying your cart...</h1>
      </div>
    );
  }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-6">
                <Link href="/cart" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
                    <FiArrowLeft className="mr-2" />Back to Cart
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 ml-8">Checkout</h1>
            </div>

            {validationErrors.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0"><FiAlertCircle className="h-5 w-5 text-yellow-400" /></div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">Cart Updated</h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <ul className="list-disc pl-5 space-y-1">{validationErrors.map((error, index) => <li key={index}>{error}</li>)}</ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <div className="flex justify-between mb-8 relative">
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
                            {[1, 2, 3].map((stepNum, index) => (
                                <div key={stepNum} className="flex flex-col items-center relative">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === stepNum ? 'bg-indigo-600 text-white border-2 border-indigo-600' : step > stepNum ? 'bg-green-500 text-white border-2 border-green-500' : 'bg-white text-gray-500 border-2 border-gray-300'}`}>
                                        {step > stepNum ? <FiCheck className="w-5 h-5" /> : stepNum}
                                    </div>
                                    <span className={`mt-2 text-sm font-medium ${step === stepNum ? 'text-indigo-600' : 'text-gray-500'}`}>
                                        {['Contact', 'Shipping', 'Payment'][index]}
                                    </span>
                                </div>
                            ))}
                        </div>
                        
                        {step < 3 ? (
                            <form onSubmit={handleProceed} noValidate>
                                {renderStepContent()}
                                <div className="mt-8 flex justify-between">
                                    {step > 1 && (
                                        <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">Back</button>
                                    )}
                                    <button type="submit" disabled={isSubmitting} className={`ml-auto px-6 py-3 font-medium rounded-lg shadow-md transition-colors ${isSubmitting ? 'bg-gray-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'} disabled:cursor-not-allowed`}>
                                        {isSubmitting ? 'Processing...' : (step === 1 ? 'Continue to Shipping' : 'Continue to Payment')}
                                    </button>
                                </div>
                                {formError && <p className="mt-4 text-red-600 text-center"><FiAlertCircle className="inline mr-2" /> {formError}</p>}
                            </form>
                        ) : (
                            renderStepContent()
                        )}
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <OrderSummary cartItems={cartItems} subtotal={cartTotal} tax={tax} shipping={shippingCost} total={orderTotal} />
                </div>
            </div>
        </div>
    );
}