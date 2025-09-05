'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/auth/useAuth';
import { getAuthenticatedApi } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiHeart, FiX } from 'react-icons/fi';
import ProductCard from '@/components/ProductCard'; // We can reuse the product card

const WishlistPage = () => {
    const { user, authTokens, logoutUser, setAuthTokens } = useAuth();
    const router = useRouter();
    
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchWishlist = useCallback(async () => {
        if (!user || !authTokens) return;

        setLoading(true);
        setError('');
        try {
            const api = getAuthenticatedApi({ authTokens, setAuthTokens, logoutUser });
            const data = await api('/wishlist/');
            setWishlist(data);
        } catch (err) {
            console.error("Failed to fetch wishlist:", err);
            setError('Could not load your wishlist. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [user, authTokens, setAuthTokens, logoutUser]);

    useEffect(() => {
        if (!user) {
            router.push('/login?next=/account/wishlist');
            return;
        }
        fetchWishlist();
    }, [user, router, fetchWishlist]);

    const handleRemoveFromWishlist = async (productId) => {
        if (!authTokens) return;
        
        // Optimistically update the UI
        const originalProducts = wishlist.products;
        setWishlist(prev => ({
            ...prev,
            products: prev.products.filter(p => p.id !== productId)
        }));

        try {
            const api = getAuthenticatedApi({ authTokens, setAuthTokens, logoutUser });
            await api('/wishlist/toggle/', {
                method: 'POST',
                body: JSON.stringify({ product_id: productId }),
            });
            // The optimistic update is now confirmed
        } catch (err) {
            console.error('Failed to remove from wishlist:', err);
            setError('Could not update wishlist.');
            // Revert UI on failure
            setWishlist(prev => ({ ...prev, products: originalProducts }));
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 text-center">
                <div className="h-10 w-10 mx-auto border-t-2 border-indigo-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading your wishlist...</p>
            </div>
        );
    }
    
    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight font-serif">
                    My Wishlist
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
                    Your favorite items, all in one place.
                </p>
            </div>

            {wishlist && wishlist.products.length > 0 ? (
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >
                    {wishlist.products.map(product => (
                        <motion.div key={product.id} className="relative" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}>
                            <ProductCard product={product} />
                            <button
                                onClick={() => handleRemoveFromWishlist(product.id)}
                                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md text-red-500 hover:bg-red-50"
                                aria-label="Remove from wishlist"
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                        <FiHeart className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">Your wishlist is empty</h3>
                    <p className="mt-2 text-gray-500 max-w-md mx-auto">
                        Add items you love to your wishlist to save them for later.
                    </p>
                    <Link 
                        href="/products" 
                        className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Explore Products
                    </Link>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;