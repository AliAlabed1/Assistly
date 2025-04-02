import { Chatbot, ChatbotCharacteristic } from '@/types/database'
import React from 'react'
import Avatar from './Avatar'

const ChatbotCard = ({chatbot}:{chatbot:Chatbot}) => {
  return (
    <div className='w-full'>
      <div>
        <div className='flex item-center gap-4'>
          <Avatar seed={chatbot.name} />
          <h2 className='text-xl font-bold self-center'>{chatbot.name}</h2>
        </div>
        <p className='absolute top-5 right-5 text-xs text-gray-400'>
          Last modeified:{ new Date(chatbot.created_at).toLocaleDateString()}
        </p>
      </div>
      <hr className='mt-2 w-full'/>
      <div className='md:grid md:grid-cols-2 gap-10 md:gap-5 p-5'>
        <h3 className='italic'>Characteristics:</h3>
        {
          chatbot.characteristics.length < 1 ?
          <p className='text-sm text-gray-400'>No characteristics yet.</p>:
          <ul className='text-xs'>
            {
              chatbot.characteristics.map((characteristic:ChatbotCharacteristic)=>(
                <li className='list-disc break-words'key={characteristic.id}>
                  {characteristic.content}
                </li>
              ))
            }
          </ul>
        }
        <h3 className='italic'>Number of Sessions:</h3>
        <p className='text-xs'>{chatbot.chat_sessions.length}</p>
      </div>
    </div>
  )
}

export default ChatbotCard
