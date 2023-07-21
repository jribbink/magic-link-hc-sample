import useSWR from "swr";
import * as fcl from "@onflow/fcl";
import { useFlow } from "../contexts/FlowContext";
import listNFTs from "../cadence/scripts/example-nft/list_nfts.cdc";

export interface NFTDisplayData {
  name: string;
  description: string;
  thumbnail: { url: string };
}

export function useNFTs() {
  const flow = useFlow();
  const address = flow.userMetadata?.publicAddress;

  const { data, error, mutate } = useSWR(
    address ? ["listNFTs", address] : null,
    async ([_, account]) => {
      return (await fcl.query({
        cadence: listNFTs,
        args: (arg, t) => [arg(account, t.Address)],
      })) as { [id: string]: NFTDisplayData };
    }
  );

  return {
    nfts: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
