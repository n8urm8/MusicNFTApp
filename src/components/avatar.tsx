import Image from 'next/image'
import Link from 'next/link'


interface AvatarProps {
  avatarURL: string
  name: string
  id: string
}

export const Avatar: React.FC<AvatarProps> = ({avatarURL, name, id}) => {

  return (
    <Link href={`/artists/${id}`} className='relative rounded w-12 h-12'>
      <a className='relative rounded w-12 h-12'>
        <Image src={avatarURL} alt={name} layout='fill' className='object-cover rounded' />
        </a>
    </Link>
  )
}