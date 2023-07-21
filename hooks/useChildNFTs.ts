import useSWR from "swr";
import * as fcl from "@onflow/fcl";
import listChildNFTs from "../cadence/scripts/example-nft/list_child_nfts.cdc";

export interface NFTDisplayData {
  name: string;
  description: string;
  thumbnail: { url: string };
}

export function useChildNFTs(address: string | null) {
  const { data, error, mutate } = useSWR(
    address ? ["listChildNFTs", address] : null,
    async ([_, account]) => {
      return (await fcl.query({
        cadence: listChildNFTs,
        args: (arg, t) => [arg(account, t.Address)],
      })) as {
        [address: string]: { [id: string]: NFTDisplayData };
      };
    }
  );

  return {
    nfts: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
