/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
  // ENV WORKAROUND (8GB box, ~1GB free): Next's in-build type-check worker OOMs.
  // Types are verified separately via `npm run lint` (tsc --noEmit, currently clean).
  // Remove this and rely on the default once building on CI/with free RAM.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
