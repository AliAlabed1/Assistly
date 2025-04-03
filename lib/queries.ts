import { Chatbot, ChatSession } from "@/types/database";
import { useQuery } from "@tanstack/react-query";
import { fetchChatbotById, get_user_chatbots, getSessionById } from "./api";

export const useChatbotQuery = (id:string)=>{
    return useQuery<Chatbot>({
        queryKey:['chatbot',id],
        queryFn:()=>fetchChatbotById(id),
    })
}

export const useUSerChatbotsQuery = (userId:string)=>{
    return useQuery<Chatbot[]>({
        queryKey:['UserChatbots',userId],
        queryFn:()=>get_user_chatbots({user_id:userId})
    })
}

export const useGetSessionQuery = (sessionId:number)=>{
    return useQuery<ChatSession>({
        queryKey:['ChatSession',sessionId],
        queryFn:()=>getSessionById(sessionId)
    })
}