"use client"

import { useMemo, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileCard } from "@/components/dashboard/profile-card"
import { ContributionHeatmap } from "@/components/dashboard/heatmap"
import { PerformanceCharts } from "@/components/dashboard/performance-charts"
import { AIReviewCard } from "@/components/dashboard/ai-review-card"
import { PastReports } from "@/components/dashboard/past-reports"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchReportsForUser } from "@/store/slices/reports-slice"
import { tasksFromReports, heatmapFromTasks } from "@/lib/derive"
import type { User } from "@/lib/types"

interface EmployeeProfileViewProps {
  employee: User
  onBack: () => void
}

export function EmployeeProfileView({ employee, onBack }: EmployeeProfileViewProps) {
  const dispatch = useAppDispatch()
  const { dailyReports, aiReports } = useAppSelector((state) => state.reports)

  useEffect(() => {
    dispatch(fetchReportsForUser(employee.id))
  }, [employee.id, dispatch])

  const reports = useMemo(() => dailyReports[employee.id] || [], [dailyReports, employee.id])
  const tasks = useMemo(() => tasksFromReports(reports), [reports])
  const heatmapData = useMemo(() => heatmapFromTasks(tasks), [tasks])
  const aiReport = useMemo(
    () => aiReports.find((r) => r.userId === employee.id),
    [aiReports, employee.id]
  )

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" className="self-start" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      <ProfileCard user={employee} />
      <ContributionHeatmap data={heatmapData} />
      <PerformanceCharts tasks={tasks} />
      <AIReviewCard report={aiReport} />
      <PastReports reports={reports} />
    </div>
  )
}
