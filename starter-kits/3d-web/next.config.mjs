/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three ships untranspiled ESM in places; let Next handle it.
  transpilePackages: ['three'],
};

export default nextConfig;
