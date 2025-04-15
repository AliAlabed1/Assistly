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
    console.log('guestData:',guestData)

    const sessionData = await addSession({
      chatbot_id:input.chatbotId,
      guest_id:guestData.id
    });
    console.log('sessionData:',sessionData)
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
  console.log('starting chat')
  try {
    console.log('fetching chatbot by id')
    const chatbot = await fetchChatbotById(chatbot_id)
    if(!chatbot){
      return NextResponse.json({error:"Chatbot not found"});
    }
    console.log('fetching done')
    console.log('fetching messages')
    const previousMessages = await getMessages(chat_session_id)
    if(!previousMessages)
        return NextResponse.json(
            {error:"failed to load previous messages"},
            {status:500}
        )
    console.log('fetching done')
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
    console.log('dending to dep seek')
    const openaiResponse  = await fetch('https://openrouter.ai/api/v1/chat/completions',{
        method:"POST",
        headers:{
            'content-type':'application/json',
            'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`
        },
        body:JSON.stringify({
            model: "mistralai/mistral-7b-instruct:free",
            messages:messages
        }),
        
    })
    // const openaiResponse = await openai.chat.completions.create({
    //     messages:messages,
    //     model:'deepseek/deepseek-r1:free'
    // })
    console.log(openaiResponse)
    const data = await openaiResponse.json()
    console.log('the response is:',data?.choices)
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
    console.log("Error sending Message:",error)
    return NextResponse.json({error},{status:500})
  }
}
