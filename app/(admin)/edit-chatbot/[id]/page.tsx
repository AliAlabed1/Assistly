'use client'
import Avatar from '@/components/Avatar'
import Characteristic from '@/components/Characteristic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {  createCharacteristic, delete_chat_bot, fetchChatbotById, updateChatbotName } from '@/lib/api'
import { CharacteristicInput, Chatbot, ChatbotCharacteristic, UpdateChatbotNAmeInput } from '@/types/database'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Copy } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState,use } from 'react'
import { toast } from 'sonner'

const page = ({params}:{params:Promise<{ id: string }>}) => {
  const queryClient = useQueryClient();
  const { id } = use(params);
  const [url,setUrl]= useState<string>('');
  const [chatbotName,setChatbotName] = useState<string>('')
  const [newCharacteristic,setNewCharactristic] = useState<string>('')
  const router = useRouter()
  const mutation = useMutation<any,Error,{id:string}>({
    mutationFn:delete_chat_bot,
    onSuccess:(data)=>{
      toast.success("Chatbot deleted!")
    },
    onError:(data)=>{
      toast.error(data.message)
    }
  })

  const addCharMutation = useMutation<ChatbotCharacteristic,Error,CharacteristicInput>({
    mutationFn:createCharacteristic,
    onSuccess(data, variables, context) {
      toast.success("Characteristic added!"),
      queryClient.invalidateQueries({
        queryKey:['chatbot',id]
      })
    },
    onError(data){
      toast.error("Adding Characteristic failed")
    }
  });

  const updateNameMutation = useMutation<any,Error,UpdateChatbotNAmeInput>({
    mutationFn:updateChatbotName,
    onSuccess:(data)=>{
      toast.success("Updating Name is done!")
    },
    onError:(data)=>{
      toast.error("Updating failed!")
    }

  })
  const {data:chatbot,isLoading:chatbotLoading,isError:chatbotError} = useQuery<Chatbot>({
    queryKey:['chatbot',id],
    queryFn:()=>fetchChatbotById(id),
  })
  
  const handleChangeChatbotName = (e:React.FormEvent) => {
    e.preventDefault();
    try {
      updateNameMutation.mutate({
        id:id,
        newName:chatbotName
      })
    } catch (error) {
      toast.error('Unexpected Error')
    }
  }
  const handleAddChar = (e:React.FormEvent)=>{
    e.preventDefault();
    
    try {
      addCharMutation.mutate({
        content:newCharacteristic,
        chatbot_id:id
      })
    } catch (error) {
      toast.error("Unexpected error")
    }
    setNewCharactristic('')
  }

  const handleDeleteChatbot = () =>{
    try {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this chatbot?"
      )
      if(!isConfirmed) return;
      mutation.mutate({id})
      router.push('/view-chatbots')

    } catch (error) {
      toast.error('Unexpected Error')
    }
  }

  useEffect(()=>{
    if(chatbot){
      setChatbotName(chatbot.name)
    }
  },[chatbot])

  useEffect(()=>{
    const url = `localhost:3000/chatbot/${id}`
    setUrl(url)
  },[id])

  if(chatbotLoading ) return <div className='animate-spin self-center m-auto'><Avatar seed={'loading'}/></div>
  if(chatbotError || !chatbot ) return <p>Some thing went wrong</p>
  
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
            onClick={handleDeleteChatbot}
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
              <Button  type = 'submit' disabled={chatbotName === chatbot.name}>
                {
                  updateNameMutation.isPending ? 'Updateing..':'Update'
                }
              </Button>
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
              disabled = {!newCharacteristic}
              onClick={handleAddChar}
            >
              {
                addCharMutation.isPending?
                'Adding..':'Add'
              }
            </Button>
          </form>
          <ul className='flex flex-wrap-reverse gap-3 mt-3'>
            {
              chatbot.characteristics?.map((characteristic:ChatbotCharacteristic)=>(
                <Characteristic
                  key = {characteristic.id}
                  characteristic={characteristic}
                />
              ))
            }
          </ul>
        </div>
      </section>
      
    </div>
  )
}

export default page
