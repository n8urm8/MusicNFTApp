import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import { AbiItem } from 'web3-utils';
import nftABI from './ABIs/mediaNFT.json';
import { createCollection, mint } from './callHelpers';
import { NFTManagerAddress } from './contractAddresses';
import { getWeb3 } from './globals/web3';
import useRefresh from './useRefresh';

const web3Provider = getWeb3()

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

  useEffect(() => {
    async function fetch() {
      const data = await contract.methods.collectionPrice(id).call()
      setCollectionPrice(data)
    }
    fetch()
  }, [])
  return collectionPrice
}

export const useGetCollectionURI = (id: number) => {
  const [collectionURI, setCollectionURI] = useState('')

  useEffect(() => {
    async function fetch() {
      const data = await contract.methods.uri(id).call()
      setCollectionURI(data)
    }
    fetch()
  }, [])
  return collectionURI
}

export const useGetTotalCollections = () => {
  const [collections, setCollections] = useState(0)
  const {fastRefresh} = useRefresh()

  useEffect(() => {
    async function fetch() {
      const data = await contract.methods.getTotalCollections().call()
      setCollections(data)
    }
    fetch()
  }, [fastRefresh])
  return collections
}

export const useGetCollectionCurrentSupply = (id: number) => {
  const [data, setData] = useState(0)

  useEffect(() => {
    async function fetch() {
      const data = await contract.methods.totalSupply(id).call()
      setData(data)
    }
    fetch()
  }, [])
  return data
}

export const useGetCollectionMaxSupply = (id: number) => {
  const [data, setData] = useState(0)

  useEffect(() => {
    async function fetch() {
      const data = await contract.methods.maxSupply(id).call()
      setData(data)
    }
    fetch()
  }, [])
  return data
}

export const useGetCollectionCreator = (id: number) => {
  const [data, setData] = useState('')

  useEffect(() => {
    async function fetch() {
      const data = await contract.methods.collectionCreator(id).call()
      setData(data)
    }
    fetch()
  }, [])
  return data
}

export const useGetUserCollectionBalance = (address: any, id: number) => {
  const userWallet = address && address.length > 0 ? address.toString() : ''
  const [data, setData] = useState(0)
  
  if (userWallet !== '' && userWallet.length > 0) { 
    useEffect(() => {
      async function fetch() {
        const data = await contract.methods.balanceOf(userWallet, id).call()
        setData(data)
      }
      fetch()
    }, [userWallet]);
  }
  return data
}