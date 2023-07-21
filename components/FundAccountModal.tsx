import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useFlow } from "../contexts/FlowContext";
import { useState } from "react";
import transferTokens from "../cadence/transactions/flowToken/transfer_tokens.cdc";
import * as fcl from "@onflow/fcl";

interface FundAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FundAccountModal({
  isOpen,
  onClose,
}: FundAccountModalProps) {
  const flow = useFlow();
  const [amount, setAmount] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<string>("");

  function fundAccount(amount: number) {
    fcl.unauthenticate();

    setStatus("Authenticating");
    fcl
      .mutate({
        cadence: transferTokens,
        limit: 9999,
        args: (arg, t) => [
          arg(amount.toFixed(8), t.UFix64),
          arg(flow.userMetadata?.publicAddress, t.Address),
        ],
      })
      .then((txId) =>
        fcl.tx(txId).subscribe((status) => {
          const statusString = status.statusString as unknown as string;
          if (!statusString) return;

          if (statusString === "SEALED") {
            setStatus("");
            onClose();
            return;
          }

          setStatus(
            statusString.at?.(0)?.toUpperCase() +
              statusString.slice(1).toLowerCase()
          );
        })
      );
  }

  const isInvalid = touched && !amount;

  return (
    <Modal isOpen={isOpen} onClose={onClose} trapFocus={false}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Fund Account</ModalHeader>
        {status ? (
          <ModalBody display="flex" flexDirection="column" mb={4} gap="4">
            <Spinner size="lg" mx="auto"></Spinner>
            <Text mx="auto">Transaction {status}...</Text>
          </ModalBody>
        ) : (
          <>
            <ModalBody
              display="flex"
              flexDirection="column"
              gap="4"
              alignItems="center"
            >
              <Text>How much FLOW would you like to send to this account?</Text>
              <Input
                placeholder="Amount"
                isInvalid={isInvalid}
                onFocus={() => setTouched(true)}
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
              />
            </ModalBody>
            <ModalFooter gap="2">
              <Button onClick={onClose} colorScheme="red">
                Cancel
              </Button>
              <Button
                onClick={() => fundAccount(Number(amount))}
                disabled={isInvalid}
                colorScheme="blue"
              >
                Send
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
