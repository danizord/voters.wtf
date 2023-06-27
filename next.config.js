/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // logging: "verbose",
    // typedRoutes: true,
  },
  env: {
    WS_NO_BUFFER_UTIL: "1",
    WS_NO_UTF_8_VALIDATE: "1",
  },
  devIndicators: {
    buildActivity: true,
  }
};

module.exports = nextConfig;
