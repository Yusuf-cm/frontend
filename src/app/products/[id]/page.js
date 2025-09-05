import Image from &apo:next/image&apo:;
import { notFound } from &apo:next/navigation&apo:;
import AddToCartButton from &apo:./components/AddToCartButton&apo:;
import WishlistButton from &apo:@/components/WishlistButton&apo:;
import ShareButtons from &apo:@/components/ShareButtons&apo:;
import { FiCheckCircle, FiShield, FiTruck } from &apo:react-icons/fi&apo:;

async function getProduct(id) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}/`, {
        cache: &apo:no-store&apo:
    });
        if (!res.ok && res.status === 404) {
            return null; // Handle product not found gracefully
        }
        if (!res.ok) {
            throw new Error(&apo:Failed to fetch product data&apo:);
        }
        return res.json();
    } catch (error) {
        console.error("Error fetching product:", error);
        return null; // Return null on any fetch error
    }
}

export async function generateMetadata({ params }) {
    const product = await getProduct(params.id);
    if (!product) {
        return {
            title: &apo:Product Not Found&apo:,
        };
    }
    return {
        title: `${product.name} | Ronohs Decor`,
        description: product.description.substring(0, 160),
    };
}

export default async function ProductDetailPage({ params }) {
    const { id } = params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }
    
    const price = parseFloat(product.price) || 0;
    const originalPrice = parseFloat(product.original_price) || 0;
    const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Image Gallery */}
                    <div>
                        <div className="aspect-square relative bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                            {product.images && product.images.length > 0 ? (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">No Image Available</div>
                            )}
                        </div>
                        {product.images?.length > 1 && (
                            <div className="mt-4 grid grid-cols-5 gap-4">
                                {product.images.slice(0, 5).map((img, index) => (
                                    <div key={index} className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden border-2 hover:border-indigo-500 cursor-pointer">
                                        <Image src={img} alt={`${product.name} thumbnail ${index + 1}`} fill className="object-cover" sizes="100px" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <p className="text-sm font-medium text-indigo-600">{product.category.name}</p>
                        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900 font-serif tracking-tight">{product.name}</h1>

                        <div className="mt-4 flex items-center">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`h-5 w-5 ${i < Math.round(product.rating || 0) ? &apo:text-yellow-400&apo: : &apo:text-gray-300&apo:}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                ))}
                            </div>
                            <p className="ml-2 text-sm text-gray-500">{product.review_count} reviews</p>
                        </div>

                        <div className="mt-6">
                            <h2 className="sr-only">Product information</h2>
                            <div className="flex items-baseline gap-x-4">
                                <p className="text-3xl font-bold text-gray-900">Ksh {price.toFixed(2)}</p>
                                {originalPrice > price && (
                                    <p className="text-xl text-gray-400 line-through">Ksh {originalPrice.toFixed(2)}</p>
                                )}
                            </div>
                            {discountPercent > 0 && (
                                <div className="mt-2">
                                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                        {discountPercent}% OFF
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 prose prose-indigo text-gray-700">
                           <p>{product.description || &apo:No description available.&apo:}</p>
                        </div>
                        
                        <div className="mt-8">
                            {product.stock > 0 ? (
                                <p className="flex items-center text-green-600 font-medium">
                                    <FiCheckCircle className="h-5 w-5 mr-2" />
                                    In Stock ({product.stock} available)
                                </p>
                            ) : (
                                <p className="text-red-600 font-medium">Out of Stock</p>
                            )}
                        </div>

                        <div className="mt-8 flex gap-4">
                            <div className="flex-grow">
                                <AddToCartButton product={product} />
                            </div>
                            <div className="flex-shrink-0">
                                <WishlistButton productId={product.id} />
                            </div>
                        </div>

                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <FiTruck className="h-6 w-6 mr-3 text-indigo-600"/>
                                <div>
                                    <span className="font-semibold">Nationwide Delivery</span>
                                    <p className="text-xs">Delivered to your doorstep.</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <FiShield className="h-6 w-6 mr-3 text-indigo-600"/>
                                <div>
                                    <span className="font-semibold">Secure Payments</span>
                                    <p className="text-xs">Card & M-Pesa accepted.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-gray-200">
                            <ShareButtons title={product.name} url={`/products/${product.id}`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}