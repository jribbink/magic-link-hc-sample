import { PHASE_PRODUCTION_BUILD } from "next/dist/shared/lib/constants";

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

// Only throw error if not building
if (!apiKey && process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD)
  throw new Error(
    "Magic API key not found, please set it in the environment variables"
  );

export const MAGIC_CONFIG = {
  apiKey: apiKey!,
};
