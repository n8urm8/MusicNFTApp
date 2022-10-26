import { useGetTotalCollections } from "../utils/contractFunctions"
import { NFTCard } from "./nftCard"

interface CollectibleDisplayProps {
  signerContract: any
  account: string | any
}

export const CollectibleDisplay: React.FC<CollectibleDisplayProps> = ({ signerContract, account }) => {
  const [isLoading, collections] = useGetTotalCollections()

  if (isLoading) return null
  return (
    <div className="flex gap-1 pt-2">
      {[...Array(Number(1))].map((e, i) => {
        return <NFTCard id={i} key={i} signerContract={signerContract} account={account} />
        })
      }
    </div>
  )
}