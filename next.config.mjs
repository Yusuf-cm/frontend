// frontend/next.config.mjs

/** @type {import(&apo:next&apo:).NextConfig} */
const nextConfig = {
  images: {
      remotePatterns: [
        {
          protocol: &apo:http&apo:,
          hostname: &apo:127.0.0.1&apo:,
          port: &apo:8000&apo:,
        },
        {
          protocol: &apo:https&apo:,
          hostname: &apo:ronohs-decor-backend-hr4r.onrender.com&apo:, // <-- ADD THIS (use your actual Render hostname)
        },
        {
          protocol: &apo:https&apo:,
          hostname: &apo:res.cloudinary.com&apo:, // <-- ADD THIS for Cloudinary
        },
      ],
    },
};

export default nextConfig;