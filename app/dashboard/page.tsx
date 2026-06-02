"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { EmployeeDashboard } from "@/components/dashboard/employee-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { RootAdminDashboard } from "@/components/dashboard/root-admin-dashboard"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { fetchUsers } from "@/store/slices/users-slice"
import { fetchProjects } from "@/store/slices/projects-slice"
import { fetchAIReports } from "@/store/slices/reports-slice"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DashboardPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, authChecked, currentUser } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (authChecked && !isAuthenticated) {
      router.push("/")
    }
  }, [authChecked, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUsers())
      dispatch(fetchProjects())
      dispatch(fetchAIReports())
    }
  }, [isAuthenticated, dispatch])

  if (!authChecked || !isAuthenticated || !currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">
          {authChecked ? "Redirecting to login..." : "Loading..."}
        </p>
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
