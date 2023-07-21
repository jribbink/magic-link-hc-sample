import { useEffect, useState } from "react";
import NFTGrid from "../components/NFTGrid";
import { useChildNFTs } from "../hooks/useChildNFTs";
import * as fcl from "@onflow/fcl";
import { CurrentUser } from "@onflow/typedefs";
import mintNFTCadence from "../cadence/transactions/example-nft/mint_nft.cdc";
import destroyChildNFTCadence from "../cadence/transactions/example-nft/destroy_child_nft.cdc";
import { Flex, Heading } from "@chakra-ui/react";

function ParentPage() {
  const [address, setAddress] = useState<string | null>(null);
  const { nfts, mutate: mutateNFTs } = useChildNFTs(address);

  useEffect(() => {
    const unsubscribe = (async function setup(): Promise<Function> {
      // hack to clear out the current user
      delete (globalThis as any).FCL_REGISTRY.CURRENT_USER;

      // set up the FCL storage to use a different prefix to isolate the parent and child account views
      const prefix = "fcl-parent-mode/";
      fcl.config().put("fcl.storage", {
        get: (key: string) =>
          JSON.parse(localStorage.getItem(prefix + key) || "null"),
        put: (key: string, value: any) =>
          localStorage.setItem(prefix + key, JSON.stringify(value)),
        can: () => window !== undefined,
      });

      await fcl.currentUser().snapshot();

      return fcl.currentUser().subscribe((user: CurrentUser) => {
        if (user?.loggedIn) {
          setAddress(user?.addr || null);
        } else {
          setAddress(null);
        }
      });
    })();

    return () => {
      fcl.config().delete("fcl.storage");
      fcl.currentUser().snapshot();
      unsubscribe.then((x) => x());
    };
  }, []);

  async function mintChildNFT(childAddr: string) {
    return fcl
      .mutate({
        cadence: mintNFTCadence,
        limit: 9999,
        args: (arg: any, t: any) => [arg(childAddr, t.Optional(t.Address))],
      } as any)
      .then((txId) => fcl.tx(txId).onceSealed())
      .then((status) => {
        if (status.errorMessage) {
          throw new Error(status.errorMessage);
        }
        mutateNFTs();
      });
  }

  async function destroyChildNFT(childAddr: string, id: string) {
    return fcl
      .mutate({
        cadence: destroyChildNFTCadence,
        limit: 9999,
        args: (arg: any, t: any) => [
          arg(childAddr, t.Address),
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

  return (
    <Flex flexDirection="column">
      <Heading>Parent/Wallet Account</Heading>
      {Object.keys(nfts).map((childAddress) => (
        <NFTGrid
          key={childAddress}
          headingText={`Child ${childAddress} NFTs`}
          nfts={nfts[childAddress]}
          onMintNFT={() => mintChildNFT(childAddress)}
          onDestroyNFT={(id) => destroyChildNFT(childAddress, id)}
        ></NFTGrid>
      ))}
    </Flex>
  );
}

export default ParentPage;
