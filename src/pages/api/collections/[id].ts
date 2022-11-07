import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../utils/globals/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
    
  } 

  const { id } = req.query;
  const savedCollection = await prisma.collection.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      owners: true,
    },
  });
  
  return res.json(savedCollection);
  
}