'use client'
export const dynamic = 'force-dynamic'
import Avatar from '@/components/Avatar';
import Messages from '@/components/Messages';
import { useGetSessionQuery } from '@/lib/queries';
import { Message } from '@/types/database';
import React, { use } from 'react'

const Page = ({params}:{params:Promise<{ id: number }>}) => {
  const { id } = use(params);
  const {data,isLoading,error} = useGetSessionQuery(id)
  if(isLoading) return <div className='self-center animate-spin'><Avatar seed='Loading...'/></div>
  if(error || !data) return <div>Something went wrong</div>
  const sortedMessages = data?.messages.sort(
    (a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  return (
    <div className='flex-1 pb-24 p-10 '>
      <h1 className='text-xl md:text-3xl font-semibold'>Session Review</h1>
      <p className='font-light text-xs text-gray-400 mt-2'>Started at {new  Date(data.created_at).toLocaleString()}</p>
      <h2 className='font-light mt-2'>
        Between {data.chatbot_name} & {" "}
        <span className='font-extrabold'>{data.guest.name} ({data.guest.email})</span>
      </h2>
      <hr className='my-10'/>
      <Messages 
        messages={sortedMessages}
        chatSessionId={data.id}
        chatbotName={data.chatbot_name}
        guestName={data.guest.name}
      />
    </div>
  )
}

export default Page
