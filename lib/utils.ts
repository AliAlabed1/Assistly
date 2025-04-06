import { AddGuestInput, Guest, StartChat } from "@/types/database"
import { useMutation } from "@tanstack/react-query"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { addGuest, addNewMessage, addSession } from "./api"
import { toast } from "sonner"

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
