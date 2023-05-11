import { getFriendsByUserId } from '@/app/helpers/get-friends-by-user-id';
import { fetchRedis } from '@/app/helpers/redis';
import { authOptions } from '@/lib/auth'
import { chatHrefConstructor } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation';
import { FC } from 'react'
import Link from 'next/link';
import Image from 'next/image';

const page = async ({ }) => {
  const session = await getServerSession(authOptions);

  if (!session) notFound()
  const friends = await getFriendsByUserId(session.user.id)
  const friendsWithLastMessages = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = await fetchRedis('zrange', `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`, -1, -1) as string[]
      const lastMessage = JSON.parse(lastMessageRaw) as Message
      return {
        ...friend,
        lastMessage
      }
    })
  )

  return (
    <div className='container py-12'>
      <h1 className='font-bold text-5xl mb-0'>Recent chats</h1>
      {friendsWithLastMessages.length === 0 ? (
        <p className='text-sm text-zinc-500 '>Nothing to show here....</p>
      ) : friendsWithLastMessages.map((friend) => (
        <div key={friend.id} className='relative bg-zinc-50 border-zinc-200 p-3 rounded-md'>
          <div className="absolute right-4 inset-y-0 flex items-center">
            <ChevronRight className='h-7 w-7 text-zinc-400' />
          </div>
          <Link className='relative sm:flex' href={`/dashboard/chat/${chatHrefConstructor(session.user.id, friend.id)}`}>
            <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
              <div className="relative h-6 w-6">
                <Image referrerPolicy='no-referrer' className='rounded-full' alt={`${friend.name} profile picture`} src={friend.image} fill />
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold">{friend.name}</h4>
              <p className="mt-1 max-w-md">
                <span className="text-zinc-400">
                  {friend.lastMessage.senderId === session.user.id ? 'You: ' : ''}
                  {friend.lastMessage.text}
                </span>
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default page