const flowNetwork = process.env.FLOW_NETWORK!;

// Get the Magic API key from the environment variables
let apiKey;
if (flowNetwork === "mainnet") {
  apiKey = process.env.MAGIC_PUBLISHABLE_KEY_MAINNET;
} else if (flowNetwork === "testnet") {
  apiKey = process.env.MAGIC_PUBLISHABLE_KEY_TESTNET;
} else {
  apiKey = process.env.MAGIC_PUBLISHABLE_KEY_LOCAL;
}

if (!apiKey)
  throw new Error(
    "Magic API key not found, please set it in the environment variables"
  );

export const MAGIC_CONFIG = {
  apiKey: apiKey,
};
