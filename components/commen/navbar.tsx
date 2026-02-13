'use client'
import { ListTodo } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, SignUpButton, useAuth, UserButton } from '@clerk/nextjs'
import {   } from '@clerk/nextjs/server'

const Navbar:React.FC = () => {
    const { userId } = useAuth()
    console.log(userId)

    console.log()
  return (
    <div>
          <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
            
              <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-2">
                      <ListTodo className="size-6 text-primary" />
                      <span className="text-xl font-bold tracking-tight">
                          TaskFlow
                      </span>
                  </div>

                  <header className="flex justify-end items-center p-4 gap-4 h-16">
                  <Button asChild size="sm">
                      <Link href="/task">Get Started</Link>
                  </Button>
                      {/* Show the sign-in and sign-up buttons when the user is signed out */}
                      <SignedOut>
                          <SignInButton />
                          <SignUpButton>
                              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                                  Sign Up
                              </button>
                          </SignUpButton>
                      </SignedOut>
                      {/* Show the user button when the user is signed in */}
                      <SignedIn>
                          <UserButton />
                      </SignedIn>
                  </header>
              </div>
          </nav>
    </div>
  )
}

export default Navbar
