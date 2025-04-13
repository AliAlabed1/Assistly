import Avatar from "@/components/Avatar"
import ChatbotsList from "@/components/ChatbotsList"
import { auth } from "@clerk/nextjs/server"

const page = async() => {
  const {userId} = await auth()
  if(!userId) return null


  return <ChatbotsList userId={userId}/>

}

export default page
