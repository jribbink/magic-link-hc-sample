import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import NFTCard from "./NFTCard";
import { NFTDisplayData } from "../hooks/useNFTs";
import { useState } from "react";

interface NFTGridProps {
  nfts?: { [id: string]: NFTDisplayData };
  onMintNFT: () => Promise<void>;
  onDestroyNFT: (id: string) => Promise<void>;
  headingText?: string;
}

export default function NFTGrid({
  nfts,
  onMintNFT,
  onDestroyNFT,
  headingText,
}: NFTGridProps) {
  const [pendingNFT, setPendingNFT] = useState<number>(0);

  function handleMintNFT() {
    setPendingNFT((prev) => prev + 1);
    onMintNFT().finally(() => {
      setPendingNFT((prev) => prev - 1);
    });
  }

  return (
    <Flex flexDirection="column" gap={4}>
      <Flex flexDir="row" justifyContent="space-between" alignItems="center">
        <Heading size="md" mb="4" my="auto">
          {headingText || "My NFTs"}
        </Heading>
        <Button onClick={handleMintNFT} colorScheme="green" alignItems="center">
          <AddIcon mr="2" />
          <Text>Mint New NFT</Text>
        </Button>
      </Flex>

      {nfts ? (
        <SimpleGrid columns={3} spacing="4">
          {Object.entries(nfts).map(([id, nft]) => (
            <NFTCard key={id} nft={nft} onDestroyNft={() => onDestroyNFT(id)} />
          ))}
          {pendingNFT ? (
            <Card
              size="lg"
              height={300}
              display="flex"
              flexDir="column"
              justifyContent="center"
              alignItems="center"
              gap={2}
            >
              <Spinner size="lg"></Spinner>
              <Text>Minting NFT</Text>
            </Card>
          ) : null}
        </SimpleGrid>
      ) : (
        <Flex height="300" justifyContent="center">
          <Spinner size="xl" my="auto" />
        </Flex>
      )}
    </Flex>
  );
}
