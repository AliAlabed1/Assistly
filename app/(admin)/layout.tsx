import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const AdminLayout = async({children}: Readonly<{
    children: React.ReactNode; 
}>) => {
  const {userId} = await auth();
  if(!userId){
    return redirect('/login')
  }
  return (
    <div className="felx flex-col flex-1 ">
      <Header/>
      <div className="slex flex flex-col flex-1 md:flex-row bg-gray-100">
        <Sidebar />
        <div className="flex-1 justify-center flex md:justify-start max-w-5xl mx-auto w-full min-h-screen">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
