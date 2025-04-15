import { AddGuestInput, Guest, Message, sendMessageInput, StartChat } from "@/types/database"
import { useMutation } from "@tanstack/react-query"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { addGuest, addNewMessage, addSession, fetchChatbotById, getMessages } from "./api"
import { toast } from "sonner"
import { NextResponse } from "next/server"
import { ChatCompletionMessageParam } from "openai/resources/index.mjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const startNewChatSession = async(input:StartChat) =>{
  try {
    
    const guestData = await addGuest({
      name:input.userName,
      email:input.userEmail
    });
    

    const sessionData = await addSession({
      chatbot_id:input.chatbotId,
      guest_id:guestData.id
    });
    
    const message = await addNewMessage({
      content:`Hi ${guestData.name} how can I help you today!`,
      chat_session_id:sessionData.id,
      sender:"ai"
    })

    return {
      sessionId:sessionData.id,
      guestId:guestData.id
    };
  } catch (error) {
    throw error;
  }
}

export const sendMessage = async(input:sendMessageInput):Promise<NextResponse>=>{
  const {chat_session_id,chatbot_id,content,name} = input;
  
  try {
    
    const chatbot = await fetchChatbotById(chatbot_id)
    if(!chatbot){
      return NextResponse.json({error:"Chatbot not found"});
    }
    
    
    const previousMessages = await getMessages(chat_session_id)
    if(!previousMessages)
        return NextResponse.json(
            {error:"failed to load previous messages"},
            {status:500}
        )
    
    const formattedMessages:ChatCompletionMessageParam[] = previousMessages.map((message)=>({
        role: message.sender === "ai" ? "system" : "user",
        name: message.sender ==="ai"? "system":name,
        content:message.content
    }))

    const systemPrompt = chatbot.characteristics.map((c)=>c.content).join(" + ")

    

    const messages:ChatCompletionMessageParam[] = [
        {
            role:"system",
            name:"system",
            content:`you are a helpful assistant talking to ${name}. If a ageneric question is asked wich is not relevent or in the same scope or domain as the points in mentioned in the key information section, kindly inform the user they're only allowed to search for the specified content. Use Emoji's where possible.Don't tell every thing about the information just wait the user to ask then answer him. Here is some key information that you need to be aware of, these are elements you may be asked about:${systemPrompt}`
        },
        ...formattedMessages,
        {

            role:"user",
            name:name,
            content:content
        }
    ]
    
    const openaiResponse  = await fetch('https://openrouter.ai/api/v1/chat/completions',{
        method:"POST",
        headers:{
            'content-type':'application/json',
            'Authorization':`Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        },
        body:JSON.stringify({
            model: "deepseek/deepseek-r1:free",
            messages:messages
        }),
        
    })
    
    const data = await openaiResponse.json()
    
    const aiResponse = data?.choices?.[0]?.message?.content?.trim();
    
    if(!aiResponse){
      return NextResponse.json(
          {error:"failed to generate AI response"},
          {status:500}
      )
    }
    

    return NextResponse.json({
      content:aiResponse
    })
    


  } catch (error) {
    
    return NextResponse.json({error},{status:500})
  }
}
