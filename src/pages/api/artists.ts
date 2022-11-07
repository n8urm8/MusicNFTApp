import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const artistData = JSON.parse(req.body);

  const savedArtist = await prisma.artist.create({
    data: artistData
  })

  res.json(savedArtist);
};