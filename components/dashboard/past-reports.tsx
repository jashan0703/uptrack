"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { DailyReport, TaskTag } from "@/lib/types"
import { useAppSelector } from "@/store/hooks"

interface PastReportsProps {
  reports: DailyReport[]
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

export function PastReports({ reports }: PastReportsProps) {
  const [expandedReport, setExpandedReport] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(10)
  const { projects } = useAppSelector((state) => state.projects)

  const visibleReports = reports.slice(0, visibleCount)

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-card-foreground">
          <Calendar className="h-4 w-4" />
          Past Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="flex flex-col gap-2 pr-4">
            {visibleReports.map((report) => (
              <div key={report.id} className="rounded-lg border border-border">
                <button
                  type="button"
                  className="flex w-full items-center justify-between p-3 text-left hover:bg-muted/30"
                  onClick={() =>
                    setExpandedReport(expandedReport === report.id ? null : report.id)
                  }
                >
                  <div className="flex items-center gap-3">
                    {expandedReport === report.id ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium text-card-foreground">{report.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {report.tasks.length} task{report.tasks.length !== 1 ? "s" : ""}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={report.tasks.filter((t) => t.completed).length === report.tasks.length ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}
                    >
                      {report.tasks.filter((t) => t.completed).length}/{report.tasks.length}
                    </Badge>
                  </div>
                </button>

                {expandedReport === report.id && (
                  <div className="border-t border-border p-3">
                    <div className="flex flex-col gap-2">
                      {report.tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between rounded-md bg-muted/30 p-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${task.completed ? "bg-success" : "bg-warning"}`} />
                            <span className="text-card-foreground">{task.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={`text-xs ${tagColors[task.tag]}`}>
                              {task.tag}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {projects.find((p) => p.id === task.project)?.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {visibleCount < reports.length && (
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => setVisibleCount((prev) => prev + 10)}
              >
                Load more ({reports.length - visibleCount} remaining)
              </Button>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
