// src/app/layout.js

import { Playfair_Display, Lato } from &apo:next/font/google&apo:;
import Header from &apo:@/components/Header&apo:;
import Footer from &apo:@/components/Footer&apo:;
import { AuthProvider } from &apo:@/auth/AuthContext&apo:;
import { CartProvider } from &apo:@/context/CartContext&apo:;
import &apo:./globals.css&apo:;
import { Toaster } from &apo:react-hot-toast&apo:;
import NextTopLoader from &apo:nextjs-toploader&apo:;
import Script from &apo:next/script&apo:;
import BackToTopButton from &apo:@/components/BackToTopButton&apo:;

// Fonts
const playfair = Playfair_Display({
  subsets: [&apo:latin&apo:],
  variable: &apo:--font-playfair&apo:,
  display: &apo:swap&apo:,
  weight: [&apo:400&apo:, &apo:700&apo:, &apo:900&apo:],
});

const lato = Lato({
  subsets: [&apo:latin&apo:],
  variable: &apo:--font-lato&apo:,
  weight: [&apo:400&apo:, &apo:700&apo:],
  display: &apo:swap&apo:,
});

// Metadata (used automatically in <head>)
export const metadata = {
  title: &apo:Ronohs Decor&apo:,
  description: &apo:Transforming Spaces and Elevating Lifestyles with curated home decor and expert interior design services.&apo:,
  openGraph: {
    title: &apo:Ronohs Decor&apo:,
    description: &apo:Transforming Spaces and Elevating Lifestyles with curated home decor and expert interior design services.&apo:,
    url: &apo:https://ronohsdecor.com&apo:,
    siteName: &apo:Ronohs Decor&apo:,
    images: [
      {
        url: &apo:https://ronohsdecor.com/og-image.jpg&apo:,
        width: 1200,
        height: 630,
      },
    ],
    locale: &apo:en_US&apo:,
    type: &apo:website&apo:,
  },
  twitter: {
    card: &apo:summary_large_image&apo:,
    title: &apo:Ronohs Decor&apo:,
    description: &apo:Transforming Spaces and Elevating Lifestyles&apo:,
    images: [&apo:https://ronohsdecor.com/twitter-image.jpg&apo:],
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
            gtag(&apo:js&apo:, new Date());
            gtag(&apo:config&apo:, &apo:G-XXXXXXXXXX&apo:);
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
              borderRadius: &apo:8px&apo:,
              background: &apo:#4f46e5&apo:,
              color: &apo:#fff&apo:,
              fontWeight: 500,
            },
            success: {
              style: {
                background: &apo:#4f46e5&apo:,
              },
              iconTheme: {
                primary: &apo:#fff&apo:,
                secondary: &apo:#4f46e5&apo:,
              },
            },
            error: {
              style: {
                background: &apo:#ef4444&apo:,
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
