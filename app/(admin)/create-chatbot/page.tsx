import Avatar from '@/components/Avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

const CreateChatbot = () => {
  return (
    <div className='flex flex-col justify-center items-center md:flex-row bg-white p-10 rounded-md m-10 gap-5'>
        <Avatar
            seed='create-chatbot'
        />
        <div className='flex flex-col gap-5'>
            <h1 className='text-xl lg:text-3xl font-semibold'>Create</h1>
            <h2 className='font-light'>Create a new chatbot assist you in your conversations with your customers</h2>
            <form className='flex flex-col md:flex-row gap-5'>
                <Input
                    placeholder='Chatbot Name...'
                    className='max-w-lg'
                    type='text'
                    required

                />
                <Button className='bg-blue-600 text-white'>Create Chatbot</Button>
            </form>
        </div>
    </div>
  )
}

export default CreateChatbot
