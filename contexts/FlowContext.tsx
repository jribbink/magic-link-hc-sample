import { createContext, useContext, useEffect, useState } from "react";

import { Magic, MagicUserMetadata } from "magic-sdk";
import { FlowExtension } from "@magic-ext/flow";
import { OAuthExtension } from "@magic-ext/oauth";
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
  login: () => Promise<void>;
  logout: () => Promise<void>;
  authz: any;
}

// create react context
export const FlowContext = createContext<IFlowContext>({
  magic: null,
  userMetadata: null,
  isLoggedIn: false,
  login: async () => {},
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
  const [isLoggedIn, setIsLoggedIn] = useState(null);
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

  const login = async () => {
    if (!magic) return;

    await magic.oauth.loginWithRedirect({
      redirectURI: window.location.origin + "/oauth",
      provider: "google",
    });
  };

  const logout = async () => {
    if (!magic) return;
    await magic.user.logout();
    setIsLoggedIn(false);
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
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export const useFlow = () => useContext(FlowContext);
