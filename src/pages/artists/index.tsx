import { Artist, Prisma, PrismaClient } from "@prisma/client";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { WalletContext } from "../../utils/walletContext";

const prisma = new PrismaClient();

export async function getServerSideProps() {
  const artists: Artist[] = await prisma.artist.findMany();
  return {
    props: {
      initialArtists: artists
    }
  }
}

async function saveArtist(artist: Prisma.ArtistCreateInput) {
  const response = await fetch('/api/artists', {
    method: 'POST',
    body: JSON.stringify(artist)
  });

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return await response.json();
}

interface ArtistsProps {
  initialArtists: Artist[]
}

const Artists: NextPage<ArtistsProps> = ({ initialArtists }) => {
  const [artists, setArtists] = useState<Artist[]>(initialArtists);
  const {account} = useContext(WalletContext)

  return (
    <div className="flex flex-col gap-4 p-4">
      <h4 className="bold">Artists</h4>
      <div className="flex">
        {artists?.map((artist, i) => {
          return (
            <Link key={i} href={`/artists/${artist.id}`}><a>
              <div className="rounded-2xl gap-1 relative flex flex-col items-center justify-center p-1 bg-gray-100 border border-gray-300">
                <Image src={artist.avatar} width="318px" height="318px" className="rounded-lg hover:bg-gray" priority={true} />
                <h6 className={`bold ${artist.id === (account?.toString()) && 'text-yellow-500'}`}>{artist.name}</h6>
              </div>
            </a></Link>)
        })}
      </div>
    </div>
  )
}

export default Artists
