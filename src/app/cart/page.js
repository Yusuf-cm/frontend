&apo:use client&apo:;

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/auth/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiTrash2, FiArrowLeft, FiShoppingBag, FiLoader } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { getAuthenticatedApi } from "@/utils/api";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user, authTokens, setAuthTokens, logoutUser } = useAuth();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState({});
  const [isRemoving, setIsRemoving] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(&apo:&apo:);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  // --- CORRECTED: Flat rate shipping ---
  const subtotal = cartTotal;
  const shippingCost = 300; // Flat rate shipping
  const tax = subtotal * 0.16; // 16% VAT
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount_percent) / 100 : 0;
  const total = subtotal + tax + shippingCost - discount;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    
    if (user) {
      const checkoutUrl = appliedCoupon ? `/cart/checkout?coupon=${appliedCoupon.code}` : &apo:/cart/checkout&apo:;
      router.push(checkoutUrl);
    } else {
      router.push(&apo:/login?next=/cart&apo:);
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setIsUpdating(prev => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      updateQuantity(productId, newQuantity);
      setIsUpdating(prev => ({ ...prev, [productId]: false }));
    }, 300);
  };

  const handleRemove = (productId) => {
    setIsRemoving(true);
    setTimeout(() => {
      removeFromCart(productId);
      toast.success("Item removed from cart");
      setIsRemoving(false);
    }, 300);
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    if (!user) {
      toast.error("You must be logged in to apply a coupon.");
      router.push(&apo:/login?next=/cart&apo:);
      return;
    }
    setIsCheckingCoupon(true);
    setCouponError(&apo:&apo:);
    
    try {
      const api = getAuthenticatedApi({ authTokens, setAuthTokens, logoutUser });
      const response = await api(&apo:/coupons/validate/&apo:, {
        method: &apo:POST&apo:,
        body: JSON.stringify({ code: couponCode }),
      });
      setAppliedCoupon(response);
      toast.success(`Coupon "${response.code}" applied!`);
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err.message || "Invalid coupon code.");
      toast.error(err.message || "Invalid coupon code.");
    } finally {
      setIsCheckingCoupon(false);
    }
  };
  
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode(&apo:&apo:);
    setCouponError(&apo:&apo:);
    toast.success("Coupon removed.");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
            <FiArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl font-serif ml-8">Shopping Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center mt-12">
            <div className="mx-auto bg-gray-100 rounded-full p-4 w-24 h-24 flex items-center justify-center">
              <FiShoppingBag className="text-gray-400 text-4xl" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-600 max-w-md mx-auto">Start shopping to fill it with amazing products!</p>
            <Link href="/products" className="mt-6 inline-block bg-indigo-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors shadow-md">Browse Products</Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">{cartItems.length} {cartItems.length === 1 ? &apo:Item&apo: : &apo:Items&apo:} in Cart</h2>
                </div>
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((product) => (
                    <motion.li key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="p-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Link href={`/products/${product.id}`}>
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden">
                              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 100px, 120px" />
                            </div>
                          </Link>
                        </div>
                        <div className="ml-4 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900 font-serif">
                                  <Link href={`/products/${product.id}`} className="hover:text-indigo-600">{product.name}</Link>
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">{product.category.name}</p>
                              </div>
                              <p className="text-lg font-medium text-gray-900 ml-4">Ksh{(product.price * product.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex items-end justify-between">
                            <div className="flex items-center">
                              <button onClick={() => handleQuantityChange(product.id, product.quantity - 1)} disabled={isUpdating[product.id]} className="px-3 py-1.5 border border-gray-300 rounded-l-md text-gray-600 hover:bg-gray-100 disabled:opacity-50">-</button>
                              <div className="w-12 text-center border-t border-b border-gray-300 py-1.5">{isUpdating[product.id] ? <div className="h-4 w-4 mx-auto border-t-2 border-indigo-600 rounded-full animate-spin"></div> : product.quantity}</div>
                              <button onClick={() => handleQuantityChange(product.id, product.quantity + 1)} disabled={isUpdating[product.id]} className="px-3 py-1.5 border border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-100 disabled:opacity-50">+</button>
                            </div>
                            <button onClick={() => handleRemove(product.id)} disabled={isRemoving} className="flex items-center text-red-600 hover:text-red-800 disabled:opacity-50"><FiTrash2 className="mr-1" /><span>Remove</span></button>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
                <Link href="/products" className="px-6 py-3 border border-gray-300 rounded-lg text-center text-gray-700 hover:bg-gray-50">Continue Shopping</Link>
                <button onClick={clearCart} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Clear Cart</button>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6 font-serif">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="text-gray-900">Ksh{subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="text-gray-900">Ksh{shippingCost.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Tax (16% VAT)</span><span className="text-gray-900">Ksh{tax.toFixed(2)}</span></div>
                  {appliedCoupon && (<div className="flex justify-between text-green-600"><span>Discount ({appliedCoupon.code})</span><span>-Ksh{discount.toFixed(2)}</span></div>)}
                  <div className="pt-4 border-t border-gray-200 flex justify-between text-lg font-bold"><span className="text-gray-900">Total</span><span className="text-indigo-700">Ksh{total.toFixed(2)}</span></div>
                </div>
                <div className="mt-6">
                  {appliedCoupon ? (
                    <div className="p-3 bg-green-50 rounded-lg flex justify-between items-center"><p className="text-sm text-green-800">Coupon <span className="font-bold">{appliedCoupon.code}</span> applied!</p><button onClick={removeCoupon} className="text-sm font-medium text-red-600 hover:text-red-800">Remove</button></div>
                  ) : (
                    <>
                      <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">Apply Coupon</label>
                      <div className="flex gap-2">
                        <input type="text" id="coupon" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter coupon code" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                        <button onClick={applyCoupon} disabled={isCheckingCoupon} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50">{isCheckingCoupon ? <FiLoader className="animate-spin" /> : &apo:Apply&apo:}</button>
                      </div>
                      {couponError && <p className="mt-2 text-sm text-red-600">{couponError}</p>}
                    </>
                  )}
                </div>
                <div className="mt-8">
                  <button onClick={handleCheckout} className="w-full bg-indigo-600 border border-transparent rounded-lg shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700">
                    {user ? &apo:Proceed to Checkout&apo: : &apo:Login to Checkout&apo:}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}