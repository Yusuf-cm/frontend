'use client'; // <-- THIS IS THE FIX

import { useState } from 'react';

async function getPublicStats() {
  try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-stats/`, { next: { revalidate: 3600 } }); // Revalidate every hour
      if (!res.ok) return null;
      return res.json();
  } catch (error) {
      console.error("Failed to fetch public stats:", error);
      return null;
  }
}

// Icon component for visual elements
const Icon = ({ d, className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
  </svg>
);

// Service Card Component
const ServiceCard = ({ icon, title, description, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`cursor-pointer p-8 rounded-2xl transition-all duration-300 border-2 ${
      active 
        ? 'border-indigo-600 bg-indigo-50 shadow-lg transform -translate-y-2' 
        : 'border-gray-200 hover:border-indigo-300'
    }`}
  >
    <div className={`flex items-center justify-center h-20 w-20 rounded-full mx-auto ${
      active ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
    }`}>
      {icon}
    </div>
    <h3 className="mt-6 text-2xl font-bold text-gray-900">{title}</h3>
    <p className="mt-4 text-lg text-gray-600">{description}</p>
    
    {active && (
      <div className="mt-6 space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <Icon d="M5 13l4 4L19 7" className="h-5 w-5 text-green-500" />
          </div>
          <p className="ml-3 text-gray-700">Concept development & mood boards</p>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <Icon d="M5 13l4 4L19 7" className="h-5 w-5 text-green-500" />
          </div>
          <p className="ml-3 text-gray-700">3D renderings & floor plans</p>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <Icon d="M5 13l4 4L19 7" className="h-5 w-5 text-green-500" />
          </div>
          <p className="ml-3 text-gray-700">Furniture & material selection</p>
        </div>
      </div>
    )}
    
    <div className="mt-6">
      <button className={`font-medium ${
        active ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'
      }`}>
        Learn more →
      </button>
    </div>
  </div>
);

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(0);
  
  const services = [
    {
      icon: <Icon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" className="w-8 h-8"/>,
      title: "Residential Design",
      description: "Personalized interior design for apartments, homes, and rental properties. We help you create a space that truly feels like home."
    },
    {
      icon: <Icon d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" className="w-8 h-8"/>,
      title: "Commercial Spaces",
      description: "Elevate your business with stunning interiors. We design functional and appealing spaces for offices, boutiques, salons, and more."
    },
    {
      icon: <Icon d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" className="w-8 h-8"/>,
      title: "Full Project Contracting",
      description: "Our complete project management service handles everything from design to sourcing, installation, and final touches."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="bg-gray-200 border-2 border-dashed w-full h-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Transform Your Space
            </h1>
            <p className="mt-6 text-xl text-indigo-200 max-w-2xl">
              From a simple room refresh to a complete home renovation, we provide end-to-end solutions tailored to you.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                Book a Consultation
              </button>
              <button className="px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                View Our Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid Section */}
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Design Services
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            We offer comprehensive design solutions for every space and budget
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              active={activeService === index}
              onClick={() => setActiveService(index)}
            />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <p className="text-5xl font-extrabold text-white">500+</p>
              <p className="mt-2 text-lg font-medium text-indigo-200">Projects Completed</p>
            </div>
            <div className="p-6">
              <p className="text-5xl font-extrabold text-white">98%</p>
              <p className="mt-2 text-lg font-medium text-indigo-200">Client Satisfaction</p>
            </div>
            <div className="p-6">
              <p className="text-5xl font-extrabold text-white">15+</p>
              <p className="mt-2 text-lg font-medium text-indigo-200">Years of Experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">Our Design Process</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              A seamless journey from concept to completion
            </p>
          </div>
          
          <div className="space-y-12">
            {[
              {
                step: "1",
                title: "Initial Consultation",
                description: "We start with a conversation to understand your vision, needs, and budget. You can share photos of your space and inspiration.",
                icon: <Icon d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" className="w-8 h-8" />
              },
              {
                step: "2",
                title: "Design & Proposal",
                description: "Our team creates a tailored design concept, including mood boards, product selections, and a detailed quote.",
                icon: <Icon d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-8 h-8" />
              },
              {
                step: "3",
                title: "Implementation",
                description: "Once you approve, we get to work! We handle purchasing, delivery, installation, and styling to bring the design to life.",
                icon: <Icon d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" className="w-8 h-8" />
              }
            ].map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white border-2 border-indigo-600 text-indigo-600">
                    {item.icon}
                  </div>
                </div>
                <div className="mt-6 md:mt-0 md:ml-8">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-indigo-600">{item.step}</span>
                    <h3 className="ml-4 text-xl font-bold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="mt-4 text-lg text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">What Our Clients Say</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <svg
                      key={star}
                      className="h-5 w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-6">
                  <p className="text-lg text-gray-600">
                    "The team completely transformed our living room into a space we love spending time in. Their attention to detail and creative solutions were impressive."
                  </p>
                </blockquote>
                <div className="mt-6 flex items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12" />
                  <div className="ml-4">
                    <p className="text-lg font-bold text-gray-900">Sarah Johnson</p>
                    <p className="text-indigo-600">Nairobi Residence Project</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to transform your space?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-indigo-200">
              Schedule a free consultation with our design experts today
            </p>
            <div className="mt-10 flex justify-center">
              <button className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition-colors text-lg">
                Book Your Consultation
              </button>
            </div>
            <p className="mt-6 text-indigo-300">
              Or call us at <span className="font-semibold text-white">+254 712 345 678</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}