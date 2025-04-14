import { addNewMessage, fetchChatbotById, getMessages } from "@/lib/api";

import { NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai'
import { ChatCompletion, ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
})
export async function POST(req:NextRequest){
    const {chat_session_id,chatbot_id,content,name} = await req.json();
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
                model: "deepseek/deepseek-r1:free",
                messages:messages
            })
        })
        // const openaiResponse = await openai.chat.completions.create({
        //     messages:messages,
        //     model:'deepseek/deepseek-r1:free'
        // })
        const data = await openaiResponse.json()
        console.log('the response is:',data.choices)
        const aiResponse = data?.choices?.[0]?.message?.content?.trim();
        
        if(!aiResponse){
            return NextResponse.json(
                {error:"failed to generate AI response"},
                {status:500}
            )
        }

        await addNewMessage({
            content:content,
            sender:"user",
            chat_session_id:chat_session_id
        })

        const aiMessageResult = await addNewMessage({
            content:aiResponse,
            sender:'ai',
            chat_session_id:chat_session_id
        })

        return NextResponse.json({
            id:aiMessageResult.id,
            content:aiResponse
        })
        


    } catch (error) {
        console.log("Error sending Message:",error)
        return NextResponse.json({error},{status:500})
    }
}