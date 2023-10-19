# Magic Link HC Example

This is an example of a minimal hybrid custody app using Magic Link for the Flow Blockchain. It follows the [NFT standard](https://github.com/onflow/flow-nft) to create a very minimal NFT contract which allows anyone to mint an NFT.

This repository is a fork of the [FCL Next Scaffold](https://github.com/chasefleming/fcl-next-scaffold).

For more information regarding hybrid custody, see the [Flow documentation](https://docs.onflow.org/concepts/hybrid-custody/). Additionally, this sample repository uses only a small subset of the available hybrid custody features. For more information on hybrid custody features as well as more sample scripts/transactions, see the [Hybrid Custody GitHub Repository](https://github.com/onflow/hybrid-custody/).

**NOTE:** Currently this app only works as is in **testnet**.  Magic Link does not currently support mainnet.

## See it in action

You can see this app in action on [Code Sandbox](https://codesandbox.io/p/github/jribbink/magic-link-hc-sample/main).

**NOTE:** OAuth providers (Facebook, Google, etc.) will only work if you open the Code Sandbox preview in a new tab. This is due to limitations in the IFrame preview.

## Getting Started

### Magic Link

To use Magic Link, you'll need to create an account at [Magic](https://magic.link/). Once you've created an account, you'll need to create an app and get your API keys.

Currently Facebook & Google are listed as social providers in the dApp, (see `components/SignInModal.tsx`) and to use these you will need to setup these providers in your Magic Link dashboard. You can also add other providers such as Twitter, Github, etc.

**Note** Magic Link requires a separate application for each environment. You'll need to create a separate app in the Magic Link dashboard for local development, testnet, and mainnet.

#### Testnet Environment Variables

You'll need to add the following environment variable to your `.env.local` file:

```
MAGIC_PUBLISHABLE_KEY_TESTNET=
```

#### Mainnet Environment Variables

Mainnet is not yet supported.

#### Local Development Environment Variables

Local development is not yet supported.

## Running the App

First run:

```
npm install
```

### Testnet

If you haven't yet created a testnet account, in the CLI run:

```
flow accounts create
```

Follow the steps and select testnet. This will create a `[name].pkey` file (make sure this is gitignored) and add your account to flow.json.

**NOTE:** The app looks for an account named `mainnet-admin` (mainnet), `testnet-admin` (testnet), `emulator-account` (emulator) in `flow.json` to determine `CapabilityFilter` and `CapabilityFactory` configurations for HybridCustody. The name of the admin account is configured in `constants/index.ts`.

Because of this, you should delete the existing admin account from `flow.json` and replace it with the account you just created. You can also change the name of the admin account in `constants/index.ts` if you want to use a different name.

Then run:

```sh
npm run dev:testnet:deploy
```

To run the app later without redeploying contracts, run:

```sh
npm run dev:testnet
```

### Mainnet

Currently, mainnet does not support account linking, therefore this app will not work on mainnet.

### Local Development

Currently, Magic Link does not support local development, therefore this app will not work locally.
