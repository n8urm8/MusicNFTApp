import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import nftABI from './ABIs/mediaNFT.json';
import { NFTManagerAddress } from './contractAddresses';
import { useContract } from './useContract';


export const useCreateCollection = (account: string, web3Provider: any, maxSupply: number, uri: any, value: number) => {
  const contract = useContract(nftABI, NFTManagerAddress, web3Provider)
  const [txHash, setTxHash] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const price = new BigNumber(value * 10 ** 18).toString()

  useCallback(async () => {
    setIsLoading(true)

    try {
      await contract.methods.createCollection(maxSupply, uri, price)
      .send({ from: account })
      .on('transactionHash', (tx: any) => { setTxHash(tx) })
    } catch (e: any) { 
      setError(e)
    } finally {
      setIsLoading(false)
    }
    
  }, [account, contract, maxSupply, uri, price])

  return [txHash, isLoading, error]
}

export const useMint = (account: string, web3Provider: any, value: number, to: string, id: number, amount: number) => {
  const contract = useContract(nftABI, NFTManagerAddress, web3Provider)
  const [txHash, setTxHash] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const price = new BigNumber(value * 10 ** 18).toString()

  useCallback(async () => {
    setIsLoading(true)

    try {
      await contract.methods.mint(to, id, amount)
      .send({ from: account, value: price })
      .on('transactionHash', (tx: any) => { setTxHash(tx) })
    } catch (e: any) { 
      setError(e)
    } finally {
      setIsLoading(false)
    }
    
  }, [account, contract, to, id, amount, price])

  return [txHash, isLoading, error]
}

export const useGetCollectionPrice = (web3Provider: any, id: number) => {
  const contract = useContract(nftABI, NFTManagerAddress, web3Provider)
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
  }, [id, contract])
  return [isLoading, collectionPrice]
}

export const useGetCollectionURI = (web3Provider: any, id: number) => {
  const contract = useContract(nftABI, NFTManagerAddress, web3Provider)
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
  }, [id, contract])
  return [isLoading, collectionURI]
}
