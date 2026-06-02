"use client"

import { useState } from "react"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ThemeToggle } from "@/components/theme-toggle"
import { LoginModal } from "@/components/login-modal"
import { WorkPulseLogo } from "@/components/workpulse-logo"

export function Navbar() {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <WorkPulseLogo
            animated
            showWordmark
            className="h-8 w-8 transition-transform duration-300 hover:scale-110"
          />

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setLoginOpen(true)}
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="sr-only">Sign in</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sign in</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </nav>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  )
}
