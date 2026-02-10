"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogIn, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { loginSuccess, loginFailure, clearError } from "@/store/slices/auth-slice"
import { toast } from "sonner"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useAppDispatch()
  const { loginError } = useAppSelector((state) => state.auth)
  const { users } = useAppSelector((state) => state.users)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((r) => setTimeout(r, 800))

    const user = users.find(
      (u) => u.username === username && u.password === password && u.isActive
    )

    if (user) {
      dispatch(loginSuccess(user))
      toast.success(`Welcome back, ${user.name}`)
      onOpenChange(false)
      router.push("/dashboard")
    } else {
      dispatch(loginFailure("Invalid username or password"))
    }
    setIsLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success("Password reset link sent to your email")
    setShowForgotPassword(false)
    setResetEmail("")
    setIsLoading(false)
  }

  const handleClose = (val: boolean) => {
    if (!val) {
      dispatch(clearError())
      setShowForgotPassword(false)
      setUsername("")
      setPassword("")
      setResetEmail("")
    }
    onOpenChange(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {showForgotPassword ? "Reset Password" : "Sign In"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {showForgotPassword
              ? "Enter your email to receive a password reset link."
              : "Enter your credentials to access your dashboard."}
          </DialogDescription>
        </DialogHeader>

        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Enter your email address and we will send you a password reset link.
            </p>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reset-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@copan.dev"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={() => setShowForgotPassword(false)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  dispatch(clearError())
                }}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    dispatch(clearError())
                  }}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {loginError && (
              <p className="text-sm text-destructive">{loginError}</p>
            )}

            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>

            <button
              type="button"
              className="text-sm text-primary hover:underline text-center"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot your password?
            </button>

            <div className="rounded-md border border-border bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">Demo credentials:</p>
              <p className="text-xs text-muted-foreground">
                Admin: <span className="font-mono text-foreground">admin</span> / <span className="font-mono text-foreground">admin123</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Employee: <span className="font-mono text-foreground">vikram.j</span> / <span className="font-mono text-foreground">vikram123</span>
              </p>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
