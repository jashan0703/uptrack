import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Project } from "@/lib/types"
import * as api from "@/lib/appwrite/api"

interface ProjectsState {
  projects: Project[]
  selectedProject: Project | null
  status: "idle" | "loading"
}

const initialState: ProjectsState = {
  projects: [],
  selectedProject: null,
  status: "idle",
}

export const fetchProjects = createAsyncThunk("projects/fetchProjects", async () => {
  return api.listProjects()
})

export const addProject = createAsyncThunk(
  "projects/addProject",
  async (data: Omit<Project, "id">) => {
    return api.createProject(data)
  },
)

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, updates }: { id: string; updates: Partial<Omit<Project, "id">> }) => {
    return api.updateProjectDoc(id, updates)
  },
)

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    selectProject(state, action: PayloadAction<Project | null>) {
      state.selectedProject = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "idle"
        state.projects = action.payload
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.status = "idle"
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.projects.push(action.payload)
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.projects.findIndex((p) => p.id === action.payload.id)
        if (idx !== -1) state.projects[idx] = action.payload
      })
  },
})

export const { selectProject } = projectsSlice.actions
export default projectsSlice.reducer
