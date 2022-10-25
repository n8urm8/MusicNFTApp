import { ConnectExtension } from "@magic-ext/connect";
import { Magic } from "magic-sdk";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Web3 from "web3";

const polygonChain = {
  rpcUrl: 'https://polygon-rpc.com/',
  chainId: 137,
}

const mumbaiChain = {
  rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/v9tZMbd55QG9TpLMqrkDc1dQIzgZazV6',
  chainId: 80001
}

const magic = typeof window != 'undefined' && new Magic('pk_live_52DD541C5579CC8C', {
  network: polygonChain,
  locale: 'en_US',
  extensions: [new ConnectExtension()]
} as any);

const web3 = new Web3(magic.rpcProvider);

const Home: NextPage = () => {

  const [account, setAccount] = useState(null);

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
    magic.connect.showWallet().catch((e) => {
      console.log(e);
    });
  };

  return (
    <div className="flex flex-col bg-gray-600 min-h-screen">
      <Head>
        <title>Chain Beatz</title>
        <meta name="description" content="The forever music app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="px-4 py-1 flex flex-row border-b border-gray-500 justify-between">
        <h1 className="text-3xl font-extrabold leading-normal text-gray-850 ">
          Chain <span className="text-gray-400">Beatz</span>
        </h1>
        {!account &&
          <button onClick={login} className="hover:bg-gray-500 border rounded-md border-gray-200 px-2 text-gray-300 font-bold">
          Magic Connect
        </button>}
        {account &&
          <button onClick={showWallet} className="hover:bg-gray-500 border rounded-md border-gray-200 px-2 text-gray-300 font-bold">
          Show Wallet
        </button>}
      </nav>
      <div className="px-4 pt-1 flex-col text-gray-900">
        <span>next stuff</span>
      </div>
    </div>
  );
};

export default Home;
