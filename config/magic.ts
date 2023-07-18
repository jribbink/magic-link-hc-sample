const flowNetwork = process.env.NEXT_PUBLIC_FLOW_NETWORK

export const MAGIC_CONFIG = {
  testnet: {
    apiKey: 'pk_live_41A13A15F0792BBB'
  },
  mainnet: {
    apiKey: 'pk_live_41A13A15F0792BBB'
  },
  local: {
    apiKey: 'pk_live_41A13A15F0792BBB'
  }
}[flowNetwork]