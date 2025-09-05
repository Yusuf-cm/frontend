// NO "use client" here. This remains a Server Component.

import FeaturedProducts from '@/components/FeaturedProducts';
import AnimatedDiv from '@/components/AnimatedDiv';
import Link from 'next/link';
import { FiArrowRight, FiCheck, FiShoppingBag, FiHome, FiTool } from 'react-icons/fi';
import NewsletterForm from '@/components/NewsletterForm'; // <-- IMPORT the new Client Component

// Reusable component for the service highlights
const ServiceHighlight = ({ icon, title, description }) => (
  <AnimatedDiv 
    className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
    whileHover={{ y: -5 }}
  >
    <div className="flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-serif font-bold text-gray-900">{title}</h3>
    <p className="mt-3 text-base text-gray-600">{description}</p>
  </AnimatedDiv>
);

const FeatureCard = ({ title, description, icon }) => (
  <div className="flex">
    <div className="flex-shrink-0">
      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
        {icon}
      </div>
    </div>
    <div className="ml-4">
      <h4 className="text-lg font-bold text-gray-900">{title}</h4>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  </div>
);

export default function HomePage() {
  // --- REMOVED useState and handleSubmit logic from this component ---

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-900 to-purple-800 overflow-hidden">
        {/* ... (Hero JSX is unchanged) ... */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent" />
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-32 sm:py-40 sm:px-6 lg:px-8">
          <AnimatedDiv 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-serif font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="block">Transform Your Space,</span>
              <span className="block text-indigo-200 mt-3">Elevate Your Lifestyle</span>
            </h1>
            <p className="mt-6 max-w-md mx-auto text-xl text-indigo-100 sm:max-w-3xl">
              Discover curated home decor and expert interior design services that bring your vision to life with elegance and style.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/products" className="flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition-all hover:shadow-lg shadow-indigo-900/30">
                Shop Collection <FiArrowRight className="ml-2" />
              </Link>
              <Link href="/services" className="flex items-center justify-center px-8 py-3 bg-white text-indigo-900 font-bold rounded-md border border-transparent hover:bg-indigo-50 transition-all">
                Design Services
              </Link>
            </div>
          </AnimatedDiv>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="py-16 bg-white">
        {/* ... (Featured Products JSX is unchanged) ... */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedDiv className="text-center mb-16">
            <h2 className="text-3xl font-serif font-extrabold text-gray-900 sm:text-4xl">Featured Collection</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Handpicked selections that transform any space
            </p>
          </AnimatedDiv>
          <FeaturedProducts />
          <div className="mt-12 text-center">
            <Link href="/products" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-md text-indigo-700 hover:text-indigo-900">
              View all products <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Value Proposition Section */}
      <div className="bg-gray-50 py-16">
        {/* ... (Value Prop JSX is unchanged) ... */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <AnimatedDiv>
                <h2 className="text-3xl font-serif font-extrabold text-gray-900 sm:text-4xl">
                  Why Choose Ronohs Decor
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  We combine exceptional craftsmanship with personalized service to create spaces that reflect your unique style.
                </p>
                
                <div className="mt-10 space-y-6">
                  <FeatureCard icon={<FiCheck className="h-6 w-6" />} title="Quality Guaranteed" description="Every piece is crafted with premium materials and attention to detail." />
                  <FeatureCard icon={<FiTool className="h-6 w-6" />} title="Easy Assembly" description="Most items come with easy-to-follow assembly instructions." />
                </div>
              </AnimatedDiv>
            </div>
            
            <div className="mt-12 lg:mt-0 lg:col-span-7">
              <AnimatedDiv className="relative rounded-2xl overflow-hidden shadow-xl" whileHover={{ scale: 1.02 }}>
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96" />
              </AnimatedDiv>
            </div>
          </div>
        </div>
      </div>

      {/* Services Highlight Section */}
      <div className="bg-white py-16 sm:py-24">
        {/* ... (Services Highlight JSX is unchanged) ... */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedDiv className="text-center mb-16">
            <h2 className="text-3xl font-serif font-extrabold text-gray-900 sm:text-4xl">Our Services</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Comprehensive solutions for residential and commercial spaces
            </p>
          </AnimatedDiv>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceHighlight icon={<FiHome className="w-8 h-8" />} title="Interior Design" description="Personalized design services for residential and commercial spaces." />
            <ServiceHighlight icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} title="Full Contracting" description="End-to-end project management, from concept to completion." />
            <ServiceHighlight icon={<FiShoppingBag className="w-8 h-8" />} title="Curated Shop" description="A hand-picked collection of high-quality home decor items." />
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/services" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-md text-indigo-700 hover:text-indigo-900">
              Explore all services <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-indigo-900 py-16">
        {/* ... (Testimonials JSX is unchanged) ... */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedDiv className="text-center mb-16">
            <h2 className="text-3xl font-serif font-extrabold text-white sm:text-4xl">What Our Clients Say</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-indigo-200">
              Don't just take our word for it
            </p>
          </AnimatedDiv>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <AnimatedDiv key={item} className="bg-white p-8 rounded-xl shadow-lg" whileHover={{ y: -5 }}>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote><p className="text-gray-600">"The team completely transformed our living room into a space we love spending time in. Their attention to detail and creative solutions were impressive."</p></blockquote>
                <div className="mt-6 flex items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12" />
                  <div className="ml-4">
                    <p className="text-lg font-bold text-gray-900">Sarah Johnson</p>
                    <p className="text-indigo-600">Nairobi Residence Project</p>
                  </div>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-700 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 sm:p-12">
                <AnimatedDiv>
                  <h3 className="text-2xl font-serif font-bold text-white">
                    Join Our Design Community
                  </h3>
                  <p className="mt-4 text-lg text-indigo-200 max-w-md">
                    Subscribe to receive design tips, exclusive offers, and inspiration for your home.
                  </p>
                  {/* --- USE THE NEW CLIENT COMPONENT HERE --- */}
                  <NewsletterForm />
                  {/* ------------------------------------------- */}
                  <p className="mt-3 text-sm text-indigo-200">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </AnimatedDiv>
              </div>
              <div className="hidden md:block relative">
                <div className="bg-gray-200 border-2 border-dashed w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gray-900">
        {/* ... (Final CTA JSX is unchanged) ... */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <AnimatedDiv className="text-center lg:text-left">
            <h2 className="text-3xl font-serif font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to transform your space?</span>
              <span className="block text-indigo-400">Let's create something beautiful together.</span>
            </h2>
          </AnimatedDiv>
          <AnimatedDiv className="mt-8 flex justify-center lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/contact" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-bold rounded-md text-indigo-900 bg-indigo-400 hover:bg-indigo-300">
                Book a Consultation
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="/portfolio" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-bold rounded-md text-white bg-gray-800 hover:bg-gray-700">
                View Our Portfolio
              </Link>
            </div>
          </AnimatedDiv>
        </div>
      </div>
    </div>
  );
}