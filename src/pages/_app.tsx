import type { AppType } from "next/dist/shared/lib/utils";
import { AudioPlayerProvider } from "react-use-audio-player";
import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return(
    <AudioPlayerProvider>
      <Component {...pageProps} />
    </AudioPlayerProvider>
  );
};

export default MyApp;
