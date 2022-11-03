import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { CollectionDetail } from "../../components/collectionDetail";
import { WalletContext } from "../../utils/walletContext";


const CollectionDetails: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { account } = useContext(WalletContext)
  const { signerContract } = useContext(WalletContext)
  const collectibleID = Number(id)


  
  if (id === undefined || account === undefined || account === null) return null
  return (
    <CollectionDetail account={account} collectibleID={collectibleID} signerContract={signerContract} />
  );
};

export default CollectionDetails;