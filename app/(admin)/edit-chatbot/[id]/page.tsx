'use client'
import Avatar from '@/components/Avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchCharacteristics, fetchChatbotById } from '@/lib/api'
import { Chatbot, ChatbotCharacteristic } from '@/types/database'
import { useQuery } from '@tanstack/react-query'
import { Copy } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState,use } from 'react'
import { toast } from 'sonner'

const page = ({params}:{params:Promise<{ id: string }>}) => {
  const { id } = use(params);
  const [url,setUrl]= useState<string>('');
  const [chatbotName,setChatbotName] = useState<string>('')
  const [newCharacteristic,setNewCharactristic] = useState<string>('')
  
  const {data:chatbot,isLoading:chatbotLoading,isError:chatbotError} = useQuery<Chatbot>({
    queryKey:['chatbot',id],
    queryFn:()=>fetchChatbotById(id)
  })
  
  const handleChangeChatbotName = (e:React.FormEvent) => {
    e.preventDefault()
  }

  useEffect(()=>{
    if(chatbot){
      setChatbotName(chatbot.name)
      console.log(chatbot)
    }
  },[chatbot])

  useEffect(()=>{
    const url = `localhost:3000/chatbot/${id}`
    setUrl(url)
  },[id])

  if(chatbotLoading ) return <Avatar seed='loading'/>
  if(chatbotError || !chatbot ) return <p>Some thing goes wrong</p>
  
  return (
    <div className='px-0 md:p-10'>
      <div className='md:sticky md:top-0 z-50 sm:max-w-sm ml-auto space-y-2 md:border p-5 rounded-b-lg md:rounded-lg bg-[#2991EE]'>
        <h2 className='text-white text-sm font-bold'>Link to Chat</h2>
        <p className='text-sm italic text-white'>Share this link with your customers to start conversation with your chatbot</p>
        <div className='flex gap-2 items-center'>
        <Link href={url} className='w-full cursor-pointer hover:opacity-50'>
            <Input value={url} readOnly className='cursor-pointer bg-white'/>
        </Link>
        <Button
            size={'sm'}
            className='px-3'
            onClick={()=>{
                navigator.clipboard.writeText(url);
                toast.success('Copied to clipboard');
            }}
        >
            <span className='sr-only'>Copy</span>
            <Copy className='h-4 w-4'/>
        </Button>
      </div>
      </div>
      <section className='relative mt-5 bg-white p-5 md:p-10 rounded-lg'>
        <Button 
            variant={'destructive'} 
            className='absolute top-2 right-2 h-8 w-8' 
            // onClick={()=>handleDelete(id)}
        >
            X
        </Button>
        <div className='flex gap-3 items-center mt-5 w-full'>
            <Avatar seed = {chatbotName} className='w-[50px] h-[50px]'/>
            <form onSubmit={handleChangeChatbotName} className='flex gap-3 items-center w-full'>
              <Input 
                value={chatbotName} 
                onChange={(e)=>setChatbotName(e.target.value)}
                className='w-full border-none bg-transparent text-xl font-bold'
              />
              <Button  type = 'submit' disabled={!chatbotName}>Update</Button>
            </form>
            <ul>

            </ul>
        </div>
        <h2 className='text-xl font-bold mt-10'>Heres what your AI knows...</h2>
        <p>
          Your chatbot is equipied with the following information to assist you in your conversation with your customers & users
        </p>
        <div>
          <form className='flex gap-2 items-center' action="">
            <Input
              type = 'text'
              value = {newCharacteristic}
              onChange={(e)=>setNewCharactristic(e.target.value)}
              placeholder='Example: If customre asks for prices provide pricing page: www.example.com/pricing'
            />
            <Button 
              type='submit'
              disabled = {!newCharacteristic}>
                Add
              </Button>
          </form>
          <ul>
            {
              chatbot.characteristics?.map((characteristic:ChatbotCharacteristic)=>(
                <p key={characteristic.id}>{characteristic.content}</p>
              ))
            }
          </ul>
        </div>
      </section>
      
    </div>
  )
}

export default page
