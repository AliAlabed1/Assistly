import { StartChat } from "@/types/database"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const startNewChat = async(input:StartChat) =>{
  
}
