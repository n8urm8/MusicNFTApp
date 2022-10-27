import type { AppType } from "next/dist/shared/lib/utils";
import "../styles/globals.css";
import { RefreshContextProvider } from "../utils/refreshContext";

const MyApp: AppType = ({ Component, pageProps }) => {
  return(
    <RefreshContextProvider>
      <Component {...pageProps} />
    </RefreshContextProvider>
  );
};

export default MyApp;
