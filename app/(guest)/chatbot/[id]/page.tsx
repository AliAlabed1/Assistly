'use client'
import { use, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Guest, Message } from "@/types/database";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { startNewChatSession } from "@/lib/utils";
const page = ({params}:{params:Promise<{id:string}>}) => {
    const [name,setName] = useState<string>('');
    const [email,setEmail] = useState<string>('');
    const [isOpen,setIsOpen] = useState<boolean>(true)
    const [sessionId,setSessionId] = useState<number>(0)
    const [loading,setLoading] = useState<boolean>(false)
    const [messages,setMessages] = useState<Message[]>([])
    const {id} = use(params)
    const handleSubmition = async (e:React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);
        const data = await startNewChatSession({userName:name,userEmail:email,chatbotId:parseInt(id)})
        setSessionId(data.sessionId)
        setLoading(false)
        setIsOpen(false)
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
        </div>
    )
}

export default page
