/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other config
  
  // Enable dynamic routes even in static export
  output: 'standalone',
  
  // Optional: Configure path rewrites for dynamic routes
  rewrites: async () => {
    return [
      {
        source: '/halls/:hallId',
        destination: '/halls/[hallId]',
      },
    ];
  },
};

module.exports = nextConfig; 