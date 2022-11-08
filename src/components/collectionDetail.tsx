import { Artist, Collection } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { purchaseCollectible } from "../utils/aggregatorFunctions"
import { NFTManagerAddress } from "../utils/contractAddresses"
import { useMint } from "../utils/contractFunctions"
import { CollectionActivity } from "./collectionActivity"
import { CollectionOwners } from './collectionOwners'
import { Modal } from "./modal"
import { PaperCheckout } from "./paperCheckout"
import { PlayButton } from "./playButton"

interface IPFSDataProps {
  name?: string
  description?: string
  image?: string
  properties?: {
    audio: string
  }
}

interface CollectionDetailsProps {
  account: string
  collectibleID: number
  signerContract: any
}

interface Collectible extends Collection {
  owners: Artist[]
}

export const CollectionDetail: React.FC<CollectionDetailsProps> = ({ account, collectibleID, signerContract }) => {
  
  const [collection, setCollection] = useState<Collectible>()
  const [purchaseCompleted, setPurchaseCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [minting, setMinting] = useState(false)
  const [coverArtURL, setCoverArtURL] = useState('')
  const [audioURL, setAudioURL] = useState('')
  const price = Number(collection?.price) / (10 ** 18) || 0
  const polygonURL = `https://mumbai.polygonscan.com/address/${NFTManagerAddress}`
  console.log('audio, img: ', audioURL, coverArtURL)


  useEffect(() => {
    async function getCollection() {
      const response = await fetch(`/api/collections/${collectibleID}`)
      if (response) {
        const data: Collectible = await response.json()
        setCollection(data)
        setCoverArtURL(`https://${data.coverArt.slice(7, 66)}.ipfs.nftstorage.link/${data.coverArt.slice(66)}`)
        setAudioURL(`https://${data.audio.slice(7, 66)}.ipfs.nftstorage.link/${data.audio.slice(66)}`)
      }
    }
    getCollection()
    setLoading(false)
  }, [])

  // useEffect(() => {
  //   if (!isLoading && nfturi) {
  //     const url = `https://${nfturi?.toString().slice(7).slice(0, -14)}.ipfs.nftstorage.link/metadata.json`
  //     async function fetchData() {
  //       if (url === 'https://.ipfs.nftstorage.link/metadata.json' || url === 'https://undefined.ipfs.nftstorage.link/undefined' || nfturi === '') return
  //       const response = await fetch(url)
  //       const data = await response.json()
  //       setNftData(data)
  //       setCoverArtURL(`https://${data.image?.slice(7, 66)}.ipfs.nftstorage.link/${data.image?.slice(66)}`)
  //     } fetchData()
  //     setLoading(false)
  //   }
  // }, [nfturi])

  const { onMint } = useMint()
  const handleMint = async () => {
    setMinting(true)
    if (account === undefined || account === '') return
    try {
      await onMint(signerContract, account, price, account, collectibleID, 1)
    } catch (error) {
      console.log(error);
    } finally {
      setMinting(false)
      setPurchaseCompleted(true)
      purchaseCollectible(collectibleID, account, 1)
    }
  }

  if (loading) return null
  
  return (
    <div className="flex w-full gap-10 p-4">
      <div className="w-1/2 justify-end flex">
        <div className="max-w-[540px] max-h-[540px] w-full h-auto aspect1-1 pl-4 relative">
          {!loading &&
            <>
          <Image src={coverArtURL} layout='fill' className="rounded-lg object-cover" priority={true} />
          <div className="absolute top-1/3 left-1/3 md:ml-16 md:mt-16">
            <PlayButton audioURL={audioURL} />
            </div>
            </>
          }
        </div>
      </div>
      <div className="flex flex-col gap-4 w-1/2 max-w-[540px]">
        <div>
          <p className="large dark">{collection?.artistId}</p>
        </div>
        <div >
          <h4 className="bold">{collection?.name}</h4>
        </div>
        <div>
          <p className="dark" >
            {collection?.description}
          </p>
        </div>
        <div className="flex justify-between">
          <Link href={polygonURL}>
            <a className="mt-0">
              <button className="secondary">View on Polygonscan</button>
            </a>
          </Link>
          <p className="dark">Collection #{collectibleID}</p>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <p className="small dark">Price</p>
            <div className="flex flex-row gap-1">
              <Image src='/images/maticIcon.webp' width='24px' height='24px' />
              <p className="bold">{price}</p>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="small dark">Available</p>
            <div className="flex flex-row gap-1">
              <p className="bold">{Number(collection?.maxSupply) - Number(collection?.purchasedAmount)}/{ collection?.maxSupply }</p>
            </div>
          </div>
            <div className="flex flex-row w-1/3">
              <Modal available={Number(collection?.maxSupply) - Number(collection?.purchasedAmount) > 0} header="Purchase" openButtonText="Buy">
                <div className="flex flex-col gap-2 items-center w-80">
                  {!purchaseCompleted ? <>
                  <PaperCheckout onComplete={() => { setPurchaseCompleted(true); purchaseCollectible(collectibleID, account, 1)}} account={account} id={collectibleID} method="mint" cost={price}>Buy with CC</PaperCheckout>
                    <p>or</p>
                    <button className="primary w-full" disabled={account === '' || account === undefined || minting} onClick={handleMint}>
                      Buy with Crypto
                    </button>
                  </>
                    :
                    <p>Thank you for your purchase!</p>
                  }
                </div>  
              </Modal>
            </div>

        </div>
        <div className="flex flex-col">
          <h5 className="bold">Owners</h5>
          <CollectionOwners owners={collection?.owners} />
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="bold">Activity</h5>
          <CollectionActivity id={collectibleID} />
        </div>
      </div>
    </div>
    
  )
}