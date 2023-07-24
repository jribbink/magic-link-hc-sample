import {
  Button,
  Divider,
  Flex,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFlow } from "../contexts/FlowContext";
import { OAuthProvider } from "@magic-ext/oauth";
import { MagicUserMetadata } from "magic-sdk";

interface OAuthProviderItem {
  name: string;
  icon: string;
  provider: OAuthProvider;
}

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  loginEmail: (email: string) => Promise<MagicUserMetadata | undefined>;
  loginOAuth: (provider: OAuthProvider) => Promise<void>;
}

export default function SignInModal({
  isOpen,
  onClose,
  loginEmail,
  loginOAuth,
}: SignInModalProps) {
  const flow = useFlow();
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const providers: OAuthProviderItem[] = [
    {
      name: "Google",
      icon: "/assets/google.png",
      provider: "google",
    },
    {
      name: "Facebook",
      icon: "/assets/facebook.png",
      provider: "facebook",
    },
  ];

  function handleEmailLogin() {
    loginEmail(email)
      .then(async (metadata) => {
        setMessage("Setting up your account...");

        // Setup account then close modal
        await flow.setupAccount(metadata?.publicAddress!);
        onClose();
      })
      .catch((e) => {
        console.error(e);
        setMessage("An error has occurred");
      });
  }

  // Clear message when modal is opened/closed
  useEffect(() => {
    setMessage("");
  }, [isOpen]);

  return (
    <>
      <Modal size="sm" isOpen={isOpen} onClose={onClose} trapFocus={false}>
        <ModalOverlay />
        <ModalContent p="4">
          <ModalHeader>
            <Heading size="lg">Login or Signup</Heading>
          </ModalHeader>
          <ModalBody display="flex" flexDirection="column" gap={4}>
            {message ? (
              <Text>{message}</Text>
            ) : (
              <>
                <Input
                  type="text"
                  placeholder="Email Address"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                ></Input>
                <Button
                  onClick={() => handleEmailLogin()}
                  colorScheme="blue"
                  fontSize="lg"
                  fontFamily="'나눔바른고딕 Bold', 'Roboto', sans-serif"
                  fontWeight="900"
                  color="white"
                  p="6"
                >
                  Continue with Email
                </Button>
                <Flex align="center" color="gray.400">
                  <Divider />
                  <Text padding="2">OR</Text>
                  <Divider />
                </Flex>
                {providers.map((provider) => (
                  <Button
                    key={provider.provider}
                    onClick={() => loginOAuth(provider.provider)}
                    backgroundColor="white"
                    variant="outline"
                    shadow="sm"
                    p="6"
                    display="flex"
                  >
                    <Image
                      src={provider.icon}
                      alt={provider.name}
                      height="35px"
                    ></Image>
                    <Text
                      fontSize="lg"
                      fontFamily="'나눔바른고딕 Bold', 'Roboto', sans-serif"
                      fontWeight="900"
                      mx="auto"
                    >
                      Continue with {provider.name}
                    </Text>
                  </Button>
                ))}
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
