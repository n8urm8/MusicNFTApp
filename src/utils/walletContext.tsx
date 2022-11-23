import { ConnectExtension } from "@magic-ext/connect";
import { Magic } from "magic-sdk";
import { createContext, useState } from "react";
import Web3 from 'web3';
import { AbiItem } from "web3-utils";
import mediaNFT from './ABIs/mediaNFT.json';
import { NFTManagerAddress } from "./contractAddresses";
import { mumbaiChain } from "./networks";

const magicConnectAPIKey: string = 'pk_live_57DABD2AFE80654E';
const magicAuthAPIKey: string = 'pk_live_79F34B8F28CF3553';

const magic = typeof window != 'undefined' && new Magic(magicConnectAPIKey, {
  network: mumbaiChain,
  locale: 'en_US',
  extensions: [new ConnectExtension()]
} as any);

  // @ts-ignore
const web3 = new Web3(magic.rpcProvider)
  
interface WalletContextProps {
  account: string | null | undefined
  login: () => void
  showWallet: () => void
  disconnect: () => void
  signerContract: any
  requestEmail: () => void
}

export const WalletContext = createContext<WalletContextProps>({
  account: '',
  login: () => null,
  showWallet: () => null,
  disconnect: () => null,
  signerContract: null,
  requestEmail: () => null,
})

export const WalletContextProvier: React.FC<{ children: any }> = ({ children }) => {

  const [account, setAccount] = useState<string | undefined>('');
  const signerContract = new web3.eth.Contract(mediaNFT as unknown as AbiItem, NFTManagerAddress)

  const login = async () => { 
    web3.eth
      .getAccounts()
      .then((accounts) => {
        setAccount(accounts[0]);
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
    setAccount('');
  };

  const requestEmail = async () => {
    // @ts-ignore
    const email = await magic.connect.requestUserInfo().catch((e: any) => {
      console.error(e)
    })
    return email
  }

  return (
    <WalletContext.Provider value={{ account, login, showWallet, disconnect, signerContract, requestEmail }}>{children}</WalletContext.Provider>
  )
}