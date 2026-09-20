/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  async redirects() {
    // Static export ignores next.config redirects; keep contracts aliases in
    // vercel.json (and Flight index.txt → HTML redirects there as well).
    return [
      {
        source: "/docs/contracts",
        destination: "/docs/trace-contracts",
        permanent: true,
      },
      {
        source: "/docs/contracts/",
        destination: "/docs/trace-contracts/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
