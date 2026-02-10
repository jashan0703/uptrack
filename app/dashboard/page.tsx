"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { EmployeeDashboard } from "@/components/dashboard/employee-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { RootAdminDashboard } from "@/components/dashboard/root-admin-dashboard"
import { useAppSelector } from "@/store/hooks"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, currentUser } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    )
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case "root_admin":
        return <RootAdminDashboard />
      case "admin":
        return <AdminDashboard />
      case "employee":
        return <EmployeeDashboard />
      default:
        return <EmployeeDashboard />
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <DashboardHeader />
      <ScrollArea className="flex-1">
        <main className="mx-auto w-full max-w-7xl">{renderDashboard()}</main>
      </ScrollArea>
    </div>
  )
}
