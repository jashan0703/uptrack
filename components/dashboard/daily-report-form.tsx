"use client"

import { useState } from "react"
import { Plus, Trash2, Check, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { addTaskToCurrentDay, removeTaskFromCurrentDay, toggleTaskComplete, submitDailyReport } from "@/store/slices/reports-slice"
import type { TaskTag } from "@/lib/types"
import { toast } from "sonner"

interface DailyReportFormProps {
  userId: string
}

const tagColors: Record<TaskTag, string> = {
  fix: "bg-destructive/10 text-destructive",
  chore: "bg-muted text-muted-foreground",
  implementation: "bg-primary/10 text-primary",
  review: "bg-chart-4/10 text-chart-4",
  meeting: "bg-warning/10 text-warning",
  documentation: "bg-chart-2/10 text-chart-2",
  testing: "bg-chart-3/10 text-chart-3",
  deployment: "bg-success/10 text-success",
}

export function DailyReportForm({ userId }: DailyReportFormProps) {
  const dispatch = useAppDispatch()
  const { currentDayTasks } = useAppSelector((state) => state.reports)
  const { projects } = useAppSelector((state) => state.projects)

  const [title, setTitle] = useState("")
  const [tag, setTag] = useState<TaskTag>("implementation")
  const [project, setProject] = useState("")
  const [timeTaken, setTimeTaken] = useState("")

  const handleAddTask = () => {
    if (!title.trim() || !project) {
      toast.error("Please fill in all fields")
      return
    }

    dispatch(
      addTaskToCurrentDay({
        id: `task-${Date.now()}`,
        title: title.trim(),
        description: "",
        tag,
        project,
        completed: false,
        timeTaken: Number.parseFloat(timeTaken) || 1,
        date: "2026-02-10",
        userId,
      })
    )
    setTitle("")
    setTimeTaken("")
  }

  const handleSubmit = async () => {
    if (currentDayTasks.length === 0) {
      toast.error("Add at least one task before submitting")
      return
    }
    try {
      await dispatch(
        submitDailyReport({ userId, date: "2026-02-10", tasks: currentDayTasks }),
      ).unwrap()
      toast.success("Daily report submitted successfully")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit report")
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base font-semibold text-card-foreground">
          <span>Daily Progress Report</span>
          <span className="text-xs font-normal text-muted-foreground">Feb 10, 2026</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Add Task Form */}
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-title" className="text-sm">Task</Label>
            <Input
              id="task-title"
              placeholder="What did you work on?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Tag</Label>
              <Select value={tag} onValueChange={(v) => setTag(v as TaskTag)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fix">Fix</SelectItem>
                  <SelectItem value="chore">Chore</SelectItem>
                  <SelectItem value="implementation">Implementation</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="deployment">Deployment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Project</Label>
              <Select value={project} onValueChange={setProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Hours</Label>
              <Input
                type="number"
                min="0.5"
                step="0.5"
                placeholder="1.0"
                value={timeTaken}
                onChange={(e) => setTimeTaken(e.target.value)}
              />
            </div>
          </div>
          <Button variant="outline" className="self-end bg-transparent" onClick={handleAddTask}>
            <Plus className="mr-1 h-4 w-4" />
            Add Task
          </Button>
        </div>

        {/* Task List */}
        {currentDayTasks.length > 0 && (
          <div className="flex flex-col gap-2">
            {currentDayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => dispatch(toggleTaskComplete(task.id))}
                />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${task.completed ? "text-muted-foreground line-through" : "text-card-foreground"}`}>
                    {task.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary" className={`text-xs ${tagColors[task.tag]}`}>
                      {task.tag}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {projects.find((p) => p.id === task.project)?.name} - {task.timeTaken}h
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => dispatch(removeTaskFromCurrentDay(task.id))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Summary and Submit */}
        {currentDayTasks.length > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4" />
                {currentDayTasks.filter((t) => t.completed).length}/{currentDayTasks.length} completed
              </span>
            </div>
            <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Send className="mr-1 h-4 w-4" />
              Submit Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
