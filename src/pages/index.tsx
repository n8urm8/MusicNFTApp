import { ConnectExtension } from "@magic-ext/connect";
import { Magic } from "magic-sdk";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Web3 from "web3";
import { MagicConnector } from "../components/magicConnector";
import MintNFT from "../components/mintNFT";

const polygonChain = {
  rpcUrl: 'https://polygon-rpc.com/',
  chainId: 137,
}

const mumbaiChain = {
  rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/v9tZMbd55QG9TpLMqrkDc1dQIzgZazV6',
  chainId: 80001
}

const magic = typeof window != 'undefined' && new Magic('pk_live_52DD541C5579CC8C', {
  network: mumbaiChain,
  locale: 'en_US',
  extensions: [new ConnectExtension()]
} as any);

// @ts-ignore
const web3 = new Web3(magic.rpcProvider);

const Home: NextPage = () => {

  const [account, setAccount] = useState<string | null>();
  const shortAddress = `${account?.slice(0,4)}...${account?.slice(-4)}`

  const login = async () => {
    web3.eth
      .getAccounts()
      .then((accounts) => {
        setAccount(accounts?.[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const showWallet = () => {
    // @ts-ignore
    magic.connect.showWallet().catch((e: any) => {
      console.log(e);
    });
  };

  const disconnect = async () => {
    // @ts-ignore
    await magic.connect.disconnect().catch((e: any) => {
      console.log(e);
    });
    setAccount(null);
  };

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
        <div>
          <MintNFT web3={web3} account={account} />
        </div>
      </div>
    </div>
  );
};

export default Home;
