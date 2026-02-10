"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { setTimeFilter } from "@/store/slices/reports-slice"
import type { Task } from "@/lib/types"

interface PerformanceChartsProps {
  tasks: Task[]
}

export function PerformanceCharts({ tasks }: PerformanceChartsProps) {
  const dispatch = useAppDispatch()
  const { timeFilter } = useAppSelector((state) => state.reports)

  const filteredTasks = useMemo(() => {
    const today = new Date("2026-02-10")
    let startDate: Date

    switch (timeFilter) {
      case "daily":
        startDate = new Date(today)
        break
      case "weekly":
        startDate = new Date(today)
        startDate.setDate(startDate.getDate() - 7)
        break
      case "monthly":
        startDate = new Date(today)
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case "yearly":
        startDate = new Date(today)
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      default:
        startDate = new Date(today)
        startDate.setDate(startDate.getDate() - 7)
    }

    const startStr = startDate.toISOString().split("T")[0]
    return tasks.filter((t) => t.date >= startStr)
  }, [tasks, timeFilter])

  // Tasks by tag
  const tagData = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const t of filteredTasks) {
      counts[t.tag] = (counts[t.tag] || 0) + 1
    }
    return Object.entries(counts).map(([tag, count]) => ({ tag, count }))
  }, [filteredTasks])

  // Tasks by project
  const projectData = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const t of filteredTasks) {
      counts[t.project] = (counts[t.project] || 0) + 1
    }
    return Object.entries(counts).map(([project, count]) => ({ project, count }))
  }, [filteredTasks])

  // Time spent data
  const timeData = useMemo(() => {
    const groups: Record<string, number> = {}
    for (const t of filteredTasks) {
      const key = timeFilter === "yearly" ? t.date.substring(0, 7) : t.date
      groups[key] = (groups[key] || 0) + t.timeTaken
    }
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, hours]) => ({ date, hours: Math.round(hours * 10) / 10 }))
  }, [filteredTasks, timeFilter])

  const COLORS = [
    "hsl(217, 91%, 50%)",
    "hsl(160, 64%, 45%)",
    "hsl(30, 80%, 55%)",
    "hsl(280, 65%, 60%)",
    "hsl(340, 75%, 55%)",
    "hsl(45, 90%, 50%)",
    "hsl(190, 70%, 45%)",
    "hsl(0, 75%, 55%)",
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Performance Overview</h3>
        <Select value={timeFilter} onValueChange={(v) => dispatch(setTimeFilter(v as "daily" | "weekly" | "monthly" | "yearly"))}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Today</SelectItem>
            <SelectItem value="weekly">This Week</SelectItem>
            <SelectItem value="monthly">This Month</SelectItem>
            <SelectItem value="yearly">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tasks by Type */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Tasks by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tagData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="tag" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--card-foreground))",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tasks by Project */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Tasks by Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectData}
                    dataKey="count"
                    nameKey="project"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ project, count }) => `${project}: ${count}`}
                  >
                    {projectData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--card-foreground))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Time Spent */}
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Time Spent (hours)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--card-foreground))",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="hours" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
