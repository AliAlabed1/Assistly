import { BotMessageSquare, PencilLine, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
const Sidebar = () => {
  const links = [
    {
      icon:<BotMessageSquare className='h-6 w-6 md:h-8 md:w-8'/>,
      text1:"Create",
      text2:"New Chatbot",
      href:'/create-chatbot'
    },
    {
      icon:<PencilLine className='h-6 w-6 md:h-8 md:w-8'/>,
      text1:"Edit",
      text2:"Chatbots",
      href:''
    },
    {
      icon:<SearchIcon className='h-6 w-6 md:h-8 md:w-8'/>,
      text1:"View",
      text2:"Sessions",
      href:''
    },
  ]
  return (
    <div className='bg-white text-white p-5'>
      <ul className='gap-5  flex md:flex-col'>
        {
            links.map((link,i)=>(
              <li className='flex-1' key={`${link}_${i}`}>
                <Link 
                  href={link.href}
                  className='hover:opacity-50 flex flex-col text-center md:text-left md:flex-row items-center gap-2 p-5 rounded-md bg-[#2991EE]'
                >
                  {link.icon}
                  <div className='hidden md:inline'>
                    <p className='text-xl'>{link.text1}</p>
                    <p className='text-sm font-extralight'>{link.text2}</p>
                  </div>
                </Link>
              </li>
            ))
        }
      </ul>
    </div>
  )
}

export default Sidebar
