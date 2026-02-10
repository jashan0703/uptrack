import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { DailyReport, Task, AIReport } from "@/lib/types"
import { generateDailyReports, sampleAIReports } from "@/data/sample-data"

interface ReportsState {
  dailyReports: Record<string, DailyReport[]>
  aiReports: AIReport[]
  currentDayTasks: Task[]
  timeFilter: "daily" | "weekly" | "monthly" | "yearly"
}

const initialState: ReportsState = {
  dailyReports: {},
  aiReports: sampleAIReports,
  currentDayTasks: [],
  timeFilter: "weekly",
}

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    loadReportsForUser(state, action: PayloadAction<string>) {
      const userId = action.payload
      if (!state.dailyReports[userId]) {
        state.dailyReports[userId] = generateDailyReports(userId)
      }
    },
    addTaskToCurrentDay(state, action: PayloadAction<Task>) {
      state.currentDayTasks.push(action.payload)
    },
    removeTaskFromCurrentDay(state, action: PayloadAction<string>) {
      state.currentDayTasks = state.currentDayTasks.filter((t) => t.id !== action.payload)
    },
    toggleTaskComplete(state, action: PayloadAction<string>) {
      const task = state.currentDayTasks.find((t) => t.id === action.payload)
      if (task) task.completed = !task.completed
    },
    updateTaskInCurrentDay(state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) {
      const idx = state.currentDayTasks.findIndex((t) => t.id === action.payload.id)
      if (idx !== -1) {
        state.currentDayTasks[idx] = { ...state.currentDayTasks[idx], ...action.payload.updates }
      }
    },
    submitDailyReport(state, action: PayloadAction<{ userId: string; date: string }>) {
      const { userId, date } = action.payload
      const report: DailyReport = {
        id: `dr-${userId}-${date}`,
        userId,
        date,
        tasks: [...state.currentDayTasks],
        submittedAt: new Date().toISOString(),
        isEditable: true,
      }
      if (!state.dailyReports[userId]) state.dailyReports[userId] = []
      const existingIdx = state.dailyReports[userId].findIndex((r) => r.date === date)
      if (existingIdx !== -1) {
        state.dailyReports[userId][existingIdx] = report
      } else {
        state.dailyReports[userId].unshift(report)
      }
    },
    setTimeFilter(state, action: PayloadAction<"daily" | "weekly" | "monthly" | "yearly">) {
      state.timeFilter = action.payload
    },
    setCurrentDayTasks(state, action: PayloadAction<Task[]>) {
      state.currentDayTasks = action.payload
    },
  },
})

export const {
  loadReportsForUser,
  addTaskToCurrentDay,
  removeTaskFromCurrentDay,
  toggleTaskComplete,
  updateTaskInCurrentDay,
  submitDailyReport,
  setTimeFilter,
  setCurrentDayTasks,
} = reportsSlice.actions
export default reportsSlice.reducer
