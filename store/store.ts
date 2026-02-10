import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/auth-slice"
import usersReducer from "./slices/users-slice"
import projectsReducer from "./slices/projects-slice"
import reportsReducer from "./slices/reports-slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    projects: projectsReducer,
    reports: reportsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
