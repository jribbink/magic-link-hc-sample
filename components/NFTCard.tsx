import { Button, Card, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import { NFTDisplayData } from "../hooks/useNFTs";
import { useState } from "react";

interface NFTCardProps {
  nft: NFTDisplayData;
  onDestroyNft: () => Promise<void>;
}

function NFTCard({ nft, onDestroyNft }: NFTCardProps) {
  const [isDestroying, setIsDestroying] = useState<boolean>(false);

  function destroyNFT() {
    setIsDestroying(true);
    onDestroyNft().finally(() => {
      setIsDestroying(false);
    });
  }

  return (
    <Card size="lg" display="flex" flexDir="column">
      <Image
        roundedTop="lg"
        src={nft.thumbnail.url}
        alt={nft.name}
        width="100%"
      />
      <Flex flexDir="column" padding="2" height={110}>
        <Text fontWeight="bold">{nft.name}</Text>
        <Text>{nft.description}</Text>

        <Button
          variant="ghost"
          colorScheme="red"
          onClick={() => destroyNFT()}
          mt="auto"
          disabled={isDestroying}
        >
          {isDestroying ? (
            <>
              <Text>Destroying</Text>
              <Spinner colorScheme="red" ml="2" />
            </>
          ) : (
            <Text>Destroy NFT</Text>
          )}
        </Button>
      </Flex>
    </Card>
  );
}

export default NFTCard;
