import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../utils/globals/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let savedArtist;
  if (req.method === 'GET') {
    const { id } = req.query;
    savedArtist = await prisma.artist.findUnique({
      where: {
        id: id?.toString()
      },
    })

  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  return res.json(savedArtist);
}