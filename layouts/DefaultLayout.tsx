import { Box, Container, Flex } from "@chakra-ui/react";
import Navbar from "../components/Navbar";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <>
      <Navbar></Navbar>
      <Flex overflow="auto" flexDir="column" marginTop="75px" paddingY={8}>
        <Container>{children}</Container>
      </Flex>
    </>
  );
}

export default DefaultLayout;
