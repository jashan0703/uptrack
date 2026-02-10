"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { HeatmapData } from "@/lib/types"

interface HeatmapProps {
  data: HeatmapData[]
  title?: string
}

export function ContributionHeatmap({ data, title = "Contribution Activity" }: HeatmapProps) {
  const { weeks, months } = useMemo(() => {
    const today = new Date("2026-02-10")
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 364)
    // Move start to Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay())

    const dataMap: Record<string, number> = {}
    for (const d of data) {
      dataMap[d.date] = d.count
    }

    const weeksArr: Array<Array<{ date: string; count: number; day: number }>> = []
    const monthsArr: Array<{ label: string; col: number }> = []
    let currentWeek: Array<{ date: string; count: number; day: number }> = []
    let lastMonth = -1

    const current = new Date(startDate)
    let weekIndex = 0

    while (current <= today) {
      const dateStr = current.toISOString().split("T")[0]
      const day = current.getDay()
      const month = current.getMonth()

      if (day === 0 && currentWeek.length > 0) {
        weeksArr.push(currentWeek)
        currentWeek = []
        weekIndex++
      }

      if (month !== lastMonth) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        monthsArr.push({ label: monthNames[month], col: weekIndex })
        lastMonth = month
      }

      currentWeek.push({
        date: dateStr,
        count: dataMap[dateStr] || 0,
        day,
      })

      current.setDate(current.getDate() + 1)
    }

    if (currentWeek.length > 0) {
      weeksArr.push(currentWeek)
    }

    return { weeks: weeksArr, months: monthsArr }
  }, [data])

  const getColor = (count: number) => {
    if (count === 0) return "bg-muted"
    if (count <= 1) return "bg-primary/20"
    if (count <= 2) return "bg-primary/40"
    if (count <= 3) return "bg-primary/60"
    return "bg-primary/90"
  }

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""]

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-card-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-flex flex-col gap-1">
            {/* Month labels */}
            <div className="flex gap-[3px] pl-8">
              {months.map((m, i) => (
                <div
                  key={`${m.label}-${i}`}
                  className="text-xs text-muted-foreground"
                  style={{
                    position: "relative",
                    left: `${m.col * 15}px`,
                  }}
                >
                  {m.label}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-1">
              {/* Day labels */}
              <div className="flex flex-col gap-[3px] pr-1">
                {dayLabels.map((label, i) => (
                  <div key={i} className="h-[13px] text-xs leading-[13px] text-muted-foreground">
                    {label}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              <div className="flex gap-[3px]">
                <TooltipProvider>
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {Array.from({ length: 7 }).map((_, di) => {
                        const cell = week.find((c) => c.day === di)
                        if (!cell) {
                          return <div key={di} className="h-[13px] w-[13px]" />
                        }
                        return (
                          <Tooltip key={di}>
                            <TooltipTrigger asChild>
                              <div
                                className={`h-[13px] w-[13px] rounded-sm ${getColor(cell.count)} transition-colors`}
                              />
                            </TooltipTrigger>
                            <TooltipContent className="text-xs">
                              <p>
                                {cell.count} task{cell.count !== 1 ? "s" : ""} on {cell.date}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )
                      })}
                    </div>
                  ))}
                </TooltipProvider>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-2 flex items-center justify-end gap-1 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="h-[13px] w-[13px] rounded-sm bg-muted" />
              <div className="h-[13px] w-[13px] rounded-sm bg-primary/20" />
              <div className="h-[13px] w-[13px] rounded-sm bg-primary/40" />
              <div className="h-[13px] w-[13px] rounded-sm bg-primary/60" />
              <div className="h-[13px] w-[13px] rounded-sm bg-primary/90" />
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
