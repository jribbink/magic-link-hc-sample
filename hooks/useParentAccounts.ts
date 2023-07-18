import * as fcl from "@onflow/fcl";
import useSWR from "swr";
import getParentsFromChild from "../cadence/scripts/hybrid-custody/get-parents-from-child.cdc";
import { useFlow } from "../contexts/FlowContext";

const KEY = (address: string) => "getParentsFromChild(" + address + ")";

export function useParentAccounts() {
  const flow = useFlow();
  const { data, error } = useSWR(KEY, async () => {
    return fcl
      .query({
        cadence: getParentsFromChild,
        args: (arg, t) => [arg(flow.userMetadata.publicAddress, t.Address)],
      })
      .then((res: { [addr: string]: string }) =>
        Object.keys(res).filter(Boolean)
      );
  });

  return {
    parentAccounts: data,
    isLoading: !error && !data,
    isError: error,
  };
}
