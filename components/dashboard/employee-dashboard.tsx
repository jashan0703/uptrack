"use client"

import { useEffect, useMemo } from "react"
import { ProfileCard } from "@/components/dashboard/profile-card"
import { ContributionHeatmap } from "@/components/dashboard/heatmap"
import { PerformanceCharts } from "@/components/dashboard/performance-charts"
import { DailyReportForm } from "@/components/dashboard/daily-report-form"
import { PastReports } from "@/components/dashboard/past-reports"
import { AIReviewCard } from "@/components/dashboard/ai-review-card"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { fetchReportsForUser } from "@/store/slices/reports-slice"
import { tasksFromReports, heatmapFromTasks } from "@/lib/derive"

export function EmployeeDashboard() {
  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector((state) => state.auth)
  const { dailyReports, aiReports } = useAppSelector((state) => state.reports)

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

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <ProfileCard user={currentUser} />
      <ContributionHeatmap data={heatmapData} />
      <PerformanceCharts tasks={tasks} />
      <AIReviewCard report={aiReport} />
      <DailyReportForm userId={userId} />
      <PastReports reports={reports} />
    </div>
  )
}
