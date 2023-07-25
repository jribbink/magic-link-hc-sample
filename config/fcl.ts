import { config } from "@onflow/fcl";
import { ACCESS_NODE_URLS } from "../constants";
import flowJSON from "../flow.json";

const flowNetwork = process.env.FLOW_NETWORK;

config({
  "flow.network": flowNetwork,
  "accessNode.api":
    ACCESS_NODE_URLS[flowNetwork as keyof typeof ACCESS_NODE_URLS],
  "discovery.wallet": `https://fcl-discovery.onflow.org/${flowNetwork}/authn`,
  "app.detail.icon": "https://avatars.githubusercontent.com/u/62387156?v=4",
  "app.detail.title": "FCL Next Scaffold",
}).load({ flowJSON });
