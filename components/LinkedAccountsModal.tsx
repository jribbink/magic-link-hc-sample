import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useFlow } from "../contexts/FlowContext";
import { useParentAccounts } from "../hooks/useParentAccounts";
import * as fcl from "@onflow/fcl";
import setupMultiSig from "../cadence/transactions/hybrid-custody/setup-multi-sig.cdc";
import removeParentFromChild from "../cadence/transactions/hybrid-custody/remove_parent_from_child.cdc";
import { useState } from "react";
import { ADMIN_ACCOUNT_ADDRESS } from "../config/admin-account";

interface LinkedAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LinkedAccountsModal({
  isOpen,
  onClose,
}: LinkedAccountsModalProps) {
  const flow = useFlow();
  const { parentAccounts, mutate: mutateParentAccounts } = useParentAccounts();

  // State variables for transaction progress spinners
  const [isLinking, setIsLinking] = useState(false);
  const [isRemovingIdx, setIsRemovingIdx] = useState<number>(-1);

  async function linkAccount() {
    // Show a spinner next to the "Link New Account" button
    setIsLinking(true);

    // Make sure that FCL is unauthenticated before we try to link a new account
    fcl.unauthenticate();

    const parentAuthz = fcl.currentUser().authorization;
    const childAuthz = flow.authz;

    // This transaction will link the parent account to the child account
    // This uses the multi-sig approach in order to establish this link, however
    // this can be done in two steps if needed for your use case.
    await fcl
      .mutate({
        cadence: setupMultiSig,
        limit: 9999,
        payer: parentAuthz,
        proposer: parentAuthz,
        authorizations: [childAuthz, parentAuthz],
        args: (arg: any, t: any) => [
          arg(null, t.Optional(t.Address)),
          arg(ADMIN_ACCOUNT_ADDRESS, t.Address),
          arg(ADMIN_ACCOUNT_ADDRESS, t.Address),
        ],
      } as any)
      .then((tx) => fcl.tx(tx).onceSealed())
      .finally(() => {
        // Reset the spinner
        setIsLinking(false);
        // Refresh the parent account list
        mutateParentAccounts();
      });
  }

  async function unlinkAccount(addr: string) {
    // Show a spinner next to the account that is being unlinked
    setIsRemovingIdx(parentAccounts!.indexOf(addr));

    await fcl
      .mutate({
        cadence: removeParentFromChild,
        limit: 9999,
        authz: flow.authz,
        args: (arg: any, t: any) => [arg(addr, t.Address)],
      } as any)
      .then((tx) => fcl.tx(tx).onceSealed())
      .finally(() => {
        // Refresh the parent account list
        mutateParentAccounts();
        // Reset the spinner
        setIsRemovingIdx(-1);
      });
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} trapFocus={false}>
        <ModalOverlay />
        <ModalContent p="4">
          <ModalHeader>Linked Accounts</ModalHeader>
          <ModalBody display="flex" flexDirection="column">
            {parentAccounts ? (
              <Flex flexDir="column" gap={4}>
                {parentAccounts.map((parentAddr) => (
                  <Flex key={parentAddr}>
                    <Text fontSize="xl" my="auto">
                      {parentAddr}
                    </Text>
                    <Button
                      ml="auto"
                      onClick={() => unlinkAccount(parentAddr)}
                      colorScheme="red"
                      disabled={isRemovingIdx !== -1}
                    >
                      {isRemovingIdx === parentAccounts.indexOf(parentAddr) ? (
                        <>
                          <Text>Unlinking</Text>
                          <Spinner colorScheme="red" ml="2" />
                        </>
                      ) : (
                        <Text>Unlink</Text>
                      )}
                    </Button>
                  </Flex>
                ))}
                <Button
                  colorScheme="blue"
                  onClick={() => linkAccount()}
                  disabled={isLinking}
                >
                  {isLinking ? (
                    <>
                      <Text>Linking (this many take some time)</Text>
                      <Spinner colorScheme="blue" ml="2" />
                    </>
                  ) : (
                    <Text>Link New Account</Text>
                  )}
                </Button>
              </Flex>
            ) : (
              <Spinner></Spinner>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
