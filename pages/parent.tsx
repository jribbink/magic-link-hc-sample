import { use, useEffect, useState } from "react";
import NFTGrid from "../components/NFTGrid";
import { useChildNFTs } from "../hooks/useChildNFTs";
import * as fcl from "@onflow/fcl";
import { CurrentUser } from "@onflow/typedefs";
import { useFlow } from "../contexts/FlowContext";
import destroyChildNFTCadence from "../cadence/transactions/example-nft/destroy_child_nft.cdc";

function ParentPage() {
  const flow = useFlow();
  const [address, setAddress] = useState<string | null>(null);
  const { nfts, mutate: mutateNFTs } = useChildNFTs(address);

  useEffect(() => {
    const prefix = "fcl-parent-mode/";
    fcl.config().put("fcl.storage", {
      get: (key: string) =>
        JSON.parse(sessionStorage.getItem(prefix + key) || "null"),
      put: (key: string, value: any) =>
        sessionStorage.setItem(prefix + key, JSON.stringify(value)),
      can: () => window !== undefined,
    });

    const unsubscribe = fcl.currentUser().subscribe((user: CurrentUser) => {
      if (user?.loggedIn) {
        setAddress(user?.addr || null);
      } else {
        setAddress(null);
      }
    });

    return () => {
      fcl.config().delete("fcl.storage");
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    fcl.authenticate();
  }, []);

  async function destroyChildNFT(id: string) {
    return fcl
      .mutate({
        cadence: destroyChildNFTCadence,
        limit: 9999,
        args: (arg: any, t: any) => [
          arg(flow.userMetadata?.publicAddress, t.Address),
          arg(id, t.UInt64),
        ],
      } as any)
      .then((txId) => fcl.tx(txId).onceSealed())
      .then((status) => {
        if (status.errorMessage) {
          throw new Error(status.errorMessage);
        }
        mutateNFTs();
      });
  }

  if (!nfts) return null;

  return Object.keys(nfts).map((childAccount) => (
    <NFTGrid
      key={childAccount}
      headingText={`NFTs for ${childAccount}`}
      nfts={nfts[childAccount]}
      onMintNFT={() => {}}
      onDestroyNFT={(id) => destroyChildNFT(id)}
    ></NFTGrid>
  ));
}

export default ParentPage;
