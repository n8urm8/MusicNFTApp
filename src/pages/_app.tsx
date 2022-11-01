import { PaperSDKProvider } from "@paperxyz/react-client-sdk";
import type { AppType } from "next/dist/shared/lib/utils";
import { Layout } from "../components/layout";
import "../styles/globals.css";
import { RefreshContextProvider } from "../utils/refreshContext";
import { WalletContextProvier } from "../utils/walletContext";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WalletContextProvier>
      <PaperSDKProvider clientId="5b224302-b031-4f54-847a-cc4a97f6e9e6" chainName="Mumbai">
        <RefreshContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RefreshContextProvider>
      </PaperSDKProvider>
    </WalletContextProvier>
  )
}

export default MyApp;
