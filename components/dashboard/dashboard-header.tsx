"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ThemeToggle } from "@/components/theme-toggle"
import { WorkPulseLogo } from "@/components/workpulse-logo"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { logoutUser } from "@/store/slices/auth-slice"
import { toast } from "sonner"

export function DashboardHeader() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { currentUser } = useAppSelector((state) => state.auth)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    toast.success("Signed out successfully")
    router.push("/")
  }

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <WorkPulseLogo />
        <div>
          <h1 className="text-sm font-semibold text-card-foreground">WorkPulse</h1>
          <p className="text-xs text-muted-foreground">
            {currentUser?.name} - {currentUser?.jobRole}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sign out</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sign out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  )
}
