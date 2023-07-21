import { createContext, useContext, useEffect, useState } from "react";

import { Magic, MagicUserMetadata } from "magic-sdk";
import { FlowExtension } from "@magic-ext/flow";
import { OAuthExtension, OAuthProvider } from "@magic-ext/oauth";
import { InstanceWithExtensions, SDKBase } from "@magic-sdk/provider";

import { getChainId } from "@onflow/fcl";
import * as fcl from "@onflow/fcl";
import { MAGIC_CONFIG } from "../config/magic";

type MagicInstance = InstanceWithExtensions<
  SDKBase,
  (FlowExtension | OAuthExtension)[]
>;

export interface IFlowContext {
  magic: MagicInstance | null;
  userMetadata: MagicUserMetadata | null;
  isLoggedIn: boolean | null;
  loginEmail: (email: string) => Promise<void>;
  loginOAuth: (provider: OAuthProvider) => Promise<void>;
  logout: () => Promise<void>;
  authz: any;
}

// create react context
export const FlowContext = createContext<IFlowContext>({
  magic: null,
  userMetadata: null,
  isLoggedIn: false,
  loginEmail: async () => {},
  loginOAuth: async () => {},
  logout: async () => {},
  authz: null,
});

// Path: src/contexts/FlowContext.ts
// create flow provider
export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [magic, setMagic] = useState<MagicInstance | null>(null);
  const [userMetadata, setUserMetadata] = useState<MagicUserMetadata | null>(
    null
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [authz, setAuthz] = useState(null);

  useEffect(() => {
    if (!magic) return;

    // Get oauth redirect result if exists
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
    setIsLoggedIn(true);
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

  console.log((magic?.oauth as OAuthExtension)?.config);

  return (
    <FlowContext.Provider
      value={{
        magic,
        userMetadata,
        isLoggedIn,
        loginEmail,
        loginOAuth,
        logout,
        authz: magic?.flow?.authorization,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export const useFlow = () => useContext(FlowContext);
