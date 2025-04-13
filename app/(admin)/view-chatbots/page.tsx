import Avatar from "@/components/Avatar"
import ChatbotsList from "@/components/ChatbotsList"
import { auth } from "@clerk/nextjs/server"

const Page = async() => {
  const {userId} = await auth()
  if(!userId) return null


  return <ChatbotsList userId={userId}/>

}

export default Page
