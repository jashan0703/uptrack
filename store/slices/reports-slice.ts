import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { DailyReport, Task, AIReport } from "@/lib/types"
import * as api from "@/lib/appwrite/api"

interface ReportsState {
  dailyReports: Record<string, DailyReport[]>
  allTasks: Task[]
  aiReports: AIReport[]
  currentDayTasks: Task[]
  timeFilter: "daily" | "weekly" | "monthly" | "yearly"
  loadedUsers: string[]
}

const initialState: ReportsState = {
  dailyReports: {},
  allTasks: [],
  aiReports: [],
  currentDayTasks: [],
  timeFilter: "weekly",
  loadedUsers: [],
}

export const fetchReportsForUser = createAsyncThunk(
  "reports/fetchReportsForUser",
  async (userId: string) => {
    const reports = await api.listReportsForUser(userId)
    return { userId, reports }
  },
)

export const fetchAllTasks = createAsyncThunk("reports/fetchAllTasks", async () => {
  return api.listAllTasks()
})

export const fetchAIReports = createAsyncThunk("reports/fetchAIReports", async () => {
  return api.listAIReports()
})

export const submitDailyReport = createAsyncThunk(
  "reports/submitDailyReport",
  async ({ userId, date, tasks }: { userId: string; date: string; tasks: Task[] }) => {
    const report = await api.submitDailyReport(userId, date, tasks)
    return { userId, report }
  },
)

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
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
    updateTaskInCurrentDay(
      state,
      action: PayloadAction<{ id: string; updates: Partial<Task> }>,
    ) {
      const idx = state.currentDayTasks.findIndex((t) => t.id === action.payload.id)
      if (idx !== -1) {
        state.currentDayTasks[idx] = { ...state.currentDayTasks[idx], ...action.payload.updates }
      }
    },
    setCurrentDayTasks(state, action: PayloadAction<Task[]>) {
      state.currentDayTasks = action.payload
    },
    setTimeFilter(
      state,
      action: PayloadAction<"daily" | "weekly" | "monthly" | "yearly">,
    ) {
      state.timeFilter = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportsForUser.fulfilled, (state, action) => {
        state.dailyReports[action.payload.userId] = action.payload.reports
        if (!state.loadedUsers.includes(action.payload.userId)) {
          state.loadedUsers.push(action.payload.userId)
        }
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.allTasks = action.payload
      })
      .addCase(fetchAIReports.fulfilled, (state, action) => {
        state.aiReports = action.payload
      })
      .addCase(submitDailyReport.fulfilled, (state, action) => {
        const { userId, report } = action.payload
        const list = state.dailyReports[userId] ?? []
        const existingIdx = list.findIndex((r) => r.date === report.date)
        if (existingIdx !== -1) {
          list[existingIdx] = report
        } else {
          list.unshift(report)
        }
        state.dailyReports[userId] = list
        state.currentDayTasks = []
      })
  },
})

export const {
  addTaskToCurrentDay,
  removeTaskFromCurrentDay,
  toggleTaskComplete,
  updateTaskInCurrentDay,
  setCurrentDayTasks,
  setTimeFilter,
} = reportsSlice.actions
export default reportsSlice.reducer
