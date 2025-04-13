import { AddGuestInput, AddMessageInput, AddSessionInput, CharacteristicInput, Chatbot,ChatbotCharacteristic,ChatSession,CreateChatbotInput, Guest, Message, UpdateChatbotNAmeInput } from "@/types/database";
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

export const delet_characteristic = async({id}:{id:string}):Promise<any>=>{
    const res = await fetch(`${API_BASE}/characteristic_del/${id}/`,{method:"DELETE"})
    if(!res.ok)
        throw new Error('Failed to delete characteritic!')
    return res
}

export const delete_chat_bot = async({id}:{id:string}):Promise<any>=>{
    const res = await fetch(`${API_BASE}/chatbot_del/${id}/`,{method:"DELETE"})
    if(!res.ok)
        throw new Error('Failed to delete Chatbot!')
    return res
}


export const get_user_chatbots = async({user_id}:{user_id:string}):Promise<Chatbot[]>=>{
    const res = await fetch(`${API_BASE}/user_chatbots/${user_id}`)
    if(!res.ok)
        throw new Error(`Couldn't fetch chatbots for the user with id ${user_id}`)
    return res.json()
}   

export const createCharacteristic = async(input:CharacteristicInput):Promise<ChatbotCharacteristic> =>{
    const res = await fetch(`${API_BASE}/characteristic/create/`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(input)
    })
    if (!res.ok){
        const error = await res.json();
        throw new Error(error.detail || 'Failed to create characteristic');
    }
    return res.json();
}

export const updateChatbotName = async(input:UpdateChatbotNAmeInput):Promise<any>=>{
    const res = await fetch(
        `${API_BASE}/change_chatbot_name/`,
        {
            method:'PUT',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({
                id:input.id,
                new_name:input.newName
            })
        }
    )
    if(!res.ok){
        throw new Error('Change chatbot name failed')
    }
    return res.json()
}

export const getSessionById = async(sessionId:number):Promise<ChatSession>=>{
    const res = await fetch(`${API_BASE}/sessions/${sessionId}/`)
    if(!res.ok) throw new Error('Failed to fetch session')
    return res.json()
}

export const addGuest = async (input:AddGuestInput):Promise<Guest>=>{
    console.log('add function')
    const res = await fetch(`${API_BASE}/add_guest/`,{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(input)
    })
    if(!res.ok)
        throw new Error('Add new guest failed!')
    return res.json()
}

export const addSession = async (input:AddSessionInput):Promise<ChatSession>=>{
    const res = await fetch(`${API_BASE}/add_session/`,{
        method:"POST",
        headers:{
            'content-type':'application/json',
        },
        body:JSON.stringify(input)
    })
    if(!res.ok)
        throw new Error('Create Setion Failed!')
    return res.json()
}

export const addNewMessage = async(input:AddMessageInput):Promise<Message>=>{
    const res = await fetch(`${API_BASE}/add_message/`,{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(input)
    })
    if(!res.ok)
        throw new Error("Adding Message Failed")
    return res.json()
}

export const getMessages = async (sessionId:number):Promise<Message[]>=>{
    const res = await fetch(`${API_BASE}/session_messages/${sessionId}/`)
    if(!res.ok)
        throw new Error('failed to fetch messages!')
    return res.json()
}