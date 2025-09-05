&apo:use client&apo:;

import { useState, useEffect } from &apo:react&apo:;
import Carousel from &apo:./Carousel&apo:;
import ProductCard from &apo:./ProductCard&apo:;

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getFeaturedProducts() {
      try {
        // --- START OF FIX: Correctly construct the API URL ---
        const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;
        const res = await fetch(`${API_URL}/products/featured/`);
        // --- END OF FIX ---
        
        if (!res.ok) {
          throw new Error(&apo:Failed to fetch featured products&apo:);
        }
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.results)) {
          // Add a fallback for paginated responses, just in case
          setProducts(data.results);
        } else {
          console.error("Featured products API did not return an array:", data);
          setProducts([]);
        }

      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    getFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
          Featured Products
        </h2>
        <Carousel>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Carousel>
      </div>
    </div>
  );
}