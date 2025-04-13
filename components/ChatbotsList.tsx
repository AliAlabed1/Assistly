'use client'
import { get_user_chatbots } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import Avatar from './Avatar'
import { Chatbot } from '@/types/database'
import ChatbotCard from './ChatbotCard'
import { Button } from './ui/button'
import Link from 'next/link'

const ChatbotsList = ({userId}:{userId:string}) => {
    const {data:chatbots,isLoading,isError} = useQuery<Chatbot[]>({
        queryKey:['UserChatbots',userId],
        queryFn:()=>get_user_chatbots({user_id:userId})
    })
    if(isLoading) return <div className='animate-spin self-center m-auto'><Avatar seed={'loading...'}/></div>
    if(!chatbots) return <div>Something went wrong! </div>
    const sortedChatbots:Chatbot[] = [...chatbots].sort(
        (a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    return (
        <div className='flex-1'>
            <h1 className="text-xl md:text-3xl font-semibold mb-5">
                Active Chatbots
            </h1>                                                       
            {
                sortedChatbots.length === 0 ? 
                <div>
                    <p>
                        You have not created any chatbots yet, Click on the button bellow to create one.
                    </p>
                    <Link href='/create-chatbot'>
                        <Button className='bg-[#64B5F5] text-white p-3 rounded-md mt-5'>
                            Create Chatbot
                        </Button>
                    </Link>
                </div>:
                <ul className='flex flex-col items-start justify-center'>
                    {    
                        sortedChatbots.map((chatbot:Chatbot)=>(
                        
                            <Link key={chatbot.id} href={`/edit-chatbot/${chatbot.id}`} className='w-full relative flex mt-5 bg-white p-10 rounded-md'>
                                <ChatbotCard chatbot={chatbot} />
                            </Link>
                        ))
                    }
                </ul>
            }
        </div>
    )
}

export default ChatbotsList
