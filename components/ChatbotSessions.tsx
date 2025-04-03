'use client'
import { Chatbot, ChatSession } from '@/types/database'
import { useEffect, useState } from 'react'
import{
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion"
import Avatar from './Avatar'
import Link from 'next/link'
import ReactTimeago from 'react-timeago'
const ChatbotSessions = ({chatbots}:{chatbots?:Chatbot[]}) => {
  const [sortedChatbots,setSortedChatbots] = useState<Chatbot[]>()

  useEffect(()=>{
    if(chatbots){
        const sortedArray = [...chatbots].sort(
            (a,b)=> b.chat_sessions.length - a.chat_sessions.length
        )
        setSortedChatbots(sortedArray)
    }
  },[chatbots])
  return (
    <div className='bg-white'>
        <Accordion type='single' collapsible>
            {
                sortedChatbots?.map((chatbot)=>{
                    const hasSessions = chatbot.chat_sessions.length>0;
                    return(
                        <AccordionItem 
                            key={chatbot.id} 
                            value={`item-${chatbot.id}`}
                            className='px-10 py-5'
                        >
                            {
                                hasSessions ? (
                                    <>
                                        <AccordionTrigger >
                                            <div className='flex text-left items-center w-full space-x-3'>
                                                <Avatar seed={chatbot.name}/>
                                                <div className='flex flex-1 justify-between space-x-4'>
                                                    <p>{chatbot.name}</p>
                                                    <p className='pr-4 font-bold text-right'>
                                                        {chatbot.chat_sessions.length} Sessions
                                                    </p>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent
                                            className='space-y-5 p-5 bg-gray-100 rounded-md'
                                        >   
                                            {
                                                chatbot.chat_sessions.map((session:ChatSession)=>(
                                                    <Link 
                                                        href={`/review-sessions/${session.id}`}
                                                        key={session.id}
                                                        className='relative p-10 bg-[#2991EE] text-white rounded-md block'>
                                                            <p className='text-lg font-bold'>
                                                                {session.guest?.name || "Anonymous" }
                                                            </p>
                                                            <p className='text-sm font-light'>{session.guest?.email || 'No email provided'}</p>
                                                            <ReactTimeago date={new Date(session.created_at)}/>
                                                        </Link>

                                                ))
                                            }
                                        </AccordionContent>
                                    </>
                                ):(
                                    <p className='font-light'>{chatbot.name} No Sessions</p>
                                )
                            }
                        </AccordionItem>
                    )
                })
            }
        </Accordion>
    </div>
  )
}

export default ChatbotSessions
