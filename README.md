# Magic Link HC Example

This is an example of a minimal hybrid custody app using Magic Link for the Flow Blockchain. It follows the [NFT standard](https://github.com/onflow/flow-nft) for a very minimal NFT contract which allows anyone to mint an NFT.

This is a fork of the [FCL Next Scaffold](https://github.com/chasefleming/fcl-next-scaffold).

**NOTE:** Currently this app only works as is in **testnet**. It will not work in the emulator or on mainnet. This is because the Magic Link service is not yet available on the emulator and account linking is not yet available on mainnet.

## Getting Started

### Magic Link

To use Magic Link, you'll need to create an account at [Magic](https://magic.link/). Once you've created an account, you'll need to create an app and get your API keys.

Currently Facebook & Google are listed as social providers in the dApp, (see `components/SignInModal.tsx`) and to use these you will need to setup these providers in your Magic Link dashboard. You can also add other providers such as Twitter, Github, etc.

**Note** Magic Link requires a separate application for each environment. You'll need to create a separate app in the Magic Link dashboard for local development, testnet, and mainnet.

#### Testnet Environment Variables

You'll need to add the following environment variables to your `.env.local` file:

```
MAGIC_PUBLISHABLE_KEY_TESTNET=
MAGIC_SECRET_KEY_TESTNET=
```

#### Mainnet Environment Variables

You'll need to add the following environment variables to your `.env.local` file:

```
MAGIC_PUBLISHABLE_KEY_MAINNET=
MAGIC_SECRET_KEY_MAINNET=
```

#### Local Development Environment Variables

You'll need to add the following environment variables to your `.env.local` file:

```
MAGIC_PUBLISHABLE_KEY_LOCAL=
MAGIC_SECRET_KEY_LOCAL=
```

### Configuring the CapabilityFactory and CapabilityFilter

The `CapabilityFactory` and `CapabilityFilter` are used to configure what capabilities are available to the parent account. The default setup transactions for these exist at `cadence/transactions/factory/setup.cdc` and `cadence/transactions/filter/setup-allow-all.cdc`.

To run these setup transactions, you can run:

`npm run dev:testnet:setup-admin` (testnet)
`npm run dev:mainnet:setup-admin` (mainnet)
`npm run dev:local:setup-admin` (local)

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

**NOTE:** The app looks for `mainnet-admin`/`testnet-admin`/`emulator-account` in `flow.json` to determine `CapabilityFilter` and `CapabilityFactory` configurations for HybridCustody. The name of the admin account is configured in `constants/index.ts`.

Because of this, you should delete the existing admin account from `flow.json` and replace it with the account you just created. You can also change the name of the admin account in `constants/index.ts` if you want to use a different name.

Then run:

```

npm run dev:testnet:deploy

```

Whenever you need to redeploy changed contracts to Testnet while seeing the diff between deployed contracts and updates being pushed, you can run:

```

npm run dev:testnet:update

```

### Mainnet

Currently, mainnet does not support account linking.

### Local Development

Currently, Magic Link does not support local development.

```

```
