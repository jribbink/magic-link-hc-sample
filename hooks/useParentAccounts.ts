import * as fcl from "@onflow/fcl";
import useSWR from "swr";
import getParentsFromChild from "../cadence/scripts/hybrid-custody/get_parents_from_child.cdc";
import { useFlow } from "../contexts/FlowContext";

export function useParentAccounts() {
  const flow = useFlow();
  const address: string | null = flow.userMetadata?.publicAddress || null;
  const { data, error, mutate } = useSWR(
    address ? ["useParentAccounts", address] : null,
    async ([_, address]) => {
      const addresses: { [addr: string]: Boolean } = await fcl.query({
        cadence: getParentsFromChild,
        args: (arg, t) => [arg(address, t.Address)],
      });

      // Filter out parents which have not accepted child account
      // This isn't really relevant as we use a multi-sig transaction,
      // however it is good practice
      return Object.keys(addresses).filter((addr) => addresses[addr]);
    }
  );

  return {
    parentAccounts: data,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  };
}
