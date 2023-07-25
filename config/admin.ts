import flowJson from "../flow.json";
import { ADMIN_ACCOUNT_NAMES } from "../constants";

const flowNetwork = process.env.NEXT_PUBLIC_FLOW_NETWORK;

// resolved name of the admin account in flow.json
const accountName =
  ADMIN_ACCOUNT_NAMES[flowNetwork as keyof typeof ADMIN_ACCOUNT_NAMES];

export const ADMIN_ACCOUNT_ADDRESS =
  flowJson.accounts[accountName as keyof typeof flowJson.accounts].address;
