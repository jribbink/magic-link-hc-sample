export const ACCESS_NODE_URLS = {
  local: "http://localhost:8888",
  testnet: "https://rest-testnet.onflow.org",
  mainnet: "https://rest-mainnet.onflow.org",
};

// Denotes the name of the admin account in flow.json
// This account is used to resolve CapabilityFilter and CapabilityFactory rules
export const ADMIN_ACCOUNT_NAMES = {
  local: "emulator-account",
  testnet: "testnet-admin",
  mainnet: "mainnet-admin",
};
