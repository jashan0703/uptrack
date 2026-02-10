"use client"

import { useMemo } from "react"
import { Users, FolderKanban, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts"
import { useAppSelector } from "@/store/hooks"
import { sampleTasks } from "@/data/sample-data"

export function CompanyOverview() {
  const { users } = useAppSelector((state) => state.users)
  const { projects } = useAppSelector((state) => state.projects)

  const activeUsers = users.filter((u) => u.isActive)
  const activeProjects = projects.filter((p) => p.status === "active")

  // Total tasks across all users
  const allTasks = useMemo(() => {
    return Object.values(sampleTasks).flat()
  }, [])

  const completedTasks = allTasks.filter((t) => t.completed)

  // Stats cards
  const stats = [
    { label: "Total Employees", value: activeUsers.length, icon: Users, color: "text-primary" },
    { label: "Active Projects", value: activeProjects.length, icon: FolderKanban, color: "text-chart-2" },
    { label: "Tasks Completed", value: completedTasks.length, icon: CheckCircle2, color: "text-success" },
    { label: "Avg Hours/Day", value: "5.2h", icon: Clock, color: "text-warning" },
  ]

  // Tasks per project
  const projectTaskData = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const t of allTasks) {
      const project = projects.find((p) => p.id === t.project)
      const name = project?.name || t.project
      counts[name] = (counts[name] || 0) + 1
    }
    return Object.entries(counts).map(([name, count]) => ({ name, tasks: count }))
  }, [allTasks, projects])

  // Department distribution
  const deptData = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const u of activeUsers) {
      counts[u.department] = (counts[u.department] || 0) + 1
    }
    return Object.entries(counts).map(([dept, count]) => ({ dept, count }))
  }, [activeUsers])

  // Weekly task trend (last 8 weeks)
  const weeklyTrend = useMemo(() => {
    const today = new Date("2026-02-10")
    const weeks: Array<{ week: string; tasks: number }> = []

    for (let i = 7; i >= 0; i--) {
      const weekEnd = new Date(today)
      weekEnd.setDate(weekEnd.getDate() - i * 7)
      const weekStart = new Date(weekEnd)
      weekStart.setDate(weekStart.getDate() - 6)

      const startStr = weekStart.toISOString().split("T")[0]
      const endStr = weekEnd.toISOString().split("T")[0]

      const count = allTasks.filter(
        (t) => t.date >= startStr && t.date <= endStr
      ).length

      weeks.push({
        week: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
        tasks: count,
      })
    }
    return weeks
  }, [allTasks])

  // User contribution to projects
  const userContribData = useMemo(() => {
    const data: Array<{ user: string; tasks: number }> = []
    for (const u of activeUsers) {
      if (u.role === "root_admin") continue
      const userTasks = sampleTasks[u.id] || []
      data.push({ user: u.name.split(" ")[0], tasks: userTasks.length })
    }
    return data.sort((a, b) => b.tasks - a.tasks).slice(0, 10)
  }, [activeUsers])

  const COLORS = [
    "hsl(217, 91%, 50%)",
    "hsl(160, 64%, 45%)",
    "hsl(30, 80%, 55%)",
    "hsl(280, 65%, 60%)",
    "hsl(340, 75%, 55%)",
    "hsl(45, 90%, 50%)",
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tasks per Project */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Tasks per Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectTaskData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--card-foreground))",
                    }}
                  />
                  <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptData}
                    dataKey="count"
                    nameKey="dept"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ dept, count }) => `${dept}: ${count}`}
                  >
                    {deptData.map((_, index) => (
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

        {/* Weekly Task Trend */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Weekly Task Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--card-foreground))",
                    }}
                  />
                  <Line type="monotone" dataKey="tasks" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Contributors */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Top Contributors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userContribData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="user" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--card-foreground))",
                    }}
                  />
                  <Bar dataKey="tasks" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
