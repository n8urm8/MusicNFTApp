
import Image from "next/image"
import { useEffect, useState } from "react"
import { useGetCollectionPrice, useGetCollectionURI, useMint } from "../utils/contractFunctions"
import { PlayButton } from "./playButton"

interface NFTCardProps {
  id: number
  account: string | any
  signerContract: any
}

interface IPFSDataProps {
  name?: string
  description?: string
  image?: string
  properties?: {
    audio: string
  }
}

export const NFTCard: React.FC<NFTCardProps> = ({ id, signerContract, account }) => {
  const [loading, setLoading] = useState(true)
  const [minting, setMinting] = useState(false)
  const [isLoading, nfturi] = useGetCollectionURI(id)
  const [nftData, setNftData] = useState<IPFSDataProps>({})
  const [coverArtURL, setCoverArtURL] = useState('')
  const audioURL = nftData !== undefined && nftData !== null && `https://${nftData.properties?.audio.slice(7, 66)}.ipfs.nftstorage.link/${nftData.properties?.audio.slice(66)}`
  const weiPrice = useGetCollectionPrice(id)
  const price = Number(weiPrice[1])/ (10**18)

  const { onMint } = useMint()
  const handleMint = async () => {
    setMinting(true)
    try {
      await onMint(signerContract, account, price, account, id, 1)
    } catch (error) {
      console.log(error);
    } finally {
      setMinting(false)
    }
  }

  useEffect(() => {
    if (!isLoading) {
    const url = `https://${nfturi?.toString().slice(7).slice(0, -14)}.ipfs.nftstorage.link/metadata.json`
    async function fetchData() {
      if (url === 'https://.ipfs.nftstorage.link/metadata.json' || url === 'https://undefined.ipfs.nftstorage.link/undefined' || nfturi === '') return 
      const response = await fetch(url)
      const data = await response.json()
      setNftData(data)
      setCoverArtURL(`https://${data.image?.slice(7, 66)}.ipfs.nftstorage.link/${data.image?.slice(66)}`)
    } fetchData()
      setLoading(false)
    };
  }, [nfturi])
  return (<>
    {nfturi !== 'Check out live streams and music collectibles on Volume.com!' && nftData !== undefined && !loading &&
      <div className="rounded-md w-40 h-60 relative flex flex-col items-center justify-between p-1">        
        <Image src={coverArtURL} layout='fill' className="rounded-md object-cover" priority={true} />
        <div className=" font-bold text-gray-200 z-10">
          {nftData?.name}
        </div>
        <div className="z-10">
          <PlayButton audioURL={audioURL} />
        </div>
        <div className="border-gray-200 border rounded-md px-2 py-1 font-bold text-gray-200 z-10">
          <button disabled={account === null || account === undefined || minting} onClick={handleMint}>Buy - {price}<span className="text-sm font-light">(matic)</span></button>
        </div>
      </div>}
  </>
  );
}