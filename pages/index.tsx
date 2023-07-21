import Head from "next/head";
import { useFlow } from "../contexts/FlowContext";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useNFTs } from "../hooks/useNFTs";
import NFTGrid from "../components/NFTGrid";
import { useRouter } from "next/router";
import mintNFTCadence from "../cadence/transactions/example-nft/mint_nft.cdc";
import destroyNFTCadence from "../cadence/transactions/example-nft/destroy_nft.cdc";
import * as fcl from "@onflow/fcl";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const flow = useFlow();
  const { nfts, mutate: mutateNFTs } = useNFTs();

  async function mintNFT() {
    return fcl
      .mutate({
        cadence: mintNFTCadence,
        limit: 9999,
        authz: flow.authz,
      } as any)
      .then((txId) => fcl.tx(txId).onceSealed())
      .then((status) => {
        if (status.errorMessage) {
          throw new Error(status.errorMessage);
        }
        mutateNFTs();
      });
  }

  async function destroyNFT(id: string) {
    return fcl
      .mutate({
        cadence: destroyNFTCadence,
        limit: 9999,
        authz: flow.authz,
        args: (arg: any, t: any) => [arg(id, t.UInt64)],
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
    <>
      <Flex flexDirection="column" gap={8}>
        <NFTGrid
          nfts={nfts}
          onMintNFT={mintNFT}
          onDestroyNFT={(id) => destroyNFT(id)}
        ></NFTGrid>
        <Box>
          <Heading size="md" pb="4">
            What&apos;s happening?
          </Heading>
          <Text>
            You are currently viewing your NFTs on the &quot;child account&quot;
            which has been transparently generated by the application.
          </Text>
          <Text>
            <Button
              variant="link"
              colorScheme="blue"
              onClick={() => router.push("/parent")}
            >
              Click here
            </Button>{" "}
            to switch to the &quot;parent account&quot; which is the account you
            logged in with.
          </Text>
        </Box>
      </Flex>
      <Head>
        <title>FCL Next Scaffold</title>
        <meta
          name="description"
          content="FCL Next Scaffold for the Flow Blockchain"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
}

/*

      <main className={styles.main}>
        <h1>Magic Link Hybrid Custody Scaffold</h1>

        <p className={styles.description}>For the Flow Blockchain</p>

        <p>To get started, use one of the login/sign up providers below:</p>

        <h2>Some useful resources...</h2>
        <Links />
      </main>*/
