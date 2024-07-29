"use client"
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <div className="flex w-full justify-start p-5">
      <a href="/">
        <div className="flex flex-row items-center justify-center md:ml-20">
         <img src='/favicon.ico' className='w-20 h-20' />
          <span className="ml-2 font-bold select-none">
            IMC
          </span>
        </div>
      </a>
      <div className="flex w-full justify-end items-center md:mr-20">
        {status === 'authenticated' ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="w-12 h-12">
                  <AvatarImage src={session.user.image ?? undefined} />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='p-2 text-center bg-neutral-100 border-zinc-700'>
              <DropdownMenuItem asChild>
                  <a href="/assets">Assets</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/admin/report">Reports</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/admin/dashboard">Dashboard</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/settings">Settings</a>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <a href="/login">
            <button className="rounded px-3 py-1.5 text-sm text-[#fcfcfb] transition-colors bg-zinc-900 hover:bg-zinc-700 select-none">
              <span>Get started</span>
            </button>
          </a>
        )}
      </div>
    </div>
  )
}