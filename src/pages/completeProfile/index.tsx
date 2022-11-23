import { Artist } from '@prisma/client';
import { NextPage } from "next";
import { useRouter } from 'next/router';
import { useContext, useRef } from "react";
import { createArtistProfile } from '../../utils/aggregatorFunctions';
import { WalletContext } from "../../utils/walletContext";


const CompleteProfile: NextPage = () => {
  const wallet = useContext(WalletContext)
  const router = useRouter()
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const randomNumber = Math.floor(Math.random() * (100 - 0 + 1)) + 0;

  const handleCreateArtistProfile = async() => {
    const nameString = nameRef.current!.value
    const emailString = emailRef.current!.value
    const data: Artist = {
      //@ts-ignore
      id: wallet.account,
      name: nameString,
      email: emailString,
      avatar: `https://picsum.photos/${randomNumber}/200`
    }
    console.log('data to send:', data)
    const newProfile = await createArtistProfile(data)
    console.log('new profile:',newProfile)
    if (newProfile !== undefined || newProfile !== null) {
      router.push('/')
    }
  }

  return (
    <div className='flex flex-col w-80 m-auto gap-8 mt-4'>
      <h4 className='bold'>Complete Profile</h4>
      <div className='flex flex-col'>
        <label
          className="text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          ref={nameRef}
          id="name"
          placeholder="Name"
          type="text"
          className="mb-2"
          required
        />
        <label
          className="text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email Address
        </label>
        <input
          ref={emailRef}
          id="email"
          placeholder="Email Address"
          type="email"
          className="mb-3"
          required
        />
        <button onClick={handleCreateArtistProfile} className='primary' type='button'>Create Profile</button>
      </div>
    </div>
  )
}

export default CompleteProfile