import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let artistData;
  try {
    artistData = JSON.parse(req.body);
  } catch (e) {
    console.error('json parse error: ', e)
  }

  const savedArtist = await prisma.artist.create({
    data: artistData
  })

  res.json(savedArtist);
}