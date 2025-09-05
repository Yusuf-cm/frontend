// frontend/next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: '127.0.0.1',
          port: '8000',
        },
        {
          protocol: 'https',
          hostname: 'ronohs-decor-backend-hr4r.onrender.com', // <-- ADD THIS (use your actual Render hostname)
        },
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com', // <-- ADD THIS for Cloudinary
        },
      ],
    },
};

export default nextConfig;