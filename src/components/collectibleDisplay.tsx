import Link from "next/link";
import { useState } from "react";
import { Collectible } from "../utils/globals/types";
import { NFTCard } from "./nftCard";

interface CollectibleDisplayProps {
  signerContract: any
  account: string | any
  collections: Collectible[]
}

export const CollectibleDisplay: React.FC<CollectibleDisplayProps> = ({ signerContract, account, collections }) => {
  // const [collections, setCollections] = useState<Collectible[]>()
  const length = collections ? Number(collections) : 0
  const [onlyOwned, setOnlyOwned] = useState(false)
  const [onlyCreated, setOnlyCreated] = useState(false)


  if (collections === undefined) return null
  return (
    <div className="flex flex-col text-gray-300">
      <div className="flex-row flex justify-between items-center">
        <h1 className="font-bold text-2xl">Available Collections</h1>
        <Link href='/create'>
          <a>
            <button className="primary">Create a New Collection</button>
          </a>
        </Link>
      </div>
      {account && <div className="flex flex-row gap-1">
        <button className="secondary" onClick={() => { setOnlyOwned(true); setOnlyCreated(false) }}>Owned</button>
        <button className="secondary" onClick={() => { setOnlyOwned(false); setOnlyCreated(true) }}>Created</button>
        <button className="secondary" onClick={() => { setOnlyOwned(false); setOnlyCreated(false) }}>All</button>
      </div>}
      
      <div className="flex gap-1 pt-2 flex-wrap">
        {collections.map((e, i) => {
          return <NFTCard owned={onlyOwned} created={onlyCreated} collection={e} key={i} signerContract={signerContract} account={account} />
        })
        }
      </div>

    </div>
  )
}