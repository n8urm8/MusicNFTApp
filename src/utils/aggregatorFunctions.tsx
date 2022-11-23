import { Collection, Prisma } from "@prisma/client"
import { useEffect, useState } from "react"
import { useGetCollectionCreator, useGetCollectionCurrentSupply, useGetCollectionMaxSupply, useGetCollectionPrice, useGetCollectionURI } from "./contractFunctions"
import { Collectible, IPFSDataProps } from "./globals/types"


export const purchaseCollectible = (id: number, wallet: string, purchasedAmount: number) => {
  fetch(`/api/collections/${id}?owner=${wallet}&purchasedAmount=${purchasedAmount}`, {
    method: 'POST'
  })
    //.then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.error(err))
}

export const loadCollectibleToDB = (data: Collectible) => {
  fetch(`/api/collections`, {
    method: 'POST',
    // mode: 'cors',
    // cache: 'no-cache',
    // headers: {
    //   'Content-Type': 'application/json'
    // },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(e => console.error(e))
}

export const useGetCollectibleDataFromBlockChain = (id: number) => {
  
  const [data, setData] = useState<Collection>()
  const [response, setResponse] = useState<IPFSDataProps>()
  const uri = useGetCollectionURI(id)
  const currentSupply = useGetCollectionCurrentSupply(id)
  const maxSupply = useGetCollectionMaxSupply(id)
  const creator = useGetCollectionCreator(id)
  const weiPrice = useGetCollectionPrice(id)

  if(uri) {const url = `https://${uri.toString().slice(7).slice(0, -14)}.ipfs.nftstorage.link/metadata.json`
  useEffect(() => {
    async function fetchData() {
      console.log('url: ', url)
      const ipfsRes = await fetch(url)
      const ipfsdata = await ipfsRes.json()
      setResponse(ipfsdata)
    } fetchData()
  }, [uri])}
  if (response) {
    setData({
      id: id,
      name: response.name,
      coverArt: response.image,
      audio: response.properties.audio,
      description: response.description,
      maxSupply: maxSupply,
      purchasedAmount: currentSupply,
      // @ts-ignore
      price: weiPrice,
      artistId: creator?.toString(),
    })
  }

  return data
}

export const getArtistProfile = async (id: string) => {
  const response = await fetch(`/api/artists/${id}`)
  const profile = await response.json()
  return await profile
}

export const createArtistProfile = async(artist: Prisma.ArtistCreateInput) => {
  const response = await fetch('/api/artists', {
    method: 'POST',
    body: JSON.stringify(artist)
  })
  const newProfile = await response.json()
  return await newProfile
}

export const getAllCollections = async () => {
  const response = await fetch(`/api/collections`)
  const collections = await response.json()
  return await collections
}