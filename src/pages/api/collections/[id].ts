import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import nftABI from '../../../utils/ABIs/mediaNFT.json';
import { NFTManagerAddress } from '../../../utils/contractAddresses';
import { prisma } from '../../../utils/globals/db';

// @ts-ignore
const httpProvider = new Web3.providers.HttpProvider(process.env.RPC_PRIVATE_ALCHEMY)
const web3Provider = new Web3(httpProvider)
const contract = new web3Provider.eth.Contract(nftABI as unknown as AbiItem, NFTManagerAddress)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let savedCollection;
  if (req.method === 'GET') {
    const { id } = req.query;
    savedCollection = await prisma.collection.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        owners: true,
      },
    })
    
  } else if (req.method === 'POST') {
    const { id, owner, purchasedAmount } = req.query;
    const ownerID = owner?.toString()

    savedCollection = await prisma.collection.update({
      where: {
        id: Number(id)
      },
      include: {
        owners: true
      },
      data: {
        owners: {
          connect: { id: ownerID },
        },
        purchasedAmount: {
          increment: Number(purchasedAmount)
        }
      }
    })
  }

  
  return res.json(savedCollection);
  
}