import "../styles/globals.css";
import DefaultLayout from "../layouts/DefaultLayout";

// Import FCL config
import "../config/fcl";
import { FlowProvider } from "../contexts/FlowContext";

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? defaultPageLayout;
  return getLayout(<Component {...pageProps} />);
}

function defaultPageLayout(page) {
  return (
    <FlowProvider>
      <DefaultLayout>{page}</DefaultLayout>
    </FlowProvider>
  );
}

export default MyApp;
