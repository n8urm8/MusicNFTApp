import { Collection } from "@prisma/client";
import type { NextPage } from "next";
import { useContext, useState } from "react";
import { CollectibleDisplay } from "../components/collectibleDisplay";
import { prisma } from "../utils/globals/db";
import { WalletContext } from "../utils/walletContext";

export async function getServerSideProps() {
  const collections: Collection[] = await prisma.collection.findMany({include: {owners: true}});
  return {
    props: {
      initialCollections: collections
    }
  }
}

interface HomeProps {
  initialCollections: Collection[]
}

const Home: NextPage<HomeProps> = ({ initialCollections }) => {
  const [collections, setCollections] = useState(initialCollections)
  const {account} = useContext(WalletContext)
  const { signerContract } = useContext(WalletContext)
  
  return (
     
    <div className="px-4 pt-1 flex-col text-gray-900">
      <CollectibleDisplay account={account} collections={collections} signerContract={signerContract} />
    </div>
  )
};

export default Home;
