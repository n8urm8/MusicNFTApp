import { Artist } from "@prisma/client"
import { Avatar } from './avatar'

interface CollecitonOwners {
  owners?: Artist[]
}

export const CollectionOwners: React.FC<CollecitonOwners> = ({ owners }) => {

  return (
    <div className="flex gap-2 mt-2">
      {owners?.map((owner, i) => {
        return <Avatar key={i} avatarURL={owner.avatar} name={owner.name} id={owner.id} />
      })}
    </div>
  )
}