&apo:use client&apo:;

import { useState, useEffect, useMemo, useCallback } from &apo:react&apo:;
import Link from &apo:next/link&apo:;
import Image from &apo:next/image&apo:;
import { format } from &apo:date-fns&apo:;
import { motion, AnimatePresence } from &apo:framer-motion&apo:;

// API base URL from environment variables
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;

// --- PostCard Component ---
const PostCard = ({ post, variant = &apo:regular&apo: }) => {
  const isFeatured = variant === &apo:featured&apo:;
  
  return (
    <article className={`bg-white ${isFeatured ? &apo:rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100&apo: : &apo:rounded-xl shadow-md hover:shadow-xl transition-all duration-300&apo:}`}>
      {post.featured_image && (
        <Link href={`/blog/${post.slug}`} className={`block overflow-hidden ${isFeatured ? &apo:&apo: : &apo:mb-4&apo:}`}>
          <div className={`relative ${isFeatured ? &apo:aspect-w-16 aspect-h-9 rounded-xl&apo: : &apo:aspect-video&apo:} overflow-hidden`}>
            <Image 
              src={post.featured_image} 
              alt={post.title} 
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 100vw, 33vw"}
              priority={isFeatured}
            />
          </div>
        </Link>
      )}
      
      <div className={isFeatured ? &apo:flex-1&apo: : &apo:p-6&apo:}>
        {post.category && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-3">
            {post.category.name}
          </span>
        )}
        
        <Link href={`/blog/${post.slug}`}>
          <h3 className={`font-bold text-gray-900 hover:text-indigo-600 transition-colors font-serif ${
            isFeatured ? &apo:text-2xl md:text-3xl mb-3&apo: : &apo:text-lg mb-2&apo:
          }`}>
            {post.title}
          </h3>
        </Link>
        
        <p className={`text-gray-600 ${isFeatured ? &apo:mb-4&apo: : &apo:mb-4 text-sm&apo:} line-clamp-3`}>
          {post.excerpt}
        </p>
        
        <time className="text-sm text-gray-500">
          {format(new Date(post.published_date), &apo:MMMM d, yyyy&apo:)}
        </time>
      </div>
    </article>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function BlogPage() {
  const [featuredPost, setFeaturedPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(&apo:&apo:);
  const [searchQuery, setSearchQuery] = useState(&apo:&apo:);
  const [activeCategory, setActiveCategory] = useState(null);

  const fetchBlogData = useCallback(async () => {
    setLoading(true);
    setError(&apo:&apo:);
    try {
      const res = await fetch(`${API_URL}/blog/`);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();
      setFeaturedPost(data.featured_post);
      setAllPosts(data.posts);
      setCategories(data.categories);
    } catch (e) {
      setError(e.message);
      console.error("Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogData();
  }, [fetchBlogData]);

  const filteredPosts = useMemo(() => {
    if (!allPosts.length) return [];
    return allPosts.filter(post => {
      const matchesCategory = !activeCategory || post.category?.slug === activeCategory;
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [allPosts, activeCategory, searchQuery]);

  const clearFilters = () => {
    setSearchQuery(&apo:&apo:);
    setActiveCategory(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg text-indigo-600">Loading articles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={fetchBlogData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-indigo-700 to-purple-800 py-16 md:py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-serif"
          >
            From the Blog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-3xl mx-auto text-xl text-indigo-100"
          >
            Tips, trends, and inspiration for transforming your space
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 max-w-md mx-auto"
          >
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..." 
                className="w-full px-5 py-3 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="Search articles"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery(&apo:&apo:)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </header>

      {/* Featured Post */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence>
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PostCard post={featuredPost} variant="featured" />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Posts Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="flex flex-wrap gap-2 items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mr-4 font-serif">Latest Articles</h2>
              <button 
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1.5 text-sm rounded-full transition ${
                  !activeCategory 
                    ? &apo:bg-indigo-600 text-white shadow&apo: 
                    : &apo:bg-gray-100 text-gray-700 hover:bg-gray-200&apo:
                }`}
                aria-pressed={!activeCategory}
              >
                All
              </button>
              
              {categories.map((cat) => (
                <button 
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-3 py-1.5 text-sm rounded-full transition ${
                    activeCategory === cat.slug 
                      ? &apo:bg-indigo-600 text-white shadow&apo: 
                      : &apo:bg-gray-100 text-gray-700 hover:bg-gray-200&apo:
                  }`}
                  aria-pressed={activeCategory === cat.slug}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid gap-8 lg:grid-cols-2">
                <AnimatePresence initial={false}>
                  {filteredPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PostCard post={post} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white rounded-xl p-8 shadow"
              >
                <h3 className="text-lg font-medium text-gray-900">No Articles Found</h3>
                <p className="mt-2 text-gray-500 mb-4">Try adjusting your search or category filter</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full md:w-1/3 lg:w-1/4">
            <div className="sticky top-24 space-y-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 font-serif">Categories</h3>
                <ul className="space-y-3">
                  {categories.map((cat) => (
                    <li key={cat.slug}>
                      <button
                        onClick={() => setActiveCategory(cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${
                          activeCategory === cat.slug
                            ? &apo:bg-indigo-50 text-indigo-700 font-medium&apo:
                            : &apo:text-gray-600 hover:bg-gray-50&apo:
                        }`}
                      >
                        <span className="mr-2 text-indigo-500">#</span>
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 font-serif">Newsletter</h3>
                <p className="text-gray-600 mb-3">Get design tips and inspiration delivered to your inbox</p>
                <form className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    aria-label="Email for newsletter"
                  />
                  <button 
                    type="submit"
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}