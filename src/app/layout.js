// src/app/layout.js

import { Playfair_Display, Lato } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/auth/AuthContext';
import { CartProvider } from '@/context/CartContext';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';
import Script from 'next/script';
import BackToTopButton from '@/components/BackToTopButton';

// Fonts
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '700', '900'],
});

const lato = Lato({
  subsets: ['latin'],
  variable: '--font-lato',
  weight: ['400', '700'],
  display: 'swap',
});

// Metadata (used automatically in <head>)
export const metadata = {
  title: 'Ronohs Decor',
  description: 'Transforming Spaces and Elevating Lifestyles with curated home decor and expert interior design services.',
  openGraph: {
    title: 'Ronohs Decor',
    description: 'Transforming Spaces and Elevating Lifestyles with curated home decor and expert interior design services.',
    url: 'https://ronohsdecor.com',
    siteName: 'Ronohs Decor',
    images: [
      {
        url: 'https://ronohsdecor.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ronohs Decor',
    description: 'Transforming Spaces and Elevating Lifestyles',
    images: ['https://ronohsdecor.com/twitter-image.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} scroll-smooth`}>
      <body className="bg-gray-50 font-sans antialiased">
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>

        {/* Page Load Progress Bar */}
        <NextTopLoader 
          color="#4f46e5"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #4f46e5,0 0 5px #4f46e5"
        />

        {/* Providers */}
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              {/* Accessibility: Skip Link */}
              <a 
                href="#main-content" 
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-indigo-600 focus:font-bold focus:rounded-lg focus:ring-2 focus:ring-indigo-600"
              >
                Skip to content
              </a>

              <Header />
              <main id="main-content" className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>

        {/* Toast Notifications (merged config) */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 5000,
            style: {
              borderRadius: '8px',
              background: '#4f46e5',
              color: '#fff',
              fontWeight: 500,
            },
            success: {
              style: {
                background: '#4f46e5',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#4f46e5',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />

        {/* Floating Back to Top Button */}
        <BackToTopButton />
      </body>
    </html>
  );
}
