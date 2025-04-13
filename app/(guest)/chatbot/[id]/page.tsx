'use client'
import { use, useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Message, SendMessageInput } from "@/types/database";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { startNewChatSession } from "@/lib/utils";
import Avatar from "@/components/Avatar";
import { useChatbotQuery, useGetMessagesQery } from "@/lib/queries";
import Messages from "@/components/Messages";
import {z} from 'zod'
import {  useForm } from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod'
import { Form,FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { addNewMessage } from "@/lib/api";
import { toast } from "sonner";
const formScheme = z.object({
    message:z.string().min(2,'Your Message is too short')
})
const page = ({params}:{params:Promise<{id:string}>}) => {
    const [name,setName] = useState<string>('');
    const [email,setEmail] = useState<string>('');
    const [isOpen,setIsOpen] = useState<boolean>(true)
    const [sessionId,setSessionId] = useState<number>(0)
    const [loading,setLoading] = useState<boolean>(false)
    const [messages,setMessages] = useState<Message[]>([])
    const {id} = use(params)
    const {data:chatbotData} =  useChatbotQuery(id)
    const sendMessageMutation = useMutation<Message,Error,SendMessageInput>({
        mutationFn:addNewMessage,
        onSuccess:()=>console.log('sended Message'),
        onError:()=>console.log('failed to send message')
        
    })
    const handleSubmition = async (e:React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);
        const data = await startNewChatSession({userName:name,userEmail:email,chatbotId:parseInt(id)})
        setSessionId(data.sessionId)
        setLoading(false)
        setIsOpen(false)
    }
    const {data:messagesData} = useGetMessagesQery(sessionId)
    useEffect(()=>{
        if(messagesData){
            setMessages(messagesData);
        }
    },[messagesData])

    const form = useForm<z.infer<typeof formScheme>>({
        resolver:zodResolver(formScheme),
        defaultValues:{
            message:''
        }
    })
    const onSubmit = async(values:z.infer<typeof formScheme>)=>{
        setLoading(true)
        const {message:formMessage} = values;
        const message = formMessage;
        form.reset();
        if(!name||!email){
            setIsOpen(true);
            setLoading(false);
            return;
        }

        if(!message.trim()) return;

        const userMessages:Message = {
            id:Date.now(),
            content:message,
            created_at:new Date().toISOString(),
            chat_session_id:sessionId,
            sender:'user'
        }

        const loadingMessage:Message = {
            id:Date.now() + 1 ,
            content:"Thinking...",
            created_at:new Date().toISOString(),
            chat_session_id:sessionId,
            sender:'ai'
        }

        setMessages([...messages,userMessages,loadingMessage])
        try {
            const response = await fetch('/send-message',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    name:name,
                    chat_session_id:sessionId,
                    chatbot_id:id,
                    content:message
                })
            })

            const result = await response.json()
            console.log('result',result)
            setMessages((prevMessages)=>
                prevMessages.map((msg)=>
                    msg.id === loadingMessage.id ?
                    {...msg,content:result.content,id:result.id}:
                    msg
                )
            )
        } catch (error) {
            toast.error("Unexpected Error")
        }
    }
    return (
        <div className="w-full flex bg-gray-100">
            <Dialog
                open = {isOpen}
                onOpenChange={setIsOpen}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSubmition}>
                        <DialogHeader>
                            <DialogTitle>Let's help you out!</DialogTitle>
                            <DialogDescription>I just need a few details to get started
                            </DialogDescription>
                        </DialogHeader>
                        <div className=" grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor='name' className = 'text-right'>
                                    Name
                                </Label>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e)=>setName(e.target.value)}
                                    placeholder="john"
                                    className="col-span-3"
                                    name="name"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor='email' className = 'text-right'>
                                    Email
                                </Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="col-span-3"
                                    name="email"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className="self-end" type="submit" disabled={!name||!email || loading}>
                                {!loading ? "Continue" : "Loading.."}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <div className="flex flex-col w-full max-w-3xl mx-auto bg-white md:rounded-t-lg shadow-2xl md:mt-10">
                {
                    chatbotData && sessionId &&  (
                        <>
                            <div className="pb-4 border-b sticky top-0 z-50 bg-[#4D7DFB] py-5 rounded-t-lg flex items-center space-x-4">
                            <Avatar
                                seed = {chatbotData?.name}
                                className="h-12 w-12 bg-white rounded-full border-2 border-white"
                            />
                                <div>
                                    <h1 className="truncate text-lg">{chatbotData?.name}</h1>
                                    <p className='text-sm text-gray-300'>⚡️ Typically replies Instantly</p> 
                                </div>
                            </div>
                            <Messages
                                messages={messages}
                                chatbotName={chatbotData?.name}
                                chatSessionId={sessionId}
                                guestName={name}
                            />
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start sticky bottom-0 z-50 space-x-4 drop-shadow-lg p-4 bg-gray-100 rounded-md ">
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({field})=>(
                                            <FormItem className="flex-1">
                                                <FormLabel hidden>Message</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Type a message..."
                                                        {...field}
                                                        className="p-8"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" disabled = {form.formState.isSubmitting || !form.formState.isValid} className="h-full">Send</Button>
                                </form>
                            </Form>
                        </>
                    )
                }
                
            </div>
        </div>
    )
}

export default page
