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
import { loadReportsForUser } from "@/store/slices/reports-slice"
import { generateHeatmapData, sampleTasks, sampleAIReports } from "@/data/sample-data"
import type { User } from "@/lib/types"

interface EmployeeProfileViewProps {
  employee: User
  onBack: () => void
}

export function EmployeeProfileView({ employee, onBack }: EmployeeProfileViewProps) {
  const dispatch = useAppDispatch()
  const { dailyReports } = useAppSelector((state) => state.reports)

  useEffect(() => {
    dispatch(loadReportsForUser(employee.id))
  }, [employee.id, dispatch])

  const heatmapData = useMemo(() => generateHeatmapData(employee.id), [employee.id])
  const tasks = useMemo(() => sampleTasks[employee.id] || [], [employee.id])
  const aiReport = useMemo(
    () => sampleAIReports.find((r) => r.userId === employee.id),
    [employee.id]
  )
  const reports = dailyReports[employee.id] || []

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
