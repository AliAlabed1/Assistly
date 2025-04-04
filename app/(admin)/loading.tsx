import Avatar from '@/components/Avatar'
import React from 'react'

const Loading = () => {
  return (
    <div className='mx-auto animate-pulse p-10'>
      <Avatar seed='loading...'/>
    </div>
  )
}

export default Loading
