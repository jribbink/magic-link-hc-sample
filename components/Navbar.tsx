import { FlowContext } from "../contexts/FlowContext";
import { useContext, useEffect, useState } from "react";
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
import { ChevronDownIcon } from "@chakra-ui/icons";
import LinkedAccountsModal from "./LinkedAccountsModal";
import { useBalance } from "../hooks/useBalance";
import { useRouter } from "next/router";
import * as fcl from "@onflow/fcl";
import { CurrentUser } from "@onflow/typedefs";

export default function Navbar() {
  const router = useRouter();
  const flow = useContext(FlowContext);
  const { balance } = useBalance(flow.userMetadata?.publicAddress);
  const {
    isOpen: isLinkedAccountsOpen,
    onClose: onLinkedAccountsClose,
    onOpen: showLinkedAccounts,
  } = useDisclosure();

  const parentMode = router.pathname === "/parent";

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const { balance: parentBalance } = useBalance(currentUser?.addr);

  useEffect(() => {
    const unsub = fcl.currentUser().subscribe((user: CurrentUser) => {
      if (!user?.loggedIn) {
        setCurrentUser(null);
        return;
      }

      setCurrentUser(user);
    });

    return () => unsub();
  });

  return (
    <>
      <Flex
        padding={4}
        borderBottom="1px"
        borderColor="gray.200"
        alignItems="center"
        position="fixed"
        top="0"
        left="0"
        right="0"
        height="75"
        backgroundColor="white"
        zIndex="1000"
      >
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
        {router.pathname === "/oauth" ? null : !parentMode ? (
          <Box>
            {flow.isLoggedIn === null ? (
              <Box>Loading...</Box>
            ) : flow.isLoggedIn === false ? (
              <Button colorScheme="blue" onClick={() => flow.login()}>
                Login/Signup
              </Button>
            ) : (
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  {flow.userMetadata?.email}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => showLinkedAccounts()}>
                    Linked Accounts
                  </MenuItem>
                  <MenuItem onClick={() => flow.logout()}>Logout</MenuItem>
                </MenuList>
              </Menu>
            )}
          </Box>
        ) : currentUser?.loggedIn ? (
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {currentUser?.addr}
            </MenuButton>
            <MenuList>
              {parentBalance ? <MenuItem>{parentBalance} FLOW</MenuItem> : null}
              <MenuItem onClick={() => fcl.unauthenticate()}>Logout</MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Button colorScheme="blue" onClick={() => fcl.authenticate()}>
            Connect Wallet
          </Button>
        )}
      </Flex>

      <LinkedAccountsModal
        isOpen={isLinkedAccountsOpen}
        onClose={onLinkedAccountsClose}
      ></LinkedAccountsModal>
    </>
  );
}
