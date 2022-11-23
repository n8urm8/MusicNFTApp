import Image from 'next/image';
import { useRouter } from 'next/router';
import { NFTStorage } from 'nft.storage';
import React, { useContext, useRef, useState } from 'react';
import { loadCollectibleToDB } from '../utils/aggregatorFunctions';
import { useCreateCollection, useGetTotalCollections } from '../utils/contractFunctions';
import { Collectible } from '../utils/globals/types';
import { WalletContext } from '../utils/walletContext';
import { Modal } from './modal';
import { PaperCheckout } from './paperCheckout';

const APIKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDE3MTg1ZjVkNjgxZjkzMmM5NTRiYmJEN0E5NjUyOGM5RENjYWQ5MjUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NzcyMjg2MTY4NywibmFtZSI6InRlc3RpbmcifQ.18XDH9Ioyg601vbaxek23ohbBcHN9QigqH-ff--E7uA';

interface MintNFTProps {
  contract: any
  account: string | null | undefined
}

const MintNFT: React.FC<MintNFTProps> = ({ contract, account }) => {
  const router = useRouter()

  const { login } = useContext(WalletContext)
  const [purchaseCompleted, setPurchaseCompleted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedFileImage, setUploadedFileImage] = useState<File | undefined>();
  const [uploadedFileAudio, setUploadedFileAudio] = useState<File | undefined>();
  // const [type, setType] = useState<string>();
  const [imageView, setImageView] = useState('');
  const [audioView, setAudioView] = useState('');
  const [metaDataURL, setMetaDataURl] = useState('');
  const [txURL, setTxURL] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [ipfsData, setIpfsData] = useState<object>()
  const [loading, setLoading] = useState(false)

  const songNameInputElement = useRef<HTMLInputElement>(null)
  const descriptionInputElement = useRef<HTMLInputElement>(null)
  const priceInputElement = useRef<HTMLInputElement>(null)
  const supplyInputElement = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef(null)
  const newID = useGetTotalCollections()
  

  const handleFileUploadImage = (event: any) => {
    setTxStatus("");
    setImageView("");
    setMetaDataURl("");
    setTxURL("");
    setUploadedFileImage(event.target.files[0]);
    setImageView(URL.createObjectURL(event.target.files[0]))

  }

  const handleFileUploadAudio = (event: any) => {
    const file = event.target.files
    console.log('file: ', file)
    if (!file) return
    setUploadedFileAudio(file[0]);
    // const newURL = URL.createObjectURL(event.target.files[0])
    setAudioView(URL.createObjectURL(file[0]))
  }

  const UploadNFTData = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setLoading(true)
    //1. upload NFT content via NFT.storage
    const metaData = await uploadNFTContent(uploadedFileImage!, uploadedFileAudio!)
    setIpfsData(metaData)
    
    setLoading(false)
  }

  const uploadDB = () => {
    const accountStr = account === null || account === undefined ? '' : account.toString()
    
    
    const dbdata: Collectible = {
      id: Number(newID),
      name: songNameInputElement.current!.value,
      // @ts-ignore
      coverArt: ipfsData?.data.image.href,
      // @ts-ignore
      audio: ipfsData?.data.properties.audio.href,
      // @ts-ignore
      description: ipfsData?.data.description,
      maxSupply: Number(supplyInputElement.current?.value),
      purchasedAmount: 0,
      price: (Number(priceInputElement.current?.value) * 10 ** 18).toString(),
      artistId: accountStr,
      // owners: []
    }
    console.log(dbdata)
    loadCollectibleToDB(dbdata)

  }

  const uploadNFTContent = async (inputFileImage: File, inputFileAudio: File) => {
    const nftStorage = new NFTStorage({ token: APIKEY, });
    const songName: string = songNameInputElement.current!.value
    const songDescription: string = descriptionInputElement.current!.value
    try {
      setTxStatus("Uploading NFT to IPFS & Filecoin via NFT.storage.");
      const metaData = await nftStorage.store({
        name: songName,
        description: songDescription,
        image: inputFileImage,
        properties: { audio: inputFileAudio }
      });
      // console.log("metaData", metaData)
      setMetaDataURl(getIPFSGatewayURL(metaData.url));
      setTxStatus("Uploaded");
      return metaData;

    } catch (error) {
      setErrorMessage("Could not save NFT to NFT.Storage - Aborted minting.");
      console.log(error);
    }
  }
  const { onCreateCollection } = useCreateCollection()
  const sendCreateTx = async () => {
    setTxStatus("Sending...");
    const accountStr = account === null || account === undefined ? '' : account.toString()
    const supply = Number(supplyInputElement.current?.value)
    const price = Number(priceInputElement.current?.value)
    try {
      // @ts-ignore
      await onCreateCollection(contract, accountStr, supply, ipfsData?.url, price)
    } catch (error) {
      setErrorMessage("Failed to send tx to Mumbai.");
      console.log(error);
    } finally {
      setTxStatus("Collection Created!")
      setPurchaseCompleted(true)
    }
  }

  const getIPFSGatewayURL = (ipfsURL: string) => {
    const urlArray = ipfsURL.split("/");
    const ipfsGateWayURL = `https://${urlArray[2]}.ipfs.dweb.link/${urlArray[3]}`;
    return ipfsGateWayURL;
  }

  return (
    <div className=''>
      <form className='flex flex-col gap-3'>
        <h3 className='font-bold text-xl'>Create Collectible NFT</h3>

        <div className='flex flex-col gap-2 border border-dashed border-gray-300 w-full items-center justify-center rounded-2xl h-40'>
          {account === '' ? <button className='primary' onClick={login}>Log in to Create!</button> : <>
            <label
            className="text-black bg-gray-100 h-12 px-4 py-3 rounded-lg flex justify-center items-center text-sm cursor-pointer border border-gray-200"
            htmlFor='audio-upload'
          >
            {audioView === '' ? "Upload Audio" : "Change Audio"}
            <input type="file" required className='hidden' onChange={handleFileUploadAudio} id='audio-upload' />
          </label>
          <p>{uploadedFileAudio?.name}</p></>}
        </div>
        {audioView !== "" && <div className='flex gap-4'>
          <div className='w-1/3 gap-2'>
            <div className="text-gray-700 text-sm font-bold mb-2">Select Cover Art</div>
            <div className='flex aspect1-1 flex-col gap-2 border border-dashed border-gray-300 w-full items-center justify-center rounded-2xl'>
              <label
                className="text-black bg-gray-100 h-12 px-4 py-3 rounded-lg flex justify-center items-center text-sm cursor-pointer border border-gray-200"
                htmlFor='image-upload'
              >
                {imageView === '' ? "Choose File" : "Change Image"}
                <input type="file" required className='hidden' onChange={handleFileUploadImage} id='image-upload' />
              </label>
              {imageView !== "" && <Image className='object-fill' src={imageView} alt="NFT preview" width="100%" height="100%" />}
          
            </div>
          </div>

          <div className='w-full'>
            <div className="flex flex-col mb-4">
              <label
                className="text-gray-700 text-sm font-bold mb-2"
                htmlFor="song_name"
              >
                Name of Collection
              </label>
              <input
                ref={songNameInputElement}
                id="song_name"
                placeholder="Song name"
                type="text"
                className=""
              />
            </div>
            <div className="flex flex-col mb-4">
              <label
                className="text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <input
                ref={descriptionInputElement}
                id="desciption"
                placeholder="Description"
                type="text"
              />
            </div>
            <div className='flex justify-between'>
              <div className="flex flex-col mb-4">
                <label
                  className="text-gray-700 text-sm font-bold mb-2"
                  htmlFor="quantity"
                >
                  Supply
                </label>
                <input
                  ref={supplyInputElement}
                  id="quantity"
                  type="number"
                />
                <label
                  className="text-gray-700 text-sm font-bold mb-2 mt-2"
                  htmlFor="price"
                >
                  Price (matic)
                </label>
                <input
                  ref={priceInputElement}
                  id="price"
                  type="number"
                />
              </div>
            </div>
            {txStatus !== "Uploaded" &&
              <button
                disabled={uploadedFileImage === undefined || uploadedFileAudio === undefined || !account || account === undefined || loading}
                className="primary"
                onClick={e => UploadNFTData(e)}
              >
                {account ? 'Upload Collection' : 'Log in to create collection'}
              </button>}
            {txStatus === "Uploaded" && <div className='gap-1 flex w-full'>
              <Modal available header="Purchase" openButtonText="Buy">
                <div className="flex flex-col gap-2 items-center w-80">
                  {!purchaseCompleted ? <>
                    {/* @ts-ignore */}
                    <PaperCheckout onComplete={() => setPurchaseCompleted(true)} account={account} id={0} cost={Number(priceInputElement.current?.value)} nftData={{ uri: ipfsData?.url, maxSupply: Number(supplyInputElement.current?.value) }} method="create">
                      Purchase with CC
                    </PaperCheckout>
                    <p>or</p>
                    <button
                      disabled={uploadedFileImage === undefined || uploadedFileAudio === undefined || !account || account === undefined || loading}
                      className="primary w-full"
                      onClick={sendCreateTx}
                    >
                      {account ? 'Mint Collection' : 'Log in to create collection'}
                    </button>
                  </>
                    :
                    <p>Thank you for your purchase!</p>
                  }
                </div>
              </Modal>
            </div>}
          </div>
        </div>}
      </form>
      {txStatus && <p>{txStatus}</p>}

      {metaDataURL && <p><a href={metaDataURL}>Metadata on IPFS</a></p>}
      {txURL && <p><a href={txURL}>See the mint transaction</a></p>}
      {errorMessage}
      <button className='secondary' onClick={uploadDB}>upload to db</button>
    </div>

  )
}
export default MintNFT;