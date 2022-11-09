import Image from "next/image"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { useMint } from "../utils/contractFunctions"
import { Collectible } from "../utils/globals/types"
import { WalletContext } from "../utils/walletContext"
import { Modal } from "./modal"
import { PaperCheckout } from "./paperCheckout"
import { PlayButton } from "./playButton"

interface NFTCardProps {
  id: number
  account: string
  signerContract: any
  owned: boolean
  created: boolean
}

export const NFTCard: React.FC<NFTCardProps> = ({ id, signerContract, account, owned, created }) => {
  const [collection, setCollection] = useState<Collectible>()
  const { login } = useContext(WalletContext)
  const [purchaseCompleted, setPurchaseCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [minting, setMinting] = useState(false)
  const [coverArtURL, setCoverArtURL] = useState('')
  const [audioURL, setAudioURL] = useState('')
  const price = (Number(collection?.price) / (10 ** 18)).toLocaleString('fullwide', { maximumSignificantDigits: 8 })
  const collectiblePageURL = `/collection/${id}`

  const balance = 0
  // this causing error
  // const balance = useGetUserCollectionBalance(account, id)
  const isCreator = account && account === collection?.artistId



  const { onMint } = useMint()
  const handleMint = async () => {
    setMinting(true)
    try {
      await onMint(signerContract, account, Number(price), account, id, 1)
    } catch (error) {
      console.log(error);
    } finally {
      setMinting(false)
      setPurchaseCompleted(true)
    }
  }

  useEffect(() => {
    async function getCollection() {
      const response = await fetch(`/api/collections/${id}`)
      const DBData = await response.json()
      console.log(DBData)
      if (DBData !== null) {
        const data: Collectible = DBData
        setCollection(data)
        setCoverArtURL(`https://${data.coverArt.slice(7, 66)}.ipfs.nftstorage.link/${data.coverArt.slice(66)}`)
        setAudioURL(`https://${data.audio.slice(7, 66)}.ipfs.nftstorage.link/${data.audio.slice(66)}`)
      }
      // if (!DBData) {
      //   console.log('blockchain result: ', blockchainData)
      //   if (blockchainData) {
      //     // loadCollectibleToDB(data)
      //     setCollection(blockchainData)
      //   }
      // }
    }
    getCollection()
    setLoading(false)
  }, [])

  if (owned && Number(balance) === 0) return null
  if (created && !isCreator) return null
  return (<>
    {!loading && collection &&
      <div className="rounded-2xl gap-1 relative flex flex-col items-center justify-center p-1 bg-gray-100 border border-gray-300">
        <Image src={coverArtURL} width="318px" height="318px" className="rounded-lg hover:bg-gray" priority={true} />
        <div className="w-full p-2 relative">
          <div className="absolute -top-44 left-32">
            <PlayButton audioURL={audioURL} />
          </div>
          <div className="flex text-left w-full -mt-2 justify-between">
            <p className="dark">{collection.artistId.toString().slice(0, 6)}...</p>
            <p className="dark">#{id}</p>
          </div>
          <div className="flex justify-between w-full mb-1">
            <Link href={collectiblePageURL}>
              <a className="flex justify-between w-full">
                <p className="bold large">{collection.name}</p>
                <p className="dark">{Number(collection.maxSupply) - Number(collection.purchasedAmount)}/{collection.maxSupply}</p>
              </a>
            </Link>
          </div>
          <div className="gap-1 flex justify-between w-full">
            <div className="flex flex-col">
              <p className="small dark">Price</p>
              <div className="flex flex-row gap-1">
                <Image src='/images/maticIcon.webp' width='24px' height='24px' />
                <p className="bold">{price}</p>
              </div>
            </div>
            <div className="flex flex-row w-1/2">
              <Modal available={Number(collection.maxSupply) - Number(collection.purchasedAmount) > 0} header="Purchase" openButtonText="Buy">
                <div className="flex flex-col gap-2 items-center w-80">
                  {!purchaseCompleted ?
                    (account !== '' ) ?
                      <>
                        <PaperCheckout onComplete={() => setPurchaseCompleted(true)} account={account} id={id} method="mint" cost={Number(price)}>Buy with CC</PaperCheckout>
                        <p>or</p>
                        <button className="primary w-full" disabled={account === '' || account === undefined || minting} onClick={handleMint}>
                          Buy with Crypto
                        </button>
                  </>
                  : <button className="primary" onClick={login}>Log in to Complete Purchase</button>
                    :
                    <p>Thank you for your purchase!</p>
                  }
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>}
  </>
  )
}