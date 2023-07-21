import navbarStyles from "../styles/Navbar.module.css";
import elementStyles from "../styles/Elements.module.css";
import { FlowContext } from "../contexts/FlowContext";
import { useContext } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon, InfoIcon } from "@chakra-ui/icons";
import SignInModal from "./SignInModal";
import LinkedAccountsModal from "./LinkedAccountsModal";
import FundAccountModal from "./FundAccountModal";
import { useBalance } from "../hooks/useBalance";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const flow = useContext(FlowContext);
  const { balance } = useBalance(flow.userMetadata?.publicAddress);
  const {
    isOpen: isSignInOpen,
    onClose: onSignInClose,
    onOpen: showSignIn,
  } = useDisclosure();
  const {
    isOpen: isLinkedAccountsOpen,
    onClose: onLinkedAccountsClose,
    onOpen: showLinkedAccounts,
  } = useDisclosure();
  const {
    isOpen: isFundAccountOpen,
    onClose: onFundAccountClose,
    onOpen: showFundAccount,
  } = useDisclosure();

  const parentMode = router.pathname === "/parent";

  return (
    <>
      <Flex w="full" padding={4} borderBottom="1px" alignItems="center">
        <Heading size="lg" mr="auto">
          Flow HC Magic Link
        </Heading>
        <Flex ml="auto" gap={2} mx={4} alignItems="center">
          <Text>{parentMode ? "Parent Mode" : "Child Mode"}</Text>

          <Switch
            size="lg"
            isChecked={parentMode}
            onChange={() => {
              if (parentMode) {
                router.push("/");
              } else {
                router.push("/parent");
              }
            }}
          ></Switch>
        </Flex>
        <Box>
          {flow.isLoggedIn === null ? (
            <div className={navbarStyles.address}>Loading...</div>
          ) : flow.isLoggedIn === false ? (
            <button onClick={showSignIn} className={elementStyles.button}>
              Sign In
            </button>
          ) : (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {flow.userMetadata?.email}
              </MenuButton>
              <MenuList>
                {balance ? <MenuItem>{balance} FLOW</MenuItem> : null}
                <MenuItem onClick={() => showLinkedAccounts()}>
                  Linked Accounts
                </MenuItem>
                <MenuItem onClick={() => showFundAccount()}>
                  Fund Account
                </MenuItem>
                <MenuItem onClick={() => flow.logout()}>Logout</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Box>
      </Flex>

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => onSignInClose()}
      ></SignInModal>
      <LinkedAccountsModal
        isOpen={isLinkedAccountsOpen}
        onClose={onLinkedAccountsClose}
      ></LinkedAccountsModal>
      <FundAccountModal
        isOpen={isFundAccountOpen}
        onClose={onFundAccountClose}
      ></FundAccountModal>
    </>
  );
}
