import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let collectionData;
  let savedCollection;
  if (req.method === 'POST') {
    collectionData = JSON.parse(req.body);
    savedCollection = await prisma.collection.create({
      data: collectionData
    })
  } else if (req.method === 'GET') {
    savedCollection = await prisma.collection.findMany({
      include: {
        owners: true,
      },
    })
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
 
  return res.json(savedCollection);
}