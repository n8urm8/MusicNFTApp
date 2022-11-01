import type { NextPage } from "next";
import { useContext } from "react";
import MintNFT from "../../components/mintNFT";
import { WalletContext } from "../../utils/walletContext";


const CreateCollection: NextPage = () => {
  const {account} = useContext(WalletContext)
  const { signerContract } = useContext(WalletContext)
  
  return (
      <div className="px-4 pt-1 flex-col text-gray-900">
        <MintNFT contract={signerContract} account={account} />
      </div>
  );
};

export default CreateCollection;