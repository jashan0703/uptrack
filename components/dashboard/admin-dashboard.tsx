"use client"

import { useEffect, useMemo, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileCard } from "@/components/dashboard/profile-card"
import { ContributionHeatmap } from "@/components/dashboard/heatmap"
import { PerformanceCharts } from "@/components/dashboard/performance-charts"
import { DailyReportForm } from "@/components/dashboard/daily-report-form"
import { PastReports } from "@/components/dashboard/past-reports"
import { AIReviewCard } from "@/components/dashboard/ai-review-card"
import { EmployeeList } from "@/components/dashboard/employee-list"
import { OnboardEmployee } from "@/components/dashboard/onboard-employee"
import { EmployeeProfileView } from "@/components/dashboard/employee-profile-view"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { fetchReportsForUser } from "@/store/slices/reports-slice"
import { tasksFromReports, heatmapFromTasks } from "@/lib/derive"
import type { User } from "@/lib/types"

export function AdminDashboard() {
  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector((state) => state.auth)
  const { dailyReports, aiReports } = useAppSelector((state) => state.reports)
  const [viewingEmployee, setViewingEmployee] = useState<User | null>(null)

  const userId = currentUser?.id || ""

  useEffect(() => {
    if (userId) {
      dispatch(fetchReportsForUser(userId))
    }
  }, [userId, dispatch])

  const reports = useMemo(() => dailyReports[userId] || [], [dailyReports, userId])
  const tasks = useMemo(() => tasksFromReports(reports), [reports])
  const heatmapData = useMemo(() => heatmapFromTasks(tasks), [tasks])
  const aiReport = useMemo(
    () => aiReports.find((r) => r.userId === userId),
    [aiReports, userId]
  )

  if (!currentUser) return null

  if (viewingEmployee) {
    return (
      <div className="p-4 sm:p-6">
        <EmployeeProfileView
          employee={viewingEmployee}
          onBack={() => setViewingEmployee(null)}
        />
      </div>
    )
  }

  const canRemove = currentUser.accessLevel === "manage_team" || currentUser.accessLevel === "full"

  return (
    <div className="p-4 sm:p-6">
      <Tabs defaultValue="my-dashboard" className="flex flex-col gap-6">
        <TabsList className="self-start">
          <TabsTrigger value="my-dashboard">My Dashboard</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
          <TabsTrigger value="onboard">Onboard</TabsTrigger>
        </TabsList>

        <TabsContent value="my-dashboard" className="flex flex-col gap-6">
          <ProfileCard user={currentUser} />
          <ContributionHeatmap data={heatmapData} />
          <PerformanceCharts tasks={tasks} />
          <AIReviewCard report={aiReport} />
          <DailyReportForm userId={userId} />
          <PastReports reports={reports} />
        </TabsContent>

        <TabsContent value="team" className="flex flex-col gap-6">
          <EmployeeList
            canRemove={canRemove}
            onViewProfile={setViewingEmployee}
            filterByManager={currentUser.id}
          />
        </TabsContent>

        <TabsContent value="onboard" className="flex flex-col gap-6">
          <OnboardEmployee
            maxRole={currentUser.role}
            maxAccessLevel={currentUser.accessLevel}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
