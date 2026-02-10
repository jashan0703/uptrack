"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileCard } from "@/components/dashboard/profile-card"
import { ContributionHeatmap } from "@/components/dashboard/heatmap"
import { PerformanceCharts } from "@/components/dashboard/performance-charts"
import { AIReviewCard } from "@/components/dashboard/ai-review-card"
import { PastReports } from "@/components/dashboard/past-reports"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { loadReportsForUser } from "@/store/slices/reports-slice"
import { generateHeatmapData, sampleTasks, sampleAIReports } from "@/data/sample-data"

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { users } = useAppSelector((state) => state.users)
  const { dailyReports } = useAppSelector((state) => state.reports)

  const employee = users.find((u) => u.id === id)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (id) {
      dispatch(loadReportsForUser(id))
    }
  }, [id, dispatch])

  const heatmapData = useMemo(() => generateHeatmapData(id), [id])
  const tasks = useMemo(() => sampleTasks[id] || [], [id])
  const aiReport = useMemo(() => sampleAIReports.find((r) => r.userId === id), [id])
  const reports = dailyReports[id] || []

  if (!isAuthenticated || !employee) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">
          {!employee ? "Employee not found" : "Redirecting..."}
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <DashboardHeader />
      <ScrollArea className="flex-1">
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">
          <div className="flex flex-col gap-6">
            <Button variant="ghost" className="self-start" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <ProfileCard user={employee} />
            <ContributionHeatmap data={heatmapData} />
            <PerformanceCharts tasks={tasks} />
            <AIReviewCard report={aiReport} />
            <PastReports reports={reports} />
          </div>
        </main>
      </ScrollArea>
    </div>
  )
}
