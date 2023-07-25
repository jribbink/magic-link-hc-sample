/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.cdc$/,
      loader: "raw-loader",
    });

    return config;
  },
  env: {
    FLOW_NETWORK: process.env.FLOW_NETWORK,
    MAGIC_PUBLISHABLE_KEY_TESTNET: process.env.MAGIC_PUBLISHABLE_KEY_TESTNET,
    MAGIC_PUBLISHABLE_KEY_MAINNET: process.env.MAGIC_PUBLISHABLE_KEY_MAINNET,
    MAGIC_PUBLISHABLE_KEY_LOCAL: process.env.MAGIC_PUBLISHABLE_KEY_LOCAL,
  },
};

module.exports = nextConfig;
