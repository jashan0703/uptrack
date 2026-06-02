import type { Task, DailyReport, HeatmapData } from "@/lib/types"

/** Flatten a user's daily reports into a single task list. */
export function tasksFromReports(reports: DailyReport[] = []): Task[] {
  return reports.flatMap((r) => r.tasks)
}

/** Count tasks per day for the contribution heatmap. */
export function heatmapFromTasks(tasks: Task[] = []): HeatmapData[] {
  const counts: Record<string, number> = {}
  for (const t of tasks) {
    counts[t.date] = (counts[t.date] || 0) + 1
  }
  return Object.entries(counts).map(([date, count]) => ({ date, count }))
}
