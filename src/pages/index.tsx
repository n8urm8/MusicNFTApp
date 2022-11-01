import type { NextPage } from "next";
import { useContext } from "react";
import { CollectibleDisplay } from "../components/collectibleDisplay";
import { WalletContext } from "../utils/walletContext";


const Home: NextPage = () => {
  const {account} = useContext(WalletContext)
  const { signerContract } = useContext(WalletContext)
  
  return (
     
    <div className="px-4 pt-1 flex-col text-gray-900">
      <CollectibleDisplay account={account} signerContract={signerContract} />
    </div>
  )
};

export default Home;
