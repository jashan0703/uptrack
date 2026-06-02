"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogIn, UserPlus, Mail, ArrowLeft, Eye, EyeOff, Shield } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { login, signup, clearError } from "@/store/slices/auth-slice"
import { toast } from "sonner"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Mode = "signin" | "signup"

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [mode, setMode] = useState<Mode>("signin")
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useAppDispatch()
  const { loginError } = useAppSelector((state) => state.auth)
  const router = useRouter()

  // Optional demo quick-login. Credentials are read from public env vars
  // (never hardcoded); the button only shows when both are configured.
  const demoAdminEmail = process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL
  const demoAdminPassword = process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD
  const demoEnabled = Boolean(demoAdminEmail && demoAdminPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === "signup") {
        if (password.length < 8) {
          toast.error("Password must be at least 8 characters")
          setIsLoading(false)
          return
        }
        const user = await dispatch(signup({ name, username, email, password })).unwrap()
        toast.success(`Welcome, ${user.name}`)
      } else {
        const user = await dispatch(login({ email, password })).unwrap()
        toast.success(`Welcome back, ${user.name}`)
      }
      onOpenChange(false)
      router.push("/dashboard")
    } catch {
      // Error message is surfaced via the auth slice's loginError.
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoAdmin = async () => {
    if (!demoAdminEmail || !demoAdminPassword) return
    setIsLoading(true)
    try {
      const user = await dispatch(
        login({ email: demoAdminEmail, password: demoAdminPassword }),
      ).unwrap()
      toast.success(`Welcome back, ${user.name}`)
      onOpenChange(false)
      router.push("/dashboard")
    } catch {
      // Error surfaced via the auth slice's loginError.
    } finally {
      setIsLoading(false)
    }
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

  const switchMode = (next: Mode) => {
    dispatch(clearError())
    setMode(next)
  }

  const handleClose = (val: boolean) => {
    if (!val) {
      dispatch(clearError())
      setShowForgotPassword(false)
      setMode("signin")
      setName("")
      setUsername("")
      setEmail("")
      setPassword("")
      setResetEmail("")
    }
    onOpenChange(val)
  }

  const title = showForgotPassword
    ? "Reset Password"
    : mode === "signup"
      ? "Create Account"
      : "Sign In"
  const description = showForgotPassword
    ? "Enter your email to receive a password reset link."
    : mode === "signup"
      ? "Sign up to start tracking your work."
      : "Enter your credentials to access your dashboard."

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {description}
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
                  placeholder="you@workpulse.dev"
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
          <div className="flex flex-col gap-4">
            {mode === "signin" && demoEnabled && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full transition-transform duration-200 hover:-translate-y-0.5"
                  onClick={handleDemoAdmin}
                  disabled={isLoading}
                >
                  <Shield className="mr-2 h-4 w-4 text-primary" />
                  Login as Admin (demo)
                </Button>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === "signup" && (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        dispatch(clearError())
                      }}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="jane.d"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value)
                        dispatch(clearError())
                      }}
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@workpulse.dev"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
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
                    placeholder={mode === "signup" ? "At least 8 characters" : "Enter your password"}
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

              {loginError && <p className="text-sm text-destructive">{loginError}</p>}

              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? (
                  mode === "signup" ? "Creating account..." : "Signing in..."
                ) : mode === "signup" ? (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>

              {mode === "signin" ? (
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot your password?
                  </button>
                  <p className="text-sm text-muted-foreground">
                    {"Don't have an account? "}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => switchMode("signup")}
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => switchMode("signin")}
                  >
                    Sign in
                  </button>
                </p>
              )}
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
