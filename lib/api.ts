import { Chatbot,ChatbotCharacteristic,CreateChatbotInput } from "@/types/database";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export const createChatbot = async(input:CreateChatbotInput):Promise<Chatbot> =>{
    const res = await fetch(`${API_BASE}/chatbots/`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(input)
    })
    if (!res.ok){
        const error = await res.json();
        throw new Error(error.detail || 'Failed to create chatbot');
    }
    return res.json();
}

export const fetchChatbotById = async(id:string):Promise<Chatbot>=>{
    const res = await fetch(`${API_BASE}/chatbots/${id}`);
    if(!res.ok) throw new Error("Chatbot not found");
    return res.json()
}

export const fetchCharacteristics = async(id:string):Promise<[ChatbotCharacteristic]> => {
    const res = await fetch(`${API_BASE}/chatbots/${id}/characteristics`);
    if(!res.ok) throw new Error("Chatbot not found");
    return res.json()
}   