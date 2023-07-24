/*
  This page is used to demonstrate how to use a parent account (wallet) to
  create/destroy NFT resources on child (app) accounts. This functionality would
  likely not be a part of your hybrid custody app, however it is useful for demo
  purposes.

  In reality, this would be done by either the wallet, an external marketplace,
  or some other dApp that the wallet would connect to.

  It can be removed from the app by deleting this file
*/

import { useEffect, useState } from "react";
import NFTGrid from "../components/NFTGrid";
import { useChildNFTs } from "../hooks/useChildNFTs";
import * as fcl from "@onflow/fcl";
import { CurrentUser } from "@onflow/typedefs";
import mintNFTCadence from "../cadence/transactions/example-nft/mint_nft.cdc";
import destroyChildNFTCadence from "../cadence/transactions/example-nft/destroy_child_nft.cdc";
import { Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";

function ParentPage() {
  const [address, setAddress] = useState<string | null>(null);
  const { nfts, mutate: mutateNFTs } = useChildNFTs(address);

  useEffect(() => {
    const unsubscribe = (async function setup(): Promise<Function> {
      // Hack to clear out the current user
      delete (globalThis as any).FCL_REGISTRY.CURRENT_USER;

      // Set up the FCL storage to use a different prefix to isolate the parent and child account views
      const prefix = "fcl-parent-mode/";
      fcl.config().put("fcl.storage", {
        get: (key: string) =>
          JSON.parse(localStorage.getItem(prefix + key) || "null"),
        put: (key: string, value: any) =>
          localStorage.setItem(prefix + key, JSON.stringify(value)),
        can: () => window !== undefined,
      });

      // Make sure the currentUser is cleared out
      await fcl.currentUser().snapshot();

      // Subscribe to the currentUser to get the address
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

  return (
    <Flex flexDirection="column" gap={8}>
      <Heading>Parent Account (Wallet)</Heading>

      <Text>
        In this mode, transactions are signed by your wallet account in order to
        create/destroy NFT resources on child (app) accounts.{" "}
        <b>Approvals are required</b> for transactions since they are signed by
        your wallet account.
      </Text>

      {address ? (
        nfts ? (
          Object.keys(nfts).map((childAddress) => (
            <NFTGrid
              key={childAddress}
              headingText={`Child ${childAddress}`}
              nfts={nfts[childAddress]}
              onMintNFT={() => mintChildNFT(childAddress)}
              onDestroyNFT={(id) => destroyChildNFT(childAddress, id)}
            ></NFTGrid>
          ))
        ) : (
          <Flex flexDir="column" alignItems="center">
            <Spinner size="lg"></Spinner>
          </Flex>
        )
      ) : (
        <Flex flexDirection="column" gap={4} pt={4}>
          <Flex justifyContent="center">
            <Text fontWeight="bold" fontSize="lg">
              To get started, you must connect a wallet
            </Text>
          </Flex>
          <Flex justifyContent="center">
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => fcl.authenticate()}
            >
              Connect Wallet
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}

function ParentModeNavigation() {
  return (
    <Flex
      padding={4}
      borderBottom="1px"
      borderColor="gray.200"
      alignItems="center"
      position="fixed"
      top="0"
      left="0"
      right="0"
      height="75"
      backgroundColor="white"
      zIndex="1000"
    ></Flex>
  );
}

export default ParentPage;
