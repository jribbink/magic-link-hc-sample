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
import { OAuthProvider } from "@magic-ext/oauth";
import { useParentAccounts } from "../hooks/useParentAccounts";
import * as fcl from "@onflow/fcl";
import setupMultiSig from "../cadence/transactions/hybrid-custody/setup-multi-sig.cdc";
import removeParentFromChild from "../cadence/transactions/hybrid-custody/remove_parent_from_child.cdc";

interface OAuthProviderItem {
  name: string;
  icon: string;
  provider: OAuthProvider;
}

interface LinkedAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LinkedAccountsModal({
  isOpen,
  onClose,
}: LinkedAccountsModalProps) {
  const { parentAccounts } = useParentAccounts();
  const flow = useFlow();

  function linkAccount() {
    fcl.unauthenticate();

    const parentAuthz = fcl.currentUser().authorization;
    const childAuthz = flow.authz;
    const adminAddress = "0x4166e410aa50e468";

    fcl
      .mutate({
        cadence: setupMultiSig,
        limit: 9999,
        payer: parentAuthz,
        proposer: parentAuthz,
        authorizations: [childAuthz, parentAuthz],
        args: (arg: any, t: any) => [
          arg(null, t.Optional(t.Address)),
          arg(adminAddress, t.Address),
          arg(adminAddress, t.Address),
        ],
      } as any)
      .then((tx) => fcl.tx(tx).onceSealed);
  }

  function unlinkAccount(addr: string) {
    fcl.mutate({
      cadence: removeParentFromChild,
      limit: 9999,
      authz: flow.authz,
      args: (arg: any, t: any) => [arg(addr, t.Address)],
    } as any);
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
                    >
                      Unlink
                    </Button>
                  </Flex>
                ))}
                <Button colorScheme="blue" onClick={() => linkAccount()}>
                  Link New Account
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
