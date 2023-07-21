import { Container, Flex } from "@chakra-ui/react";
import Navbar from "../components/Navbar";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <Flex
      display="flex"
      flexDir="column"
      h="100vh"
      maxH="100vh"
      overflow="hidden"
    >
      <Navbar></Navbar>
      <Container overflow="auto" flex={1} flexDir="column" paddingTop={4}>
        {children}
      </Container>
    </Flex>
  );
}

export default DefaultLayout;
