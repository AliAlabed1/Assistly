'use client'
import { delet_characteristic } from '@/lib/api'
import { ChatbotCharacteristic } from '@/types/database'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { OctagonX } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const Characteristic = ({characteristic}:{characteristic:ChatbotCharacteristic}) => {
  const queryClient = useQueryClient()
  
  const mutation = useMutation<any,Error,{id:string}>({
    mutationFn:delet_characteristic,
    onSuccess:async (data)=>{
        await queryClient.refetchQueries({
            queryKey: ['chatbot', characteristic.chatbot_id.toLocaleString()],
        });
        toast.success('Characteristic deleted successfuly!')
    },
    onError:(data)=>{
        toast.error('An unexpected error accured!')
    }
})
  const handleRemoveCharacteristic = async()=>{
    try {
        mutation.mutate({
            id:characteristic.id
        })
    } catch (error) {
        console.error(error)
    }
  }
  return (
    <li className='relative p-10 bg-white border rounded-md'>
        {characteristic.content}
        <OctagonX 
            className='w-6 h-6 text-white fill-red-500 absolute top-1 right-1 cursor-pointer hover:opacity-50'
            onClick={handleRemoveCharacteristic}
        />
    </li>
  )
}

export default Characteristic
