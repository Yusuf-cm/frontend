import ProductCard from "@/components/ProductCard";
import PaginationControls from "@/components/PaginationControls";
import ProductFilters from "@/components/ProductFilters";
import SearchBar from "@/components/SearchBar";
import { fetchCategories, fetchProductAttributes } from &apo:@/lib/data&apo:;
import { Suspense } from &apo:react&apo:;
import { getApi } from &apo:@/utils/api&apo:;

// Helper function to convert searchParams to a plain object
function parseSearchParams(searchParams) {
  const params = {};
  for (const [key, value] of Object.entries(searchParams)) {
    params[key] = value;
  }
  return params;
}

async function getProducts({ searchQuery = &apo:&apo:, page = &apo:1&apo:, category = &apo:&apo:, sort = &apo:&apo:, filters = {} }) {
  const params = new URLSearchParams();
  if (searchQuery) params.append(&apo:search&apo:, searchQuery);
  if (page) params.append(&apo:page&apo:, page);
  if (category) params.append(&apo:category&apo:, category);
  if (sort) params.append(&apo:ordering&apo:, sort);
  
  Object.entries(filters).forEach(([key, values]) => {
    // Correctly handle attribute filters which are arrays
    if (Array.isArray(values)) {
      values.forEach(value => params.append(`filter_${key}`, value));
    } else {
      // Handle single value filters if they exist
      params.append(`filter_${key}`, values);
    }
  });

  try {
    const path = `/products/?${params.toString()}`;
    // --- START OF FIX ---
    // Directly await the getApi function. No need to call it twice.
    const data = await getApi(path, { cache: &apo:no-store&apo: });
    // --- END OF FIX ---
    return data;
  } catch (error) {
    console.error(`Failed to fetch products: ${error.message}`);
    throw new Error(&apo:Failed to fetch products&apo:);
  }
}

export default async function ProductsPage({ searchParams }) {
  // Convert searchParams to a plain object first
  const params = parseSearchParams(searchParams);
  
  const searchQuery = params.search || &apo:&apo:;
  const page = params.page || 1;
  const category = params.category || &apo:&apo:;
  const sort = params.ordering || &apo:&apo:; // Corrected to use &apo:ordering&apo: to match URL param
  
  const filters = {};
  Object.entries(params).forEach(([key, value]) => {
    if (key.startsWith(&apo:filter_&apo:)) {
      const filterKey = key.replace(&apo:filter_&apo:, &apo:&apo:);
      filters[filterKey] = Array.isArray(value) ? value : [value];
    }
  });

  // Using Promise.all to fetch data concurrently for faster page loads
  const [data, categories, attributes] = await Promise.all([
    getProducts({ searchQuery, page, category, sort, filters }),
    fetchCategories(),
    fetchProductAttributes()
  ]);
  
  const products = data.results || [];
  const totalProducts = data.count || 0;
  const totalPages = Math.ceil(totalProducts / 12); 

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        {searchQuery ? (
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
            Search results for: <span className="text-indigo-600">"{searchQuery}"</span>
          </h1>
        ) : (
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Our Collection
          </h1>
        )}
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover handcrafted furniture and decor that transforms your space
        </p>
      </div>

      <div className="mb-10">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/4">
            <Suspense fallback={<div className="h-14 bg-gray-100 rounded-lg animate-pulse"></div>}>
              <SearchBar 
                initialValue={searchQuery} 
                placeholder="Search products..." 
              />
            </Suspense>
          </div>
          
          <div className="w-full md:w-1/4">
            <Suspense fallback={<div className="h-14 bg-gray-100 rounded-lg animate-pulse"></div>}>
              <ProductFilters 
                categories={categories} 
                attributes={attributes}
                selectedCategory={category}
                selectedSort={sort}
                appliedFilters={filters}
              />
            </Suspense>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Showing {products.length} of {totalProducts} products
          </p>
          
          {totalProducts > 0 && (
            <div className="text-sm text-gray-500">
              Sorted by: <span className="font-medium">
                {sort === &apo:price&apo: ? &apo:Price: Low to High&apo: : 
                 sort === &apo:-price&apo: ? &apo:Price: High to Low&apo: : 
                 sort === &apo:created_at&apo: ? &apo:Newest&apo: : 
                 &apo:Featured&apo:}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block lg:w-1/4">
          <div className="sticky top-24">
            <Suspense fallback={<div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>}>
              <ProductFilters 
                categories={categories} 
                attributes={attributes}
                selectedCategory={category}
                selectedSort={sort}
                appliedFilters={filters}
                isSidebar={true}
              />
            </Suspense>
          </div>
        </div>
        
        <div className="w-full lg:w-3/4">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto bg-gray-100 rounded-full p-4 w-24 h-24 flex items-center justify-center mb-6">
                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900">No products found</h3>
              <p className="mt-2 text-gray-600 max-w-md mx-auto">
                {searchQuery 
                  ? "We couldn&apo:t find any products matching your search. Try adjusting your filters." 
                  : "Check back soon for new additions to our collection."}
              </p>
              <div className="mt-6">
                <a 
                  href="/products" 
                  className="inline-block bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {searchQuery ? "Clear Search & Filters" : "Browse All Products"}
                </a>
              </div>
            </div>
          )}
          
          {products.length > 0 && (
            <div className="mt-12">
              <PaginationControls
                hasNextPage={data.next !== null}
                hasPrevPage={data.previous !== null}
                totalPages={totalPages}
                path="/products"
                searchQuery={searchQuery}
                category={category}
                sort={sort}
                filters={filters}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}