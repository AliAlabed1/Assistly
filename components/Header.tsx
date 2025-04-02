import Link from "next/link"
import Avatar from "./Avatar"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

const Header = () => {
  return (
    <header className='bg-white shadow-sm text-gray-800 flex justify-between p-5 sticky z-50 top-0'>
        <Link href='/' className="flex text-4xl items-center font-thin">
            <Avatar
                seed = 'PAPAFAM Support Agent'
            />
            <div className="space-y-1 ">
                <h1>Assistly</h1>
                <h2 className="text-sm">Your Customisable AI Chat Agent</h2>
            </div>
        </Link>
        <div className="flex items-center hover:cursor-pointer">
            <SignedIn>
                <UserButton showName/>
            </SignedIn>
            <SignedOut>
                <SignInButton/>
            </SignedOut>
        </div>
    </header>
  )
}

export default Header
