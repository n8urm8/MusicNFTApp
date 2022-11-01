import Link from "next/link";
import { useGetTotalCollections } from "../utils/contractFunctions";
import { NFTCard } from "./nftCard";

interface CollectibleDisplayProps {
  signerContract: any
  account: string | any
}

export const CollectibleDisplay: React.FC<CollectibleDisplayProps> = ({ signerContract, account }) => {
  const [isLoading, collections] = useGetTotalCollections()
  const length = collections ? Number(collections) - 1 : 0

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
      <div className="flex gap-1 pt-2 flex-wrap">
        {[...Array(length)].map((e, i) => {
          return <NFTCard id={i} key={i} signerContract={signerContract} account={account} />
        })
        }
      </div>
    </div>
  )
};