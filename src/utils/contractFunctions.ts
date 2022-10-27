import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import nftABI from './ABIs/mediaNFT.json';
import { createCollection, mint } from './callHelpers';
import { NFTManagerAddress } from './contractAddresses';
import useRefresh from './useRefresh';

const web3Provider = new Web3(new Web3.providers.HttpProvider('https://polygon-mumbai.g.alchemy.com/v2/v9tZMbd55QG9TpLMqrkDc1dQIzgZazV6'))

const contract = new web3Provider.eth.Contract(nftABI as unknown as AbiItem, NFTManagerAddress)


export const useCreateCollection = () => {

  const handleCreateCollection = useCallback(
    async (contract: any, account: string, maxSupply: number, uri: any, value: number) => {
      const price = new BigNumber(value * 10 ** 18).toString()
      const txHash = await createCollection(contract, account, maxSupply, uri, price)
      console.info(txHash)
    }, []
  )

  return { onCreateCollection: handleCreateCollection}
}

export const useMint = () => {

  const handleMint = useCallback(
    async (contract: any, account: string, value: number, to: string, id: number, amount: number) => {
      const price = new BigNumber(value * 10 ** 18).toString()
      const txHash = await mint(contract, account, to, id, amount, price)
      console.info(txHash)
    }, []
  )

  return { onMint: handleMint }
}

export const useGetCollectionPrice = (id: number) => {
  const [collectionPrice, setCollectionPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    async function fetch() {
      const data = await contract.methods.collectionPrice(id).call()
      setCollectionPrice(data)
    }
    fetch()
    setIsLoading(false)
  }, [])
  return [isLoading, collectionPrice]
}

export const useGetCollectionURI = (id: number) => {
  const [collectionURI, setCollectionURI] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    async function fetch() {
      const data = await contract.methods.uri(id).call()
      setCollectionURI(data)
    }
    fetch()
    setIsLoading(false)
  }, [])
  return [isLoading, collectionURI]
}

export const useGetTotalCollections = () => {
  const [collections, setCollections] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const {fastRefresh} = useRefresh()

  useEffect(() => {
    setIsLoading(true)
    async function fetch() {
      const data = await contract.methods.getTotalCollections().call()
      setCollections(data)
    }
    fetch()
    setIsLoading(false)
  }, [fastRefresh])
  return [isLoading, collections]
}