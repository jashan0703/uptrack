import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Project } from "@/lib/types"
import { sampleProjects } from "@/data/sample-data"

interface ProjectsState {
  projects: Project[]
  selectedProject: Project | null
}

const initialState: ProjectsState = {
  projects: sampleProjects,
  selectedProject: null,
}

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    addProject(state, action: PayloadAction<Project>) {
      state.projects.push(action.payload)
    },
    updateProject(state, action: PayloadAction<{ id: string; updates: Partial<Project> }>) {
      const idx = state.projects.findIndex((p) => p.id === action.payload.id)
      if (idx !== -1) {
        state.projects[idx] = { ...state.projects[idx], ...action.payload.updates }
      }
    },
    selectProject(state, action: PayloadAction<Project | null>) {
      state.selectedProject = action.payload
    },
  },
})

export const { addProject, updateProject, selectProject } = projectsSlice.actions
export default projectsSlice.reducer
