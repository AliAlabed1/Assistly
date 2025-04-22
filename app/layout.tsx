import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import  QueryClientProvider  from "./providers/query-provider";
import { Toaster } from "sonner";
import icon from './icon.svg'

export const metadata: Metadata = {
  title: "Assistly",
  description: "Make Use Of AI",
  icons:{
    icon:'/icon.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider>
      <ClerkProvider>
        <html lang="en">
          <body
            className="min-h-screen flex"
          >
            {children}
            <Toaster
              position = 'bottom-center'
            />
          </body>
        </html>
      </ClerkProvider>
    </QueryClientProvider>
    
  );
}
