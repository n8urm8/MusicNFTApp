import Image from 'next/image';
import { NFTStorage } from 'nft.storage';
import { useRef, useState } from 'react';
import { useCreateCollection } from '../utils/contractFunctions';

const APIKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDE3MTg1ZjVkNjgxZjkzMmM5NTRiYmJEN0E5NjUyOGM5RENjYWQ5MjUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NzcyMjg2MTY4NywibmFtZSI6InRlc3RpbmcifQ.18XDH9Ioyg601vbaxek23ohbBcHN9QigqH-ff--E7uA';

interface MintNFTProps {
  contract: any
  account: string | null | undefined
}

const MintNFT: React.FC<MintNFTProps> = ({contract, account}) => {

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedFileImage, setUploadedFileImage] = useState<File>();
  const [uploadedFileAudio, setUploadedFileAudio] = useState<File>();
  // const [type, setType] = useState<string>();
  const [imageView, setImageView] = useState('');
  const [audioView, setAudioView] = useState('');
  const [metaDataURL, setMetaDataURl] = useState('');
  const [txURL, setTxURL] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [ipfsData, setIpfsData] = useState<object>()
  const [transacting, setTransacting] = useState(false)

  const songNameInputElement = useRef<HTMLInputElement>(null)
  const descriptionInputElement = useRef<HTMLInputElement>(null)
  const priceInputElement = useRef<HTMLInputElement>(null)
  const supplyInputElement = useRef<HTMLInputElement>(null)
  

    const handleFileUploadImage = (event: any) => {
      setTxStatus("");
      setImageView("");
      setMetaDataURl("");
      setTxURL("");
      setUploadedFileImage(event.target.files[0]);
      setImageView(URL.createObjectURL(event.target.files[0]))

    }
    const handleFileUploadAudio = (event: any) => {
      setAudioView('');
      setUploadedFileAudio(event.target.files[0]);
      setAudioView(URL.createObjectURL(event.target.files[0]))
    }

    const UploadNFTData = async(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
      event.preventDefault();
     
      //1. upload NFT content via NFT.storage
      const metaData = await uploadNFTContent(uploadedFileImage!, uploadedFileAudio!)
      setIpfsData(metaData)
      

      //2. Mint a NFT
      // const [txHash, error] = useCreateCollection(accountStr, web3, supply, metaData?.url, price)
      // if (error) console.log(error)
      // const mintNFTTx = await sendTx(metaData);

      //3. preview the minted nft
      // previewNFT(metaData, txHash);
    }

    const uploadNFTContent = async(inputFileImage: File, inputFileAudio: File) =>{
      const nftStorage = new NFTStorage({ token: APIKEY, });
      const songName: string = songNameInputElement.current!.value
      const songDescription: string = descriptionInputElement.current!.value
        try {
            setTxStatus("Uploading NFT to IPFS & Filecoin via NFT.storage.");
            const metaData = await nftStorage.store({
              name: songName,
              description: songDescription,
              image: inputFileImage,
              properties: {audio: inputFileAudio}
            });
            // console.log("metaData", metaData)
            setMetaDataURl(getIPFSGatewayURL(metaData.url));
            return metaData;

        } catch (error) {
            setErrorMessage("Could not save NFT to NFT.Storage - Aborted minting.");
            console.log(error);
        }
    }
    const { onCreateCollection } = useCreateCollection()
    const sendCreateTx = async () =>{
      setTxStatus("Sending...");
      const accountStr = account === null || account === undefined ? '' : account.toString()
      const supply = Number(supplyInputElement.current?.value)
      const price = Number(priceInputElement.current?.value)
      try {
        await onCreateCollection(contract, accountStr, supply, ipfsData, price)
      } catch (error) {
          setErrorMessage("Failed to send tx to Mumbai.");
          console.log(error);
      } finally {
        setTxStatus("Collection Created!")
      }
    }

    const previewNFT = (metaData: any, mintNFTTx: any) =>{
        const imgViewString = getIPFSGatewayURL(metaData.data.image.pathname);
        setImageView(imgViewString);
        const audioViewString = getIPFSGatewayURL(metaData.data.properties.video.pathname);
        setAudioView(audioViewString)
        console.log("media url:", imgViewString, audioViewString);
        setMetaDataURl(getIPFSGatewayURL(metaData.url));
        setTxURL('https://mumbai.polygonscan.com/search?f=0&q='+ mintNFTTx.hash);
        setTxStatus("NFT is minted successfully!");
    }

    const getIPFSGatewayURL = (ipfsURL: string)=>{
        const urlArray = ipfsURL.split("/");
        const ipfsGateWayURL = `https://${urlArray[2]}.ipfs.dweb.link/${urlArray[3]}`;
        return ipfsGateWayURL;
    }

    return(
      <div className='bg-gray-100 p-4 rounded-md mt-2'>
        <form className='flex flex-col gap-3'>
          <h3 className='font-bold text-xl'>Create Collectible NFT</h3>
          <div className="flex flex-col mb-4">
            <label
              className="text-gray-700 text-sm font-bold mb-2"
              htmlFor="song_name"
            >
              Name of Song
            </label>
            <input
              ref={songNameInputElement}
              id="song_name"
              placeholder="Song name"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col'>
                <span className="text-gray-700 text-sm font-bold mb-2">Select Cover Art</span>
                <input type="file" onChange={handleFileUploadImage} />
              </div>
              <div className='flex flex-col'>
                <span className="text-gray-700 text-sm font-bold mb-2">Select Audio</span>
                <input type="file" onChange={handleFileUploadAudio} />
              </div>
            </div>
          </div>
          <button
            disabled={uploadedFileImage === undefined || uploadedFileAudio === undefined || !account || account === undefined}
            className="hover:bg-gray-500 disabled:hover:bg-gray-100 border rounded-md border-gray-200 px-2 py-1.5 text-gray-500 hover:text-gray-300 font-bold"
            onClick={e => UploadNFTData(e)}
          >
            {account ? 'Upload Collection' : 'Log in to create collection'}
          </button>
          <button
            disabled={uploadedFileImage === undefined || uploadedFileAudio === undefined || !account || account === undefined}
            className="hover:bg-gray-500 disabled:hover:bg-gray-100 border rounded-md border-gray-200 px-2 py-1.5 text-gray-500 hover:text-gray-300 font-bold"
            onClick={sendCreateTx}
          >
            {account ? 'Mint Collection' : 'Log in to create collection'}
          </button>
        </form>
        {txStatus && <p>{txStatus}</p>}
        {imageView !== "" && <Image className='NFTImg' src={imageView} alt="NFT preview" height="100px" width="100px" />}
        {audioView !== "" &&
          <audio controls>
            <source src={audioView} type="audio/mpeg" />
          </audio>
        }

        {metaDataURL && <p><a href={metaDataURL}>Metadata on IPFS</a></p>}
        {txURL && <p><a href={txURL}>See the mint transaction</a></p>}
        {errorMessage}
      </div>

    );
}
export default MintNFT;