'use client';

import { useAuth } from "@/auth/useAuth";
import { getAuthenticatedApi } from "@/utils/api";
import { FiHeart } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';

export default function WishlistButton({ productId, className }) {
    const { user, authTokens, setAuthTokens, logoutUser, setUser } = useAuth();
    const router = useRouter();

    const isInWishlist = user?.wishlist?.includes(productId);

    const handleWishlistToggle = async (e) => {
        e.preventDefault(); // Prevent link navigation if the button is inside a link
        e.stopPropagation();

        if (!user) {
            toast.error("Please log in to use the wishlist.");
            router.push('/login?next=' + window.location.pathname);
            return;
        }

        const api = getAuthenticatedApi({ authTokens, setAuthTokens, logoutUser });

        try {
            const response = await api('/wishlist/toggle/', {
                method: 'POST',
                body: JSON.stringify({ product_id: productId }),
            });
            
            // Update user context with the new wishlist from the backend
            setUser(prevUser => ({
                ...prevUser,
                wishlist: response.wishlist
            }));
            
            toast.success(response.action === 'added' ? 'Added to wishlist!' : 'Removed from wishlist');
        } catch (error) {
            toast.error("Could not update your wishlist.");
            console.error(error);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlistToggle}
            className={`flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md transition-colors ${className}`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <FiHeart 
                className={`h-5 w-5 transition-all ${
                    isInWishlist 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-600 hover:text-red-500'
                }`} 
            />
        </motion.button>
    );
}