import useSWR from "swr";
import * as fcl from "@onflow/fcl";
import getBalance from "../cadence/scripts/flow-token/get_balance.cdc";

const KEY = (address?: string | null) =>
  address ? `getBalance(${address})` : null;

export function useBalance(address?: string | null) {
  const { data, error, mutate } = useSWR<string>(KEY(address), async () => {
    return fcl.query({
      cadence: getBalance,
      args: (arg, t) => [arg(address, t.Address)],
    });
  });

  return {
    balance: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
