/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
    ],
  },
  allowedDevOrigins: ["http://localhost:8080", "http://127.0.0.1:8080", "http://100.64.0.31", "http://103.149.142.229"],
};

export default nextConfig;
