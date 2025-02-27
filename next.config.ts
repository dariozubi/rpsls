import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push(
      "pino-pretty" /* add any other modules that might be causing the error */
    );
    return config;
  },
};

module.exports = nextConfig;
