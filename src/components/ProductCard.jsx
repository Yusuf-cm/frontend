'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
// --- CORRECTED: Use relative paths for sibling components ---
import AddToCartButton from '@/app/products/[id]/components/AddToCartButton';
import WishlistButton from './WishlistButton';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  
  if (!product || typeof product.price === 'undefined') {
    return null; // Return nothing if product data is invalid
  }
  
  const price = parseFloat(product.price);
  const originalPrice = parseFloat(product.original_price) || 0;
  const isNew = new Date() - new Date(product.created_at) < 30 * 24 * 60 * 60 * 1000;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-lg flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          {product.images?.[0] ? (
            <Image 
              src={product.images[0]} 
              alt={product.name || 'Product Image'} 
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="bg-gray-200 w-full h-full flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {isNew && (
              <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">New</span>
            )}
            {product.stock === 0 && (
              <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">Out of Stock</span>
            )}
          </div>
          
          <div className={`absolute top-3 left-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <WishlistButton productId={product.id} />
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{product.category?.name || 'Uncategorized'}</p>
        </div>
      </Link>
      
      <div className="mt-auto p-4 pt-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col items-start">
            <span className="font-bold text-gray-900">Ksh{price.toFixed(2)}</span>
            {originalPrice > price && (
              <span className="text-xs text-gray-500 line-through">Ksh{originalPrice.toFixed(2)}</span>
            )}
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`h-4 w-4 ${i < Math.round(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.review_count || 0})</span>
          </div>
        </div>
        
        <AddToCartButton product={product} />
      </div>
    </motion.div>
  );
}