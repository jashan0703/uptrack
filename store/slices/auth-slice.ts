import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@/lib/types"

interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  loginError: string | null
}

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  loginError: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<User>) {
      state.currentUser = action.payload
      state.isAuthenticated = true
      state.loginError = null
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loginError = action.payload
      state.isAuthenticated = false
      state.currentUser = null
    },
    logout(state) {
      state.currentUser = null
      state.isAuthenticated = false
      state.loginError = null
    },
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload }
      }
    },
    clearError(state) {
      state.loginError = null
    },
  },
})

export const { loginSuccess, loginFailure, logout, updateProfile, clearError } = authSlice.actions
export default authSlice.reducer
