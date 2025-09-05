// src/components/Footer.js
&apo:use client&apo:;

import Link from &apo:next/link&apo:;
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiMapPin, FiPhone, FiMail } from &apo:react-icons/fi&apo:;
import BackToTopButton from &apo:./BackToTopButton&apo:;
import NewsletterForm from &apo:./NewsletterForm&apo:;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-serif font-bold">Ronohs Decor</h3>
            <p className="mt-4 text-gray-400 max-w-md">
              Transforming spaces and elevating lifestyles with curated decor and expert interior design services across Kenya.
            </p>
            <div className="mt-6">
              <h4 className="text-lg font-semibold">Subscribe to our newsletter</h4>
              <NewsletterForm />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wider">Navigation</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-indigo-400 transition-colors">Shop All</Link></li>
              <li><Link href="/portfolio" className="hover:text-indigo-400 transition-colors">Portfolio</Link></li>
              <li><Link href="/services" className="hover:text-indigo-400 transition-colors">Design Services</Link></li>
              <li><Link href="/blog" className="hover:text-indigo-400 transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-indigo-400 transition-colors">FAQs</Link></li>
              <li><Link href="/shipping" className="hover:text-indigo-400 transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wider">Contact Us</h3>
            <ul className="mt-4 space-y-3 text-gray-400">
              <li className="flex items-start">
                <FiMapPin className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                <span>123 Design Avenue, Westlands, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center">
                <FiPhone className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>0745036448</span>
              </li>
              <li className="flex items-center">
                <FiMail className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>ronohsdecor@gmail.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-indigo-600 h-10 w-10 rounded-full flex items-center justify-center transition-colors" aria-label="Instagram"><FiInstagram className="h-5 w-5" /></a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-indigo-600 h-10 w-10 rounded-full flex items-center justify-center transition-colors" aria-label="Facebook"><FiFacebook className="h-5 w-5" /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-indigo-600 h-10 w-10 rounded-full flex items-center justify-center transition-colors" aria-label="Twitter"><FiTwitter className="h-5 w-5" /></a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap justify-center gap-4">
            {[&apo:visa&apo:, &apo:mastercard&apo:, &apo:paypal&apo:, &apo:mpesa&apo:].map((method) => (
              <div key={method} className="bg-gray-800 rounded-lg h-10 w-16 flex items-center justify-center">
                <span className="text-xs font-semibold uppercase text-gray-400">{method}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 md:mt-0 text-center md:text-right">
            <p className="text-gray-500 text-sm">
              © {currentYear} Ronohs Decor. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      <BackToTopButton />
    </footer>
  );
}