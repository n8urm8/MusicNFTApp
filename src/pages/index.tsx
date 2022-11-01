import type { NextPage } from "next";
import Head from "next/head";
import { useContext } from "react";
import { CollectibleDisplay } from "../components/collectibleDisplay";
import { MagicConnector } from "../components/magicConnector";
import MintNFT from "../components/mintNFT";
import { WalletContext } from "../utils/walletContext";


const Home: NextPage = () => {
  const { account } = useContext(WalletContext)
  const { login } = useContext(WalletContext)
  const { disconnect } = useContext(WalletContext)
  const { showWallet } = useContext(WalletContext)
  const { signerContract } = useContext(WalletContext)
 
  const shortAddress = `${account?.slice(0, 4)}...${account?.slice(-4)}`

  return (
    <div className="flex flex-col bg-gray-600 min-h-screen">
      <Head>
        <title>Chain Beatz</title>
        <meta name="description" content="The forever music app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="px-4 py-1 flex flex-row border-b border-gray-500 justify-between items-center">
        <h1 className="text-3xl font-extrabold leading-normal text-gray-850 ">
          Chain <span className="text-gray-400">Beatz</span>
        </h1>
        <MagicConnector
          shortAddress={shortAddress}
          account={account}
          login={login}
          disconnect={disconnect}
          showWallet={showWallet}
        />
      </div>
      <div className="px-4 pt-1 flex-col text-gray-900">
        <CollectibleDisplay account={account} signerContract={signerContract} />
        <div>
          <MintNFT contract={signerContract} account={account} />
        </div>
      </div>
    </div>
  );
};

export default Home;
