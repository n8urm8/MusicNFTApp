import { Artist } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../utils/globals/db';

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
    console.log('params: ', id, ownerID)
    const artist: Artist | null = await prisma.artist.findFirst({
      where: {
        id: ownerID
      }
    })

    savedCollection = await prisma.collection.update({
      where: {
        id: Number(id)
      },
      include: {
        owners: true
      },
      data: {
        owners: {
          connect: {id: ownerID},
        },
        purchasedAmount: {
          increment: Number(purchasedAmount)
        }
      }
    })
  }

  
  return res.json(savedCollection);
  
}