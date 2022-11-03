import Image from "next/image"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { useGetCollectionCreator, useGetCollectionCurrentSupply, useGetCollectionMaxSupply, useGetCollectionPrice, useGetCollectionURI, useMint } from "../utils/contractFunctions"
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

interface IPFSDataProps {
  name?: string
  description?: string
  image?: string
  properties?: {
    audio: string
  }
}

export const NFTCard: React.FC<NFTCardProps> = ({ id, signerContract, account, owned, created }) => {
  
  const { login } = useContext(WalletContext)
  const [purchaseCompleted, setPurchaseCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [minting, setMinting] = useState(false)
  const [isLoading, nfturi] = useGetCollectionURI(id)
  const [nftData, setNftData] = useState<IPFSDataProps>({})
  const [coverArtURL, setCoverArtURL] = useState('')
  const audioURL = nftData !== undefined && nftData !== null && `https://${nftData.properties?.audio.slice(7, 66)}.ipfs.nftstorage.link/${nftData.properties?.audio.slice(66)}`
  const weiPrice = useGetCollectionPrice(id)
  const price = (Number(weiPrice[1]) / (10 ** 18)).toLocaleString('fullwide', { maximumSignificantDigits:8})
  const [, currentSupply] = useGetCollectionCurrentSupply(id)
  const [, maxSupply] = useGetCollectionMaxSupply(id)
  const [, creator] = useGetCollectionCreator(id)
  const collectiblePageURL = `/collection/${id}`

  const balance = 0
  // this causing error
  // const balance = useGetUserCollectionBalance(account, id)
  const isCreator = account && account === creator



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
    if (!isLoading && nfturi) {
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

  if (owned && Number(balance) === 0) return null
  if (created && !isCreator) return null
  return (<>
    {nfturi !== 'Check out live streams and music collectibles on Volume.com!' && coverArtURL !== '' && !loading &&
      <div className="rounded-2xl gap-1 relative flex flex-col items-center justify-center p-1 bg-gray-100 border border-gray-300">
        <Image src={coverArtURL} width="318px" height="318px" className="rounded-lg hover:bg-gray" priority={true} />
        <div className="w-full p-2 relative">
          <div className="absolute -top-44 left-32">
            <PlayButton audioURL={audioURL} />
          </div>
          <div className="flex text-left w-full -mt-2">
            <p className="dark">{creator?.toString().slice(0, 6)}...</p>
          </div>
          <div className="flex justify-between w-full mb-1">
            <Link href={collectiblePageURL}>
              <a className="flex justify-between w-full">
                <p className="bold large">{nftData?.name}</p>
                <p className="dark">{Number(maxSupply) - Number(currentSupply)}/{maxSupply}</p>
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
              <Modal available={Number(maxSupply) - Number(currentSupply) > 0} header="Purchase" openButtonText="Buy">
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