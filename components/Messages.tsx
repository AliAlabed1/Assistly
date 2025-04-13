import { Message } from '@/types/database'
import { UserCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Avatar from './Avatar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { useEffect, useRef } from 'react';
const Messages = ({messages,chatSessionId,chatbotName,guestName}:{messages:Message[],chatSessionId:number,chatbotName:string,guestName:string}) => {
  const ref = useRef<HTMLDivElement>(null)
  const path = usePathname();
  const isReviewPage = path.includes('review-sessions')
  useEffect(()=>{
    if(ref.current){
        ref.current.scrollIntoView({behavior:"smooth"})
    }
  },[messages])
  console.log(messages)
  return (
    <div className='flex-1 flex flex-col overflow-y-auto space-y-10 py-10 px-5 bg-white rounded-lg'>
      {
        messages.map((message)=>{
            const isSender = message.sender !== 'user';

            return(
                <div
                    key={message.id}
                    className={`chat ${isSender?"chat-start":"chat-end"} relative`}
                > 
                    {
                        isReviewPage && (
                            <p className='absolute -bottom-5 text-xs text-gray-300'>
                                sent {new Date(message.created_at).toLocaleString()}
                            </p>
                        )
                    }
                    <div className={`chat-image avatar w-10 ${!isSender&&"-mr-4 "}`}>
                        {
                            isSender?(
                                <Avatar
                                    seed = {chatbotName}
                                    className='h-12 w-12 bg-white rounded-full border-2 bodrer-[#2991EE]'
                                />
                            ):(
                                <UserCircle className='text-[#2991EE]'/>
                            )
                        }
                    </div>
                    <div className={`chat-bubble ${isSender?"chat-bubble-primary bg-[#4D7DfB]":"chat-bubble-secondary bg-gray-200 text-gray-700"}`}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                        >
                            {message.content}
                        </ReactMarkdown> 
                    </div>
                </div>
                
            )
        })
      }
      <div ref={ref}></div>
    </div>
  )
}

export default Messages
