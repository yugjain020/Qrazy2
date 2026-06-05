/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // FIX 1: 'domains' is deprecated, using 'remotePatterns' instead
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },

  // FIX 2: Moved out of 'experimental' for Next.js 16
  serverExternalPackages: ['three', 'sharp'],

  // FIX 3: Added empty turbopack config to silence the Webpack vs Turbopack error
  turbopack: {},

  // FIX 4: Removed the 'webpack' block entirely as Turbopack doesn't use it
  // (3D files like .glb will be loaded via URL from Firebase Storage anyway)
};

export default nextConfig;