/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress WebSocket warnings in development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Suppress WebSocket connection warnings in development
      config.infrastructureLogging = {
        level: 'error',
      };
    }
    return config;
  },
  
  // Experimental features for better error handling
  experimental: {
    // Suppress hydration warnings for development
    suppressHydrationWarning: true,
  },
  
  // Environment variables
  env: {
    SUPPRESS_WEBSOCKET_ERRORS: 'true',
  },
  
  // Image configuration
  images: {
    domains: ['res.cloudinary.com'],
  },
};

module.exports = nextConfig;