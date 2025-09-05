// src/components/OrderSummary.js
&apo:use client&apo:;

import Image from &apo:next/image&apo:;
import { motion, AnimatePresence } from &apo:framer-motion&apo:;

export default function OrderSummary({ cartItems, subtotal, tax, shipping, total }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6 font-serif">Order Summary</h2>
      
      <div className="space-y-4 max-h-64 overflow-y-auto pr-2 mb-6">
        <AnimatePresence>
          {cartItems.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center"
            >
              <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="ml-4 flex-1">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium text-gray-900">
                Ksh{(item.price * item.quantity).toFixed(2)}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="space-y-3 pt-6 border-t">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">Ksh{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">
            {shipping === 0 ? <span className="text-green-600">Free</span> : `Ksh${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (16% VAT)</span>
          <span className="text-gray-900">Ksh{tax.toFixed(2)}</span>
        </div>
        <div className="pt-4 border-t border-dashed flex justify-between text-lg font-bold">
          <span className="text-gray-900">Total</span>
          <span className="text-indigo-700">Ksh{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}