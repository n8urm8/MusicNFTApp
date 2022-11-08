import { Collection } from "@prisma/client";

export interface Collectible extends Collection {
  owners?: object[] | string[]
}