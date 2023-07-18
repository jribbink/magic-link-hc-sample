import navbarStyles from "../styles/Navbar.module.css";
import elementStyles from "../styles/Elements.module.css";
import { FlowContext } from "../contexts/FlowContext";
import { useContext } from "react";
import { AccountList } from "./AccountList";

export default function Navbar() {
  const flow = useContext(FlowContext);

  return (
    <div className={navbarStyles.navbar}>
      <AccountList></AccountList>
      {flow.isLoggedIn === null ? (
        <div className={navbarStyles.address}>Loading...</div>
      ) : flow.isLoggedIn === false ? (
        <button onClick={() => flow.login()} className={elementStyles.button}>
          Log In With Wallet
        </button>
      ) : (
        <>
          <div className={navbarStyles.address}>
            {flow.userMetadata?.publicAddress}
          </div>
          <button onClick={flow.logout} className={elementStyles.button}>
            Log Out
          </button>
        </>
      )}
    </div>
  );
}
