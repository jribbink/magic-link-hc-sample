import { useEffect, useState } from "react";
import { FlowProvider, useFlow } from "../contexts/FlowContext";
import setupOwnedAccount from "../cadence/transactions/hybrid-custody/setup-owned-account.cdc";
import * as fcl from "@onflow/fcl";

function OAuthPage() {
  return (
    <FlowProvider>
      <OAuthConsumer />
    </FlowProvider>
  );
}

function OAuthConsumer() {
  const flow = useFlow();
  const [isSettingUp, setIsSettingUp] = useState(false);

  useEffect(() => {
    if (!flow.magic) return;
    flow.magic.oauth
      .getRedirectResult()
      .catch(() => {})
      .then(async () => {
        // TODO: only do this first setup if the account doesn't exist
        await fcl
          .mutate({
            cadence: setupOwnedAccount,
            limit: 9999,
            authz: flow.authz,
          } as any)
          .then((res) => {
            setIsSettingUp(true);
            return fcl.tx(res).onceSealed;
          });

        window.location.replace("/");
      });
  }, [flow.magic, flow.authz]);
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ marginLeft: "auto", marginRight: "auto" }}>
        {isSettingUp ? (
          <h1>Setting up your account...</h1>
        ) : (
          <h1>Logging in...</h1>
        )}
      </div>
    </div>
  );
}

OAuthPage.getLayout = function getLayout(page) {
  return page;
};

export default OAuthPage;
