# Magic Link HC Example

This is an example of a minimal hybrid custody app using Magic Link for the Flow Blockchain. It follows the [NFT standard](https://github.com/onflow/flow-nft) to create a very minimal NFT contract which allows anyone to mint an NFT.

This repository is a fork of the [FCL Next Scaffold](https://github.com/chasefleming/fcl-next-scaffold).

For more information regarding hybrid custody, see the [Flow documentation](https://docs.onflow.org/concepts/hybrid-custody/). Additionally, this sample repository uses only a small subset of the available hybrid custody features. For more information on hybrid custody features as well as more sample scripts/transactions, see the [Hybrid Custody GitHub Repository](https://github.com/onflow/hybrid-custody/).

**NOTE:** Currently this app only works as is in **testnet** and **mainnet**. Magic Link does not currently support the emulator.

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

You'll need to add the following environment variable to your `.env.local` file:

```
MAGIC_PUBLISHABLE_KEY_MAINNET=
```

#### Local Development Environment Variables

Currently, Magic Link does not support local development, therefore this app will not work locally.

## Running the App

First run:

```
npm install
```

### Testnet

To run the app without contracts, run:

```sh
npm run dev:testnet
```

However, in order to deploy your own contracts & make changes/additions to this app, you will need your own account in `flow.json`. There is currently an account in the `flow.json` file, `testnet-account`, which currently holds the `ExampleNFT.cdc` contract.

To create your own account, delete the example account from the `flow.json` "accounts" section and run:

```sh
flow accounts create
```

Select the network `testnet` and call the account `testnet-account` so that it matches the "deployments" section in the `flow.json` file (however, it could be called anything as long as these match).

To run the app and update the deployed contracts, run:

```sh
npm run dev:testnet:deploy
```

### Mainnet

To run the app without contracts, run:

```sh
npm run dev:mainnet
```

However, in order to deploy your own contracts & make changes/additions to this app, you will need your own account in `flow.json`. There is currently an account in the `flow.json` file, `mainnet-account`, which currently holds the `ExampleNFT.cdc` contract.

To create your own account, delete the example account from the `flow.json` "accounts" section and run:

```sh
flow accounts create
```

Select the network `mainnet` and call the account `mainnet-account` so that it matches the "deployments" section in the `flow.json` file (however, it could be called anything as long as these match).

To run the app and update the deployed contracts, run:

```sh
npm run dev:mainnet:deploy
```

### Local Development

Currently, Magic Link does not support local development, therefore this app will not work locally.
