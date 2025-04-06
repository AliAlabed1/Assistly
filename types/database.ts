// types/database.ts

export interface Chatbot {
  id: number;
  clerk_user_id: string;
  name: string;
  created_at: string; // ISO timestamp
  characteristics:[ChatbotCharacteristic],
  chat_sessions:[ChatSession]
}

export interface ChatbotCharacteristic {
  id: string;
  chatbot_id: string;
  content: string;
  created_at: string;
}

export interface Guest {
  id: number;
  name: string ;
  email: string ;
  created_at: string;
}

export interface ChatSession {
  id: number;
  chatbot_id: number;
  guest_id: number | null;
  created_at: string;
  guest:Guest,
  messages:Message[],
  chatbot_name:string
}

export interface Message {
  id: number;
  chat_session_id: number;
  content: string;
  sender: 'user' | 'ai';
  created_at: string;
}

export interface CreateChatbotInput{
  clerk_user_id: string | null | undefined;
  name:string;
}
  
export interface CharacteristicInput{
  chatbot_id:string
  content:string
}


export interface UpdateChatbotNAmeInput{
  id:string,
  newName:string
}

export interface StartChat{
  userName:string,
  userEmail:string,
  chatbotId:number
}

export interface AddGuestInput{
  name:string,
  email:string
}

export interface AddSessionInput{
  chatbot_id:number,
  guest_id:number
}
export interface AddMessageInput{
  content:string,
  sender:"ai" | "user",
  chat_session_id:number
}