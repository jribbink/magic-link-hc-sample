import "../styles/globals.css";

// Import FCL config
import "../config/fcl";
import { FlowProvider } from "../contexts/FlowContext";
import DefaultLayout from "../layouts/DefaultLayout";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect } from "react";

interface MyAppProps {
  Component: any;
  pageProps: any;
}

function MyApp({ Component, pageProps }: MyAppProps) {
  return (
    <ChakraProvider>
      <FlowProvider>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </FlowProvider>
    </ChakraProvider>
  );
}

export default MyApp;
