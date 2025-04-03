'use client'
import Avatar from '@/components/Avatar'
import ChatbotSessions from '@/components/ChatbotSessions'
import { useUSerChatbotsQuery } from '@/lib/queries'
import { Chatbot, ChatSession } from '@/types/database'
import { RedirectToSignIn, useUser } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const page = () => {
  const {user} = useUser()
  if(!user) return <div className='self-center'>Something went wrong</div>
  const {data,isLoading,error} = useUSerChatbotsQuery(user.id)
  if(isLoading) return <div className='self-center animate-spin'><Avatar seed={'Loading...'}/></div>
  if(error) return <div className='self-center'>Something went wrong</div>
  const sortedChatbots:Chatbot[]|undefined = data?.map((chatbot:Chatbot)=>({
    ...chatbot,
    chatboSession:[...chatbot.chat_sessions].sort(
      (a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }))
  return (
    <div className='flex-1 px-10'>
      <h1 className='text-xl lg:text-3xl font-semibold mt-10'>Chat Sessions</h1>
      <h2 className='mb-5'>Review all the chat sessions the chat  bots have had with your customers</h2>
      <ChatbotSessions chatbots = {sortedChatbots}/>
    </div>
  )
}

export default page
