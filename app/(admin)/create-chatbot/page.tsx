"use client"
import Avatar from '@/components/Avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createChatbot } from '@/lib/api'
import { Chatbot, CreateChatbotInput } from '@/types/database'
import { useUser } from '@clerk/nextjs'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

const CreateChatbot = () => {
  const {user} = useUser();     
  const [name,setName] = useState<string>('')
  const router = useRouter()
  const mutation = useMutation<Chatbot,Error,CreateChatbotInput>({
    mutationFn:createChatbot,
    onSuccess:(data)=>{
        toast.success(`Chatbot "${data.name}" created successfully!`)
        setName('')
        router.push(`/edit-chatbot/${data.id}`)
    },
    onError:(err) =>{
        toast.error(`Error: ${err.message}`)
    }
  })
  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    try {
        mutation.mutate({
            clerk_user_id: user && user.id,
            name
        })
    } catch (error) {
        console.error(error)
    }
  }
  if(!user) return null;
  return (
    <div className='flex flex-col justify-center items-center md:flex-row bg-white p-10 rounded-md m-10 gap-5'>
        <Avatar
            seed='create-chatbot'
        />
        <div className='flex flex-col gap-5'>
            <h1 className='text-xl lg:text-3xl font-semibold'>Create</h1>
            <h2 className='font-light'>Create a new chatbot assist you in your conversations with your customers</h2>
            <form className='flex flex-col md:flex-row gap-5' onSubmit={handleSubmit}>
                <Input
                    placeholder='Chatbot Name...'
                    className='max-w-lg'
                    type='text'
                    required
                    value={name}
                    onChange={(e)=>setName(e.target.value)}

                />
                <Button disabled = {mutation.isPending || !name} className='bg-blue-600 text-white'>
                    {
                        mutation.isPending ? '...' :'Create Chatbot'
                    }
                </Button>
            </form>
            <p className='text-gray-300 mt-5'>
                 Example: Customer Support Chatbot
            </p>
        </div>
    </div>
  )
}

export default CreateChatbot
