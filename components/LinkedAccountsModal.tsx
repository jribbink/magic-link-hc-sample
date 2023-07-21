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
import { useState } from "react";

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
  const flow = useFlow();
  const { parentAccounts, mutate: mutateParentAccounts } = useParentAccounts();

  const [isLinking, setIsLinking] = useState(false);
  const [isRemovingIdx, setIsRemovingIdx] = useState<number>(-1);

  function linkAccount() {
    setIsLinking(true);

    fcl.unauthenticate();

    const parentAuthz = fcl.currentUser().authorization;
    const childAuthz = flow.authz;
    const adminAddress = "0x140207fa2310a369";

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
      .then((tx) => fcl.tx(tx).onceSealed())
      .finally(() => {
        setIsLinking(false);
        mutateParentAccounts();
      });
  }

  function unlinkAccount(addr: string) {
    setIsRemovingIdx(parentAccounts!.indexOf(addr));

    fcl
      .mutate({
        cadence: removeParentFromChild,
        limit: 9999,
        authz: flow.authz,
        args: (arg: any, t: any) => [arg(addr, t.Address)],
      } as any)
      .then((tx) => fcl.tx(tx).onceSealed())
      .finally(() => {
        mutateParentAccounts();
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
