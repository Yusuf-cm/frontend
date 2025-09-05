'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/auth/useAuth';
import { getAuthenticatedApi } from '@/utils/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import { useDebounce } from 'use-debounce';

// Enhanced Product Row Component
const ProductRow = ({ product, onDelete, index }) => (
  <motion.tr 
    className="hover:bg-gray-50 border-b border-gray-100"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <td className="px-4 py-3 sm:px-6">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md overflow-hidden">
          <img 
            className="h-full w-full object-cover" 
            src={product.images?.[0] || '/placeholder-image.png'} 
            alt={product.name} 
            onError={(e) => e.target.src = '/placeholder-image.png'}
          />
        </div>
        <div className="ml-4">
          <div className="font-medium text-gray-900">{product.name}</div>
          <div className="text-sm text-gray-500 mt-1">SKU: {product.sku || 'N/A'}</div>
        </div>
      </div>
    </td>
    <td className="px-4 py-3 sm:px-6 text-sm text-gray-500 hidden md:table-cell">
      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
        {product.category?.name || 'Uncategorized'}
      </span>
    </td>
    <td className="px-4 py-3 sm:px-6 text-sm text-gray-900">
      Ksh {parseFloat(product.price).toLocaleString()}
    </td>
    <td className="px-4 py-3 sm:px-6 text-sm text-gray-500 hidden lg:table-cell">
      Ksh {parseFloat(product.buying_price || 0).toLocaleString()}
    </td>
    <td className="px-4 py-3 sm:px-6">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        product.stock > 10 
          ? 'bg-green-100 text-green-800' 
          : product.stock > 3 
            ? 'bg-amber-100 text-amber-800' 
            : 'bg-red-100 text-red-800'
      }`}>
        {product.stock} in stock
      </span>
    </td>
    <td className="px-4 py-3 sm:px-6 text-right text-sm font-medium">
      <div className="flex justify-end space-x-3">
        <Link 
          href={`${process.env.NEXT_PUBLIC_DJANGO_ADMIN_URL || 'http://127.0.0.1:8000/admin'}/api/product/${product.id}/change/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-900 flex items-center"
          title="Edit product"
        >
          <FiEdit className="mr-1" /> 
          <span className="hidden sm:inline">Edit</span>
        </Link>
        <button 
          onClick={() => onDelete(product.id, product.name)} 
          className="text-red-600 hover:text-red-900 flex items-center"
          title="Delete product"
        >
          <FiTrash2 className="mr-1" />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </td>
  </motion.tr>
);

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, productName }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div 
          className="bg-white rounded-xl shadow-lg max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <FiTrash2 className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Product</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete <span className="font-medium">"{productName}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onClose}
                className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-white p-4 rounded-lg border border-gray-100 animate-pulse">
        <div className="flex items-center">
          <div className="bg-gray-200 rounded-md w-16 h-16"></div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="space-x-3 flex">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function AdminProductsPage() {
  const { authTokens, setAuthTokens, logoutUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    productName: ''
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [categories, setCategories] = useState([]);

  const fetchProducts = useCallback(async () => {
    if (!authTokens) return;
    setLoading(true);
    setError('');
    
    const params = new URLSearchParams();
    if (debouncedSearch) params.append('search', debouncedSearch);
    if (selectedCategory !== 'all') params.append('category', selectedCategory);
    if (stockFilter !== 'all') params.append('stock', stockFilter);

    try {
      const api = getAuthenticatedApi({ authTokens, setAuthTokens, logoutUser });
      const productsData = await api(`/admin/products/all/?${params.toString()}`);
      setProducts(productsData);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [authTokens, setAuthTokens, logoutUser, debouncedSearch, selectedCategory, stockFilter]);

  const fetchCategories = useCallback(async () => {
    if (!authTokens) return;
    try {
        const api = getAuthenticatedApi({ authTokens, setAuthTokens, logoutUser });
        const categoriesData = await api('/categories/'); // Assuming public endpoint doesn't need auth, but good practice
        setCategories(categoriesData);
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    }
  }, [authTokens, setAuthTokens, logoutUser]);


  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);


  const handleDelete = async () => {
    if (!deleteModal.productId) return;
    
    try {
      const api = getAuthenticatedApi({ authTokens, setAuthTokens, logoutUser });
      await api(`/admin/products/${deleteModal.productId}/delete/`, { method: 'DELETE' });
      
      setProducts(prev => prev.filter(p => p.id !== deleteModal.productId));
      
      setDeleteModal({ isOpen: false, productId: null, productName: '' });
    } catch (err) {
      setError('Failed to delete product. It might be part of an existing order.');
      console.error(err);
      setDeleteModal({ isOpen: false, productId: null, productName: '' });
    }
  };

  const openDeleteModal = (productId, productName) => {
    setDeleteModal({
      isOpen: true,
      productId,
      productName
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-16"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">
            {products.length} products found
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Link 
            href={`${process.env.NEXT_PUBLIC_DJANGO_ADMIN_URL || 'http://127.0.0.1:8000/admin'}/api/product/add/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products by name, SKU or description..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="all">All Stock</option>
              <option value="low">Low Stock (≤ 5)</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {products.length > 0 ? (
              products.map((product, index) => (
                <motion.div 
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          className="h-full w-full object-cover" 
                          src={product.images?.[0] || '/placeholder-image.png'} 
                          alt={product.name} 
                          onError={(e) => e.target.src = '/placeholder-image.png'}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 mt-1">SKU: {product.sku || 'N/A'}</div>
                        <div className="flex items-center mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.stock > 10 
                              ? 'bg-green-100 text-green-800' 
                              : product.stock > 3 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stock} in stock
                          </span>
                          <span className="ml-3 text-sm text-gray-900">
                            Ksh {parseFloat(product.price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex justify-end space-x-3">
                    <Link 
                      href={`${process.env.NEXT_PUBLIC_DJANGO_ADMIN_URL || 'http://127.0.0.1:8000/admin'}/api/product/${product.id}/change/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900 flex items-center text-sm"
                    >
                      <FiEdit className="mr-1" /> Edit
                    </Link>
                    <button 
                      onClick={() => openDeleteModal(product.id, product.name)} 
                      className="text-red-600 hover:text-red-900 flex items-center text-sm"
                    >
                      <FiTrash2 className="mr-1" /> Delete
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiSearch className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Product</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6 hidden md:table-cell">Category</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Price</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6 hidden lg:table-cell">Cost</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Stock</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {products.length > 0 ? (
                    products.map((product, index) => (
                      <ProductRow 
                        key={product.id} 
                        product={product} 
                        onDelete={openDeleteModal} 
                        index={index}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FiSearch className="h-8 w-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                          <p className="text-gray-500 max-w-md">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <DeleteModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productId: null, productName: '' })}
        onConfirm={handleDelete}
        productName={deleteModal.productName}
      />
    </motion.div>
  );
}