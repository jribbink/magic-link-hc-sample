import { useEffect, useState } from "react";
import { useFlow } from "../contexts/FlowContext";
import { useRouter } from "next/router";

import { Heading } from "@chakra-ui/react";

function OAuthPage() {
  const router = useRouter();
  const flow = useFlow();
  const [message, setMessage] = useState("Logging in with Magic...");

  useEffect(() => {
    if (!flow.magic) return;
    flow.magic.oauth
      .getRedirectResult()
      .then(async (res) => {
        // TODO: only do this first setup if the account doesn't exist
        setMessage("Setting up your account...");

        await flow.setupAccount(res.magic.userMetadata.publicAddress!);

        router.replace("/");
      })
      .catch((e) => {
        console.error(e);
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
