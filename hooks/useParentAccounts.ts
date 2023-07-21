import * as fcl from "@onflow/fcl";
import useSWR from "swr";
import getParentsFromChild from "../cadence/scripts/hybrid-custody/get-parents-from-child.cdc";
import { useFlow } from "../contexts/FlowContext";

export function useParentAccounts() {
  const flow = useFlow();
  const address: string | null = flow.userMetadata?.publicAddress || null;
  const { data, error, mutate } = useSWR(
    address ? ["useParentAccounts", address] : null,
    async ([_, address]) => {
      return fcl
        .query({
          cadence: getParentsFromChild,
          args: (arg, t) => [arg(address, t.Address)],
        })
        .then((res: { [addr: string]: string }) =>
          Object.keys(res).filter(Boolean)
        );
    }
  );

  return {
    parentAccounts: data,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  };
}
