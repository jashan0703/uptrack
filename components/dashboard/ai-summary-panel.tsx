"use client"

import { useEffect, useState } from "react"
import { Brain, User, FolderKanban, Building2, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchAllTasks } from "@/store/slices/reports-slice"

export function AISummaryPanel() {
  const dispatch = useAppDispatch()
  const { users } = useAppSelector((state) => state.users)
  const { projects } = useAppSelector((state) => state.projects)
  const { allTasks } = useAppSelector((state) => state.reports)

  useEffect(() => {
    dispatch(fetchAllTasks())
  }, [dispatch])

  const [selectedUser, setSelectedUser] = useState("")
  const [selectedProject, setSelectedProject] = useState("")
  const [summaryType, setSummaryType] = useState("employee")
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState("")

  const activeUsers = users.filter((u) => u.isActive && u.role !== "root_admin")

  const generateEmployeeSummary = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return ""
    const tasks = allTasks.filter((t) => t.userId === userId)
    const recent = tasks.filter((t) => t.date >= "2026-01-01")
    const completed = recent.filter((t) => t.completed)
    const tagCounts: Record<string, number> = {}
    for (const t of recent) {
      tagCounts[t.tag] = (tagCounts[t.tag] || 0) + 1
    }
    const topTag = Object.entries(tagCounts).sort(([, a], [, b]) => b - a)[0]
    const avgHours = recent.length > 0 ? (recent.reduce((sum, t) => sum + t.timeTaken, 0) / recent.length).toFixed(1) : "0"

    return `**Employee Summary: ${user.name}**\n\n${user.name} (${user.jobRole}, ${user.department}) has completed ${completed.length} out of ${recent.length} tasks since January 2026. Their primary focus area has been "${topTag?.[0] || "N/A"}" tasks (${topTag?.[1] || 0} tasks). Average time per task is ${avgHours} hours.\n\nThe completion rate stands at ${recent.length > 0 ? Math.round((completed.length / recent.length) * 100) : 0}%, which is ${completed.length / recent.length > 0.85 ? "above" : "below"} the team average. ${user.name} has been consistently delivering across multiple projects and shows strong commitment to deadlines.`
  }

  const generateProjectSummary = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (!project) return ""
    const allProjectTasks = allTasks.filter(
      (t) => t.project === projectId && t.date >= "2026-01-01",
    )
    const completed = allProjectTasks.filter((t) => t.completed)
    const contributors = new Set(allProjectTasks.map((t) => t.userId))

    return `**Project Summary: ${project.name}**\n\nStatus: ${project.status.toUpperCase()}\n\n${project.description}\n\nSince January 2026, this project has had ${allProjectTasks.length} tasks logged by ${contributors.size} team members. ${completed.length} tasks have been completed (${allProjectTasks.length > 0 ? Math.round((completed.length / allProjectTasks.length) * 100) : 0}% completion rate).\n\nThe project is ${project.status === "active" ? "progressing well with consistent contributions from the team" : project.status === "completed" ? "successfully completed within the planned timeline" : "currently on hold pending resource allocation"}.`
  }

  const generateCompanySummary = () => {
    const recentTasks = allTasks.filter((t) => t.date >= "2026-01-01")
    const completed = recentTasks.filter((t) => t.completed)
    const activeEmployees = users.filter((u) => u.isActive && u.role !== "root_admin").length
    const activeProjectCount = projects.filter((p) => p.status === "active").length

    const completionRate = recentTasks.length > 0 ? Math.round((completed.length / recentTasks.length) * 100) : 0
    const avgPerEmployee = activeEmployees > 0 ? Math.round(recentTasks.length / activeEmployees) : 0
    return `**Company Overview - Q1 2026**\n\nWorkPulse currently has ${activeEmployees} active employees across ${new Set(users.map((u) => u.department)).size} departments, working on ${activeProjectCount} active projects.\n\nSince January 2026:\n- Total tasks logged: ${recentTasks.length}\n- Tasks completed: ${completed.length} (${completionRate}% completion rate)\n- Average tasks per employee: ${avgPerEmployee}\n\nThe engineering department continues to be the largest contributor, with strong output across all active projects. Overall productivity metrics are healthy, with consistent daily task submissions and high completion rates across the organization.`
  }

  const handleGenerate = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))

    let result = ""
    switch (summaryType) {
      case "employee":
        result = generateEmployeeSummary(selectedUser)
        break
      case "project":
        result = generateProjectSummary(selectedProject)
        break
      case "company":
        result = generateCompanySummary()
        break
    }
    setSummary(result)
    setLoading(false)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-card-foreground">
          <Brain className="h-4 w-4 text-primary" />
          AI Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Tabs value={summaryType} onValueChange={setSummaryType}>
          <TabsList>
            <TabsTrigger value="employee" className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              Employee
            </TabsTrigger>
            <TabsTrigger value="project" className="flex items-center gap-1">
              <FolderKanban className="h-3.5 w-3.5" />
              Project
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              Company
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employee" className="mt-3">
            <div className="flex items-center gap-3">
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {activeUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} - {u.jobRole}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleGenerate}
                disabled={!selectedUser || loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Brain className="mr-1 h-4 w-4" />}
                Generate
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="project" className="mt-3">
            <div className="flex items-center gap-3">
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleGenerate}
                disabled={!selectedProject || loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Brain className="mr-1 h-4 w-4" />}
                Generate
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="company" className="mt-3">
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Brain className="mr-1 h-4 w-4" />}
              Generate Company Summary
            </Button>
          </TabsContent>
        </Tabs>

        {summary && (
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="whitespace-pre-line text-sm leading-relaxed text-card-foreground">
              {summary.split("**").map((part, i) =>
                i % 2 === 1 ? (
                  <strong key={i}>{part}</strong>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
