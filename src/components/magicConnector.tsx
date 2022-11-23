import { Artist } from "@prisma/client"
import Image from 'next/image'
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { getArtistProfile } from "../utils/aggregatorFunctions"

interface MagicConnectorProps {
  account: string | null | undefined
  shortAddress: string
  login: () => void
  showWallet: () => void
  disconnect: () => void
  showEmail: () => void
}

export const MagicConnector: React.FC<MagicConnectorProps> = ({
  account, shortAddress, login, showWallet, disconnect, showEmail
}) => {
  const [profile, setProfile] = useState<Artist>()
  const router = useRouter()
 
  useEffect(() => {
    async function fetchArtist() {
      if (account !== '' && account !== undefined && account !== null) {
        const artistProfile = await getArtistProfile(account)
        if (artistProfile !== null) {
          setProfile({ name: artistProfile.name, id: artistProfile.id, avatar: artistProfile.avatar, email: '' })
        }
        if (artistProfile === null) {
          router.push('/completeProfile')
        }
      }
    } fetchArtist()
  }, [account])


  return (
    <>
    {!account &&
      <button onClick={login} className="primary">
      Sign In
    </button>}
    {account &&
      (<div className="flex gap-1">
      <button onClick={showWallet} className='p-0'>
        {profile ? <Image src={profile?.avatar} width={48} height={48} className='rounded-md' /> : shortAddress}
      </button>
      <button onClick={disconnect} className="secondary">
        Sign out
      </button>
        </div>)}
    </>
  )
}