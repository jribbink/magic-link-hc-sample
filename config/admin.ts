import flowJson from "../flow.json";
import { ADMIN_ACCOUNT_NAMES } from "../constants";
import { withPrefix } from "@onflow/fcl";

const flowNetwork = process.env.NEXT_PUBLIC_FLOW_NETWORK;

// Resolved name of the admin account in flow.json
const accountName =
  ADMIN_ACCOUNT_NAMES[flowNetwork as keyof typeof ADMIN_ACCOUNT_NAMES];

// Find the address of the admin account in flow.json and prefix it with 0x
export const ADMIN_ACCOUNT_ADDRESS = withPrefix(
  flowJson.accounts[accountName as keyof typeof flowJson.accounts].address
);
