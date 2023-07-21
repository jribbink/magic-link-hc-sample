import { useEffect, useState } from "react";
import { useFlow } from "../contexts/FlowContext";
import * as fcl from "@onflow/fcl";
import { useRouter } from "next/router";

import setupOwnedAccount from "../cadence/transactions/hybrid-custody/setup-owned-account.cdc";
import setupExampleNFTCollection from "../cadence/transactions/example-nft/setup.cdc";
import { Heading } from "@chakra-ui/react";

function OAuthPage() {
  const router = useRouter();
  const flow = useFlow();
  const [message, setMessage] = useState("Logging in with Magic...");

  useEffect(() => {
    if (!flow.magic) return;
    flow.magic.oauth
      .getRedirectResult()
      .then(async () => {
        // TODO: only do this first setup if the account doesn't exist
        setMessage("Setting up your account...");

        const nftSetupResult = await fcl
          .mutate({
            cadence: setupExampleNFTCollection,
            limit: 9999,
            authz: flow.authz,
          } as any)
          .then((txId) => fcl.tx(txId).onceSealed());

        if (nftSetupResult.errorMessage) {
          throw new Error(nftSetupResult.errorMessage);
        }

        const ownedAccountSetupResult = await fcl
          .mutate({
            cadence: setupOwnedAccount,
            limit: 9999,
            authz: flow.authz,
          } as any)
          .then((txId) => fcl.tx(txId).onceSealed());

        if (ownedAccountSetupResult.errorMessage) {
          throw new Error(ownedAccountSetupResult.errorMessage);
        }

        router.replace("/");
      })
      .catch(() => {
        setMessage("An error has occurred");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.magic]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ marginLeft: "auto", marginRight: "auto" }}>
        <Heading>{message}</Heading>
      </div>
    </div>
  );
}

export default OAuthPage;
