import { Collection } from "@prisma/client";

export interface Collectible extends Collection {
  owners?: object[] | string[]
}

export interface IPFSDataProps {
  name: string
  description: string
  image: string
  properties: {
    audio: string
  }
}