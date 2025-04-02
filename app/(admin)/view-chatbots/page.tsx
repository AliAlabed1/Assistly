import Avatar from "@/components/Avatar"
import ChatbotsList from "@/components/ChatbotsList"
import { auth } from "@clerk/nextjs/server"

const page = async() => {
  const {userId} = await auth()
  if(!userId) return <div className='animate-spin self-center'><Avatar seed={'loading'}/></div>
  
  return <div className="flex-1pb-20 p-10">
    <h1 className="text-xl md:text-3xl font-semibold mb-5">
      Active Chatbots
    </h1>
    <ChatbotsList userId={userId}/>
  </div>

}

export default page
