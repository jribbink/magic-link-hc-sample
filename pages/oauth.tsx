/*
  This page is used to handle the OAuth redirect from Magic.
  From here we will setup the user's account and redirect them to the home page.
*/

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
        // Trigger a user metadata refresh
        flow.refreshLogin();

        setMessage("Setting up your account...");
        await flow.setupAccount(res.magic.userMetadata.publicAddress!);

        // Redirect to home page
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
