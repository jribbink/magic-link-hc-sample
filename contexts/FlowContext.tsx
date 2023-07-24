import { createContext, useContext, useEffect, useState } from "react";

import { Magic, MagicUserMetadata } from "magic-sdk";
import { FlowExtension } from "@magic-ext/flow";
import { OAuthExtension, OAuthProvider } from "@magic-ext/oauth";
import { InstanceWithExtensions, SDKBase } from "@magic-sdk/provider";

import { getChainId } from "@onflow/fcl";
import * as fcl from "@onflow/fcl";
import { MAGIC_CONFIG } from "../config/magic";
import SignInModal from "../components/SignInModal";
import { useDisclosure } from "@chakra-ui/react";

import setupOwnedAccount from "../cadence/transactions/hybrid-custody/setup-owned-account.cdc";
import setupExampleNFTCollection from "../cadence/transactions/example-nft/setup.cdc";
import checkNFTSetup from "../cadence/scripts/example-nft/check_setup.cdc";
import checkOwnedAccountSetup from "../cadence/scripts/hybrid-custody/check_owned_account_setup.cdc";

type MagicInstance = InstanceWithExtensions<
  SDKBase,
  (FlowExtension | OAuthExtension)[]
>;

export interface IFlowContext {
  magic: MagicInstance | null;
  userMetadata: MagicUserMetadata | null;
  isLoggedIn: boolean | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  setupAccount: (address: string) => Promise<void>;
  authz: any;
  refreshLogin: () => Promise<MagicUserMetadata | null>;
}

// create react context
export const FlowContext = createContext<IFlowContext>({
  magic: null,
  userMetadata: null,
  isLoggedIn: false,
  login: async () => {},
  logout: async () => {},
  setupAccount: async (address: string) => {},
  authz: null,
  refreshLogin: async () => null,
});

// Path: src/contexts/FlowContext.ts
// create flow provider
export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [magic, setMagic] = useState<MagicInstance | null>(null);
  const [userMetadata, setUserMetadata] = useState<MagicUserMetadata | null>(
    null
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const {
    isOpen: isSignInOpen,
    onClose: onSignInClose,
    onOpen: openSignIn,
  } = useDisclosure();

  useEffect(() => {
    if (!magic) return;

    // Update logged in state if logged in
    magic.user.isLoggedIn().then(async (magicIsLoggedIn) => {
      setIsLoggedIn(magicIsLoggedIn);
      if (magicIsLoggedIn) {
        setUserMetadata(await magic.user.getMetadata());
      }
    });
  }, [magic]);

  useEffect(() => {
    (async () => {
      setMagic(
        new Magic(MAGIC_CONFIG.apiKey, {
          extensions: [
            new FlowExtension({
              rpcUrl: await fcl.config().get("accessNode.api"),
              network: await getChainId(),
            }),
            new OAuthExtension(),
          ],
        })
      );
    })();
  }, []);

  const loginEmail = async (email: string) => {
    if (!magic) return;
    await magic.auth.loginWithMagicLink({ email });

    // Set logged in state & user metadata
    const metadata = await refreshLogin();
    if (!metadata) {
      throw new Error("Unable to login");
    }
    return metadata;
  };

  const loginOAuth = async (provider: OAuthProvider) => {
    if (!magic) return;
    await magic.oauth.loginWithRedirect({
      redirectURI: window.location.origin + "/oauth",
      provider,
    });
  };

  const logout = async () => {
    if (!magic) return;
    setIsLoggedIn(false);
    await magic.user.logout();
  };

  const login = async () => {
    if (!magic) return;
    openSignIn();
  };

  const setupAccount = async (address: string) => {
    // Check if the NFT collection has been set up, if not, set it up
    const isNFTSetup = await fcl.query({
      cadence: checkNFTSetup,
      args: (arg, t) => [arg(address, t.Address)],
    });

    if (!isNFTSetup) {
      const nftSetupResult = await fcl
        .mutate({
          cadence: setupExampleNFTCollection,
          limit: 9999,
          authz: magic?.flow?.authorization,
        } as any)
        .then((txId) => fcl.tx(txId).onceSealed());

      if (nftSetupResult.errorMessage) {
        throw new Error(nftSetupResult.errorMessage);
      }
    }

    // Check if the owned account has been set up (for account linking), if not, set it up
    const isOwnedAccountSetup = await fcl.query({
      cadence: checkOwnedAccountSetup,
      args: (arg, t) => [arg(address, t.Address)],
    });

    if (!isOwnedAccountSetup) {
      const ownedAccountSetupResult = await fcl
        .mutate({
          cadence: setupOwnedAccount,
          limit: 9999,
          authz: magic?.flow?.authorization,
        } as any)
        .then((txId) => fcl.tx(txId).onceSealed());

      if (ownedAccountSetupResult.errorMessage) {
        throw new Error(ownedAccountSetupResult.errorMessage);
      }
    }
  };

  const refreshLogin = async () => {
    if (!magic) return null;

    const magicIsLoggedIn = await magic.user.isLoggedIn();
    const metadata = await magic.user.getMetadata().catch(() => null);

    setIsLoggedIn(magicIsLoggedIn);
    setUserMetadata(metadata);

    return metadata;
  };

  return (
    <FlowContext.Provider
      value={{
        magic,
        userMetadata,
        isLoggedIn,
        login,
        logout,
        authz: magic?.flow?.authorization,
        setupAccount,
        refreshLogin,
      }}
    >
      {children}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => onSignInClose()}
        loginEmail={loginEmail}
        loginOAuth={loginOAuth}
      ></SignInModal>
    </FlowContext.Provider>
  );
}

export const useFlow = () => useContext(FlowContext);
