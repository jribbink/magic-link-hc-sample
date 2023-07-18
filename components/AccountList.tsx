import { useFlow } from "../contexts/FlowContext";
import { useParentAccounts } from "../hooks/useParentAccounts";
import * as fcl from "@onflow/fcl";
import setupMultiSig from "../cadence/transactions/hybrid-custody/setup-multi-sig.cdc";

export function AccountList() {
  const flow = useFlow();
  const { parentAccounts } = useParentAccounts();

  function unlink(addr: string) {}

  function linkAccount() {
    fcl.unauthenticate();
    fcl.authenticate().then(async (user) => {
      const parentAuthz = fcl.currentUser().authorization;
      const childAuthz = flow.authz;

      const adminAddress = "0x0efb008eb5b89b1b";

      fcl
        .mutate({
          cadence: setupMultiSig,
          limit: 9999,
          payer: parentAuthz,
          proposer: parentAuthz,
          authorizations: [childAuthz, parentAuthz],
          args: (arg, t) => [
            arg(null, t.Optional(t.Address)),
            arg(adminAddress, t.Address),
            arg(adminAddress, t.Address),
          ],
        } as any)
        .then((tx) => fcl.tx(tx).onceSealed);
    });
  }

  const dropbtnStyle: React.CSSProperties = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "16px",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
  };

  const dropdownStyle = {
    position: "relative" as React.CSSProperties["position"],
    display: "inline-block",
    "&:hover": {
      display: "block",
    },
  };

  const dropdownLinkStyle = {
    color: "black",
    padding: "12px 16px",
    textDecoration: "none",
    display: "block",
    "&:hover": {
      "background-color": "#f1f1f1",
    },
  };

  const dropdownContentStyle = {
    display: "block",
  };

  if (!parentAccounts) {
    return null;
  }

  return (
    <div style={dropbtnStyle}>
      <button style={dropdownStyle}>Dropdown</button>
      <div style={dropdownContentStyle}>
        {parentAccounts.map((addr) => {
          return (
            <div style={dropdownLinkStyle} key={addr}>
              <p>{addr}</p>
              <button>unlink</button>
            </div>
          );
        })}
        <div style={dropdownLinkStyle}>
          <button onClick={linkAccount}>
            <p>Link</p>
          </button>
        </div>
      </div>
    </div>
  );
}
