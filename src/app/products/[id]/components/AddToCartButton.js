&apo:use client&apo:; 

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from &apo:framer-motion&apo:;
import { useState } from &apo:react&apo:;
import { FiShoppingCart, FiCheck } from &apo:react-icons/fi&apo:;
import { toast } from &apo:react-hot-toast&apo:;

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call/processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      addToCart({
        ...product,
        image: product.images?.[0] || &apo:/placeholder.jpg&apo:,
        quantity: 1
      });
      
      setIsAdded(true);
      toast.success(&apo:Added to cart!&apo:, {
        position: &apo:bottom-right&apo:,
        icon: &apo:🛒&apo:,
        style: {
          background: &apo:#4f46e5&apo:,
          color: &apo:#fff&apo:,
          borderRadius: &apo:8px&apo:
        }
      });
      
      // Reset after 2 seconds
      setTimeout(() => {
        setIsAdded(false);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      toast.error(&apo:Failed to add item&apo:);
      setIsLoading(false);
    }
  };

  return (
    <motion.button 
      whileHover={{ 
        scale: isOutOfStock ? 1 : 1.03,
        boxShadow: isOutOfStock ? &apo:none&apo: : &apo:0px 4px 12px rgba(79, 70, 229, 0.25)&apo:
      }}
      whileTap={{ scale: isOutOfStock ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={handleAddToCart}
      disabled={isOutOfStock || isLoading || isAdded}
      className={`mt-4 w-full py-3 px-6 rounded-lg font-bold transition-colors duration-300 flex items-center justify-center gap-2
        ${isOutOfStock 
          ? &apo:bg-gray-300 text-gray-500 cursor-not-allowed&apo: 
          : isAdded 
            ? &apo:bg-green-600 text-white&apo: 
            : &apo:bg-indigo-600 text-white hover:bg-indigo-700&apo:
        }`}
    >
      <AnimatePresence mode="wait">
        {isAdded ? (
          <motion.span
            key="added"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <FiCheck className="h-5 w-5" />
            Added!
          </motion.span>
        ) : isLoading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></div>
            Adding...
          </motion.span>
        ) : isOutOfStock ? (
          <motion.span
            key="out-of-stock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Out of Stock
          </motion.span>
        ) : (
          <motion.span
            key="add"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <FiShoppingCart className="h-5 w-5" />
            Add to Cart
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}