export const ACCESS_NODE_URLS = {
  local: "http://localhost:8888",
  testnet: "https://rest-testnet.onflow.org",
  mainnet: "https://rest-mainnet.onflow.org",
};

// Addresses containing pre-made capability factories for NFT & FT capabilities
// You can add your own capability factories here, you may need to deploy your own
// see https://github.com/onflow/hybrid-custody
export const CAPABILITY_FACTORY_ADDRESSES = {
  testnet: "0x1b7fa5972fcb8af5",
  mainnet: "0x071d382668250606",
};

// Addresses containing a pre-made capability filter for allow all rules
// You can add your own capability filters here, you may need to deploy your own
// see https://github.com/onflow/hybrid-custody
export const CAPABILITY_FILTER_ADDRESSES = {
  testnet: "0xe2664be06bb0fe62",
  mainnet: "0x78e93a79b05d0d7d",
};
