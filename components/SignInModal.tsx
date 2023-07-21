import {
  Button,
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
import { useState } from "react";
import { useFlow } from "../contexts/FlowContext";
import { OAuthProvider } from "@magic-ext/oauth";

interface OAuthProviderItem {
  name: string;
  icon: string;
  provider: OAuthProvider;
  color: string;
}

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const flow = useFlow();
  const [email, setEmail] = useState<string>("");

  const providers: OAuthProviderItem[] = [
    {
      name: "Google",
      icon: "",
      provider: "google",
      color: "#4285F4",
    },
    {
      name: "Facebook",
      icon: "",
      provider: "facebook",
      color: "#4267B2",
    },
  ];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} trapFocus={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Login or Signup</Heading>
          </ModalHeader>
          <ModalBody display="flex" flexDirection="column">
            {providers.map((provider) => (
              <OAuthButton
                key={provider.provider}
                name={provider.name}
                icon={provider.icon}
                color={provider.color}
                onClick={() => flow.loginOAuth(provider.provider)}
              />
            ))}

            <Text padding="2" textAlign="center">
              or
            </Text>

            <Input
              type="text"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            ></Input>

            <Button
              onClick={() => flow.loginEmail(email)}
              colorScheme="blue"
              marginTop="2"
            >
              Continue with Email
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function OAuthButton({
  name,
  icon,
  color,
  onClick,
}: {
  name: string;
  icon: string;
  color: string;
  onClick: () => void;
}) {
  const styles = {
    btn: {
      "flex-direction": "row",
      "border-radius": "8px",
      "border-style": "solid",
      "border-width": "1px",
      display: "flex",
      height: "64px",
      flex: "initial",
      margin: "10px",
      width: "300px",
      backgroundColor: color,
    },
    logo: {
      width: "64px",
      flex: "initial",
      display: "flex",
      position: "relative",
      "background-color": "inherit",
    },
    textContainer: {
      display: "flex",
      "flex-direction": "column",
      "align-items": "center",
      "flex-grow": "1",
    },
    text: {
      "text-align": "center",
      color: "white",
      "font-size": "14pt",
      "font-weight": "900",
      "font-family": "'나눔바른고딕 Bold', 'Roboto', sans-serif",
    },
  };

  return (
    <div>
      <Button style={styles.btn} onClick={onClick}>
        <Image src={icon} style={styles.logo} alt={name}></Image>
        <div style={styles.textContainer}>
          <div style={styles.text}>Login with {name}</div>
        </div>
      </Button>
    </div>
  );
}
